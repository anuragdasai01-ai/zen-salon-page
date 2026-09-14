// Server-only Google Sheets access through the Lovable connector gateway.
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_NAME = "Bookings";
const READ_RANGE = `${SHEET_NAME}!A2:J`;
const CACHE_TTL_MS = 30_000;

export type SheetSlot = { booking_date: string; start_time: string; duration_min: number };

type Cache = { at: number; rows: SheetSlot[] };
let cache: Cache | null = null;

function config() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  const spreadsheetId = process.env["GOOGLE_SHEETS_BOOKINGS_SPREADSHEET_ID"];
  if (!lovableKey || !connectionKey || !spreadsheetId) return null;
  return { lovableKey, connectionKey, spreadsheetId };
}

function headers(c: NonNullable<ReturnType<typeof config>>) {
  return {
    Authorization: `Bearer ${c.lovableKey}`,
    "X-Connection-Api-Key": c.connectionKey,
    "Content-Type": "application/json",
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Sheets may hand back a hand-typed date as a serial number. Normalise to YYYY-MM-DD. */
function normalizeDate(value: unknown): string | null {
  if (typeof value === "number") {
    const ms = Math.round((value - 25569) * 86400000);
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  }
  const s = String(value ?? "").trim();
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return `${iso[1]}-${pad(Number(iso[2]))}-${pad(Number(iso[3]))}`;
  const dmy = s.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (dmy) return `${dmy[3]}-${pad(Number(dmy[2]))}-${pad(Number(dmy[1]))}`;
  return null;
}

/** Normalise a cell to HH:MM (handles "10:30", "10:30:00", "10:30 AM" and time serials). */
function normalizeTime(value: unknown): string | null {
  if (typeof value === "number" && value >= 0 && value < 1) {
    const minutes = Math.round(value * 24 * 60);
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  }
  const s = String(value ?? "").trim();
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm|AM|PM)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const suffix = m[3]?.toLowerCase();
  if (suffix === "pm" && h < 12) h += 12;
  if (suffix === "am" && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return `${pad(h)}:${pad(min)}`;
}

/**
 * Every row in the sheet that is not cancelled blocks its slot, so the owner
 * can block times by adding rows by hand.
 */
export async function readSheetSlots(): Promise<SheetSlot[] | null> {
  const c = config();
  if (!c) return null;

  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.rows;

  try {
    const url = `${GATEWAY}/spreadsheets/${c.spreadsheetId}/values/${READ_RANGE}?valueRenderOption=UNFORMATTED_VALUE`;
    const res = await fetch(url, { headers: headers(c) });
    if (!res.ok) {
      console.error(`Sheets read failed [${res.status}]: ${await res.text()}`);
      return null;
    }
    const body = (await res.json()) as { values?: unknown[][] };
    const rows: SheetSlot[] = [];
    for (const row of body.values ?? []) {
      const status = String(row[8] ?? "").toLowerCase();
      if (status.includes("cancel")) continue;
      const booking_date = normalizeDate(row[0]);
      const start_time = normalizeTime(row[1]);
      if (!booking_date || !start_time) continue;
      const duration = Number(row[3]);
      rows.push({
        booking_date,
        start_time,
        duration_min: Number.isFinite(duration) && duration > 0 ? duration : 30,
      });
    }
    cache = { at: Date.now(), rows };
    return rows;
  } catch (error) {
    console.error("Sheets read error", error);
    return null;
  }
}

export type BookingRow = {
  date: string;
  time: string;
  serviceName: string;
  durationMin: number;
  price: number;
  name: string;
  phone: string;
  email: string;
};

export async function appendBookingRow(row: BookingRow): Promise<boolean> {
  const c = config();
  if (!c) {
    console.error("Sheets append skipped: connector env vars missing");
    return false;
  }
  try {
    const url = `${GATEWAY}/spreadsheets/${c.spreadsheetId}/values/${SHEET_NAME}!A1:J1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
    const res = await fetch(url, {
      method: "POST",
      headers: headers(c),
      body: JSON.stringify({
        values: [
          [
            row.date,
            row.time,
            row.serviceName,
            row.durationMin,
            row.price,
            row.name,
            row.phone,
            row.email,
            "confirmed",
            new Date().toISOString(),
          ],
        ],
      }),
    });
    if (!res.ok) {
      console.error(`Sheets append failed [${res.status}]: ${await res.text()}`);
      return false;
    }
    cache = null; // the new booking must block its slot immediately
    return true;
  } catch (error) {
    console.error("Sheets append error", error);
    return false;
  }
}
