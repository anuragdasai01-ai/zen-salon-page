import { SALON } from "./salon";
import { sendEmail } from "./mail.server";

type Details = {
  serviceName: string;
  durationMin: number;
  price: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
};

function prettyDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function prettyTime(time: string) {
  const [h = 0, m = 0] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function shell(title: string, bodyRows: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#faf6f2;font-family:Helvetica,Arial,sans-serif;color:#2b2226">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <h1 style="font-size:20px;color:#5b1f3a;margin:0 0 16px">${title}</h1>
    <table cellpadding="8" cellspacing="0" style="width:100%;background:#ffffff;border:1px solid #ece2e6;border-radius:12px;font-size:14px">
      ${bodyRows}
    </table>
    <p style="font-size:13px;color:#6b5b62;line-height:1.6;margin-top:20px">${footer}</p>
  </div></body></html>`;
}

const row = (label: string, value: string) =>
  `<tr><td style="color:#6b5b62;width:40%">${label}</td><td style="font-weight:600">${value}</td></tr>`;

export async function sendBookingEmails(d: Details) {
  const when = `${prettyDate(d.date)} at ${prettyTime(d.time)}`;
  const price = `₹${d.price.toLocaleString("en-IN")}`;

  const customerHtml = shell(
    `Your slot at ${SALON.name} is confirmed`,
    row("Service", d.serviceName) +
      row("When", when) +
      row("Duration", `${d.durationMin} min`) +
      row("Indicative price", price) +
      row("Name", d.name),
    `Please arrive 5 minutes early.<br><br><strong>${SALON.name}</strong><br>${SALON.address}<br>Phone: ${SALON.phone}<br>Open ${SALON.hours}<br><br>Need to change or cancel? Just reply to this email or call us.`,
  );

  const ownerHtml = shell(
    "New booking received",
    row("Service", d.serviceName) +
      row("When", when) +
      row("Duration", `${d.durationMin} min`) +
      row("Price", price) +
      row("Customer", d.name) +
      row("Phone", `<a href="https://wa.me/91${d.phone.replace(/^\+?91/, "")}">${d.phone} (WhatsApp)</a>`) +
      row("Email", `<a href="mailto:${d.email}">${d.email}</a>`),
    "This booking has also been added to your Enrich Salon Bookings sheet.",
  );

  const results = await Promise.allSettled([
    sendEmail(d.email, `Booking confirmed — ${d.serviceName} on ${prettyDate(d.date)}`, customerHtml),
    sendEmail(SALON.ownerEmail, `New booking: ${d.serviceName} — ${when}`, ownerHtml),
  ]);

  results.forEach((r) => {
    if (r.status === "rejected") console.error("Booking email failed", r.reason);
  });
}
