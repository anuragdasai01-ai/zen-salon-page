export const SALON = {
  name: "Enrich Salon",
  tagline: "Unisex Salon · Tandon Mall, Andheri East",
  phone: "87980 41014",
  phoneHref: "tel:+918798041014",
  whatsapp: "918798041014",
  ownerEmail: "anuragdas.ai.01@gmail.com",
  hours: "10:00 AM – 10:00 PM, every day",
  address:
    "Shop No. 2, Tandon Mall, 127, Andheri – Kurla Road, near Carnival Cinemas, Andheri East, Mumbai, Maharashtra 400093",
  mapEmbed:
    "https://maps.google.com/maps?q=Enrich%20Salon%20Tandon%20Mall%20Andheri%20Kurla%20Road%20Andheri%20East%20Mumbai&z=16&output=embed",
  mapLink: "https://maps.app.goo.gl/7GZ6eVsgDgaKqNMy5",
  openHour: 10,
  closeHour: 22,
} as const;

export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
};

export const SERVICE_CATEGORIES = [
  "Hair",
  "Skin & Beauty",
  "Nails",
  "Threading & Waxing",
] as const;

export const SERVICES: Service[] = [
  { id: "haircut-women", name: "Haircut & Style (Women)", price: 850, duration: 45, category: "Hair" },
  { id: "haircut-men", name: "Haircut & Style (Men)", price: 500, duration: 30, category: "Hair" },
  { id: "haircut-kids", name: "Kids Haircut (below 10 yrs)", price: 400, duration: 30, category: "Hair" },
  { id: "blow-dry", name: "Shampoo & Blow Dry", price: 700, duration: 40, category: "Hair" },
  { id: "beard-trim", name: "Beard Trim & Shape", price: 300, duration: 20, category: "Hair" },
  { id: "hair-colour-root", name: "Root Touch-Up (Global Colour)", price: 1500, duration: 60, category: "Hair" },
  { id: "hair-colour-global", name: "Global Hair Colour", price: 2800, duration: 90, category: "Hair" },
  { id: "highlights", name: "Highlights (per streak set)", price: 3500, duration: 120, category: "Hair" },
  { id: "smoothening", name: "Hair Smoothening", price: 5500, duration: 180, category: "Hair" },
  { id: "keratin", name: "Keratin Treatment", price: 6500, duration: 180, category: "Hair" },
  { id: "hair-spa", name: "Hair Spa & Deep Conditioning", price: 1400, duration: 60, category: "Hair" },
  { id: "head-massage", name: "Relaxing Head Massage", price: 600, duration: 30, category: "Hair" },

  { id: "cleanup", name: "Express Clean-Up", price: 900, duration: 40, category: "Skin & Beauty" },
  { id: "facial-fruit", name: "Fruit Facial", price: 1300, duration: 60, category: "Skin & Beauty" },
  { id: "facial-glow", name: "Brightening Glow Facial", price: 2200, duration: 75, category: "Skin & Beauty" },
  { id: "dtan", name: "D-Tan Face & Neck", price: 800, duration: 30, category: "Skin & Beauty" },
  { id: "makeup-party", name: "Party Make-Up", price: 3500, duration: 90, category: "Skin & Beauty" },
  { id: "makeup-bridal", name: "Bridal Make-Up", price: 12000, duration: 180, category: "Skin & Beauty" },

  { id: "manicure", name: "Classic Manicure", price: 700, duration: 45, category: "Nails" },
  { id: "pedicure", name: "Classic Pedicure", price: 900, duration: 50, category: "Nails" },
  { id: "pedicure-spa", name: "Spa Pedicure", price: 1400, duration: 60, category: "Nails" },
  { id: "nail-polish", name: "Nail Filing & Polish", price: 400, duration: 30, category: "Nails" },

  { id: "eyebrows", name: "Eyebrows Threading", price: 100, duration: 10, category: "Threading & Waxing" },
  { id: "upper-lip", name: "Upper Lip Threading", price: 70, duration: 10, category: "Threading & Waxing" },
  { id: "face-threading", name: "Full Face Threading", price: 450, duration: 30, category: "Threading & Waxing" },
  { id: "wax-arms", name: "Full Arms Waxing", price: 600, duration: 30, category: "Threading & Waxing" },
  { id: "wax-legs", name: "Full Legs Waxing", price: 900, duration: 40, category: "Threading & Waxing" },
  { id: "wax-full-body", name: "Full Body Waxing", price: 3200, duration: 90, category: "Threading & Waxing" },
];

export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);

export const BENEFITS = [
  {
    title: "15+ years of experience",
    body: "A trusted unisex salon team that has styled Mumbai regulars for over a decade and a half.",
  },
  {
    title: "No more waiting around",
    body: "Reserve a slot in 30 seconds and walk in at your time instead of queueing for half an hour.",
  },
  {
    title: "Trained expert stylists",
    body: "Cut, colour and treatment specialists trained on current techniques for every hair type.",
  },
  {
    title: "Hygiene you can see",
    body: "Tools sanitised after every guest, fresh towels and single-use disposables as standard.",
  },
  {
    title: "Professional products",
    body: "Salon-grade L'Oréal Professionnel care used for colour, smoothening and spa services.",
  },
  {
    title: "One salon for everyone",
    body: "Men, women and kids — hair, skin, nails and grooming all under one roof.",
  },
];

export const REVIEWS = [
  {
    name: "Priya M.",
    rating: 5,
    text: "Booked a slot on my way from work and walked straight in. Haircut was exactly what I asked for.",
  },
  {
    name: "Rohit S.",
    rating: 5,
    text: "Clean place, polite staff and a proper beard shape-up. Easily the best salon on Andheri Kurla Road.",
  },
  {
    name: "Sneha K.",
    rating: 4,
    text: "Got hair smoothening done here. Hair still feels soft weeks later and the pricing was clear upfront.",
  },
  {
    name: "Aakash T.",
    rating: 5,
    text: "Been coming for two years. They remember how I like my cut, and the head massage is worth it alone.",
  },
];

export const CERTIFICATIONS = [
  "L'Oréal Professionnel trained colourists",
  "Certified keratin & smoothening technicians",
  "Sanitised tools, single-use disposables",
  "Rated 4.3★ on Google by local guests",
];
