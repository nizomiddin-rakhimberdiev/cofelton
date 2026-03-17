const KEY_PRODUCTS = "cofe_products";
const KEY_REVIEWS = "cofe_reviews";

export function getLocalProducts() {
  try {
    const raw = localStorage.getItem(KEY_PRODUCTS);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export function setLocalProducts(products) {
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));
}

export function getLocalReviews() {
  try {
    const raw = localStorage.getItem(KEY_REVIEWS);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export function setLocalReviews(reviews) {
  localStorage.setItem(KEY_REVIEWS, JSON.stringify(reviews));
}
