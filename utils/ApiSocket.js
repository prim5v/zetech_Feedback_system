import axios from "axios";
import jwtDecode from "jwt-decode";

const BASE_URL = "https://feedback4293.pythonanywhere.com";

// ✅ Generate or retrieve a unique device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = 'DEV-' + Math.random().toString(36).substr(2, 16).toUpperCase();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      console.warn("⚠️ Token expired — clearing but NOT redirecting yet...");
      localStorage.removeItem("token");
      return null;
    }
  } catch (err) {
    console.error("❌ Invalid token format:", err);
    localStorage.removeItem("token");
    return null;
  }

  return token;
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    const deviceId = getDeviceId(); // ✅ attach device ID

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Attached Bearer token to request");
    }

    config.headers["X-Device-ID"] = deviceId; // ✅ required for backend device binding
    return config;
  },
  (error) => {
    console.error("ApiSocket → Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 440) {
        console.warn("⚠️ Token expired (440) — redirecting to Unauthorized page");
        localStorage.removeItem("token");
        window.location.href = "/access-denied";
      } else if (status === 401) {
        console.warn("🚫 Unauthorized (401) — redirecting to Unauthorized page");
        window.location.href = "/access-denied";
      } else {
        console.error("ApiSocket → Response error:", error.response.data);
      }
    } else {
      console.error("ApiSocket → Unknown error:", error);
    }

    return Promise.reject(error);
  }
);

export default api;
