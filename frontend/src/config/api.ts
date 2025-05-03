// src/config/api.ts
const isProduction = (import.meta as any).env.PROD;

export const API_BASE_URL = isProduction
  ? "https://scifi-magazine-vite.onrender.com"
  : "http://localhost:8000";
