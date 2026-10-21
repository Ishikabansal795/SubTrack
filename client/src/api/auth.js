import api from "./axios.js";

// Change these two paths if Ishika mounts the routes under /api/auth etc.
const REGISTER_URL = "/api/register";
const LOGIN_URL = "/api/login";

export const registerUser = (data) => api.post(REGISTER_URL, data);
export const loginUser = (data) => api.post(LOGIN_URL, data);

// Turns any axios error into a plain-language message: cause + what to do (NFR-U4).
export function readableError(err, fallback) {
  if (!err.response) {
    return "Cannot reach the server. Check your internet connection and try again in a moment.";
  }
  const serverMsg = err.response.data?.message || err.response.data?.error;
  return serverMsg || fallback;
}
