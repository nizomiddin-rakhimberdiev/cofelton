export function phoneToTelHref(phone) {
  const num = String(phone || "").replace(/\D/g, "");
  if (!num) return "tel:";
  const normalized = num.startsWith("8") ? "7" + num.slice(1) : num;
  return "tel:+" + normalized;
}
