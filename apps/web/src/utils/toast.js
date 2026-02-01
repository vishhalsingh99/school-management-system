// src/utils/toast.js
export const toast = {
  success: (message) => {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 px-6 py-4 bg-green-600 text-white rounded-lg shadow-lg z-50 animate-fade-in";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },
  error: (message) => {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 px-6 py-4 bg-red-600 text-white rounded-lg shadow-lg z-50 animate-fade-in";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },
};