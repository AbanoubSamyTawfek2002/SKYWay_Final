// src/utils/api.js
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://skyway-api.onrender.com";

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return response;
};
