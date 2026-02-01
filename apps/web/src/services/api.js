// src/services/api.js
import axios from "axios";
import { toast } from "../utils/toast";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Request Interceptor – Token automatically add karega har call mein
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 Response Interceptor – Errors ko toast mein dikhao + clean data return
api.interceptors.response.use(
  (response) => {
    // Agar backend success wrapper use kar raha hai (success: true, data: ...)
    if (response.data && response.data.success === true) {
      return response.data; // direct data return (controller mein res.data.data ya res.data milega)
    }
    return response;
  },
  (error) => {
    let message = "Something went wrong";

    if (error.response) {
      // Backend se message aaya
      message = error.response.data?.message || message;

      // 401 Unauthorized – token expired ya invalid
      if (error.response.status === 401) {
        message = "Session expired. Please login again.";
        // Auto logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      // 403 Forbidden
      if (error.response.status === 403) {
        message = "You don't have permission to perform this action";
      }
    } else if (error.request) {
      message = "Network error. Please check your connection.";
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;