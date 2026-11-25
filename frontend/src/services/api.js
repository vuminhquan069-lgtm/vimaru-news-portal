const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:5000/api";

async function request(baseUrl, path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Đã xảy ra lỗi khi gọi API");
  }
  return data;
}

export const api = {
  getPages: () => request(API_BASE_URL, "/pages"),

  getNews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(API_BASE_URL, `/news${query ? `?${query}` : ""}`);
  },
  getNewsById: (id) => request(API_BASE_URL, `/news/${id}`),
  createNews: (payload, token) =>
    request(API_BASE_URL, "/news", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  updateNews: (id, payload, token) =>
    request(API_BASE_URL, `/news/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  deleteNews: (id, token) =>
    request(API_BASE_URL, `/news/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Auth service (microservice riêng, cấp JWT cho các thao tác quản trị ở trên)
  adminLogin: (password) =>
    request(AUTH_BASE_URL, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
};
