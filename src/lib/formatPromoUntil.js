/** ISO sana: YYYY-MM-DD */
export function isIsoDate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

const MONTHS_UZ = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

/**
 * Aksiya badge matni — tilga mos
 * @param {string|null|undefined} iso — YYYY-MM-DD
 * @param {"ru"|"uz"} lang
 */
export function formatPromoUntil(iso, lang) {
  if (!iso || !isIsoDate(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return null;

  if (lang === "ru") {
    const part = date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
    return `до ${part}`;
  }
  return `${d} ${MONTHS_UZ[m - 1]}gacha`;
}

/** Supabase DATE / timestamp → YYYY-MM-DD */
export function normalizePromoIso(v) {
  if (v == null || v === "") return null;
  const s = String(v).slice(0, 10);
  return isIsoDate(s) ? s : null;
}

/** Mahsulot obyektidan badge matni (promo_until yoki eski promo_date ISO / matn) */
export function getPromoBadgeText(product, lang) {
  const iso = normalizePromoIso(product.promo_until) || normalizePromoIso(product.promo_date);
  if (iso) return formatPromoUntil(iso, lang);
  const legacy = product.promo_date;
  if (legacy && String(legacy).trim() && !normalizePromoIso(legacy)) return String(legacy).trim();
  return null;
}
