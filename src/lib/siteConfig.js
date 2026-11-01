// Central configuration for JT’s Ghana storefront.
export const REGIONS = [
  { name: "Greater Accra", city: "Accra", delivery: "1–2 days", fee: 20 },
  { name: "Ashanti", city: "Kumasi", delivery: "2–3 days", fee: 30 },
  { name: "Central", city: "Cape Coast", delivery: "2–3 days", fee: 30 },
  { name: "Eastern", city: "Koforidua", delivery: "2–3 days", fee: 30 },
  { name: "Western", city: "Takoradi", delivery: "3–4 days", fee: 35 },
  { name: "Western North", city: "Sefwi Wiawso", delivery: "3–4 days", fee: 40 },
  { name: "Volta", city: "Ho", delivery: "3–4 days", fee: 40 },
  { name: "Oti", city: "Dambai", delivery: "3–4 days", fee: 40 },
  { name: "Bono", city: "Sunyani", delivery: "3–5 days", fee: 45 },
  { name: "Bono East", city: "Techiman", delivery: "3–5 days", fee: 45 },
  { name: "Ahafo", city: "Goaso", delivery: "3–5 days", fee: 45 },
  { name: "Northern", city: "Tamale", delivery: "4–6 days", fee: 60 },
  { name: "Upper East", city: "Bolgatanga", delivery: "5–7 days", fee: 70 },
  { name: "Upper West", city: "Wa", delivery: "5–7 days", fee: 70 },
  { name: "Savannah", city: "Damongo", delivery: "5–7 days", fee: 70 },
  { name: "North East", city: "Nalerigu", delivery: "5–7 days", fee: 70 },
];

export const ghanaRegions = REGIONS.map((region) => region.name);

// Accra is the initial dispatch hub; the owner can set the actual hub in Admin → Settings.
export const ACCRA_HUB = [5.603717, -0.186964];

export function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function deliveryFeeFromDistance(km) {
  return Math.max(10, Math.ceil(km / 7) * 10);
}

export const SITE_CONFIG = {
  brandName: "JT",
  tagline: "Tech for the life you’re building.",
  signature: "JTPO_S",
  domain: "",
  whatsappNumber: "",
  whatsappDisplay: "",
  email: "",
  phone: "",
  snapchat: "",
  social: [],
  ghanaRegions,
};

export const CATEGORIES = [
  { name: "Phones & Tablets", slug: "Phones & Tablets", icon: "Smartphone" },
  { name: "Audio", slug: "Audio", icon: "Headphones" },
  { name: "Smartwatches", slug: "Smartwatches", icon: "Watch" },
  { name: "Gaming", slug: "Gaming", icon: "Gamepad2" },
  { name: "Accessories", slug: "Accessories", icon: "Cable" },
  { name: "Computing", slug: "Computing", icon: "Laptop" },
  { name: "Smart Home", slug: "Smart Home", icon: "House" },
  { name: "JT Exclusives", slug: "JT Exclusives", icon: "Sparkles" },
];

export const PRODUCT_COLLECTIONS = [
  { value: "jt_original", label: "JT Originals" },
  { value: "curated", label: "Curated Tech" },
];

export function getDeliveryFee(region) {
  return REGIONS.find((item) => item.name === region)?.fee ?? 60;
}
