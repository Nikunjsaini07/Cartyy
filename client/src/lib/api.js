const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    const message =
      response.status === 404
        ? "We couldn't find that product."
        : "The catalogue is temporarily unavailable.";
    throw new Error(message);
  }
  const payload = await response.json();
  return payload.data;
}

export const api = {
  getProducts: () => request("/products"),
  getProduct: (slug) => request(`/products/${encodeURIComponent(slug)}`),
};
