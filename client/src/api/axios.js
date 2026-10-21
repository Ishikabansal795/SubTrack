import axios from "axios";

export const TOKEN_KEY = "subtrack_token";
export const USER_KEY = "subtrack_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 15000,
});

// Attach JWT to every request (protected routes need it).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired / invalid token -> clear session and send user to login (FR-9.1).
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const hadToken = !!localStorage.getItem(TOKEN_KEY);
    if (err.response?.status === 401 && hadToken) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.assign("/login?expired=1");
    }
    return Promise.reject(err);
  }
);

export default api;
