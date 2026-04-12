// src/config/api.ts
/// <reference types="vite/client" />

// If VITE_API_URL is not set (common in Netlify), default to same-origin.
// This enables using Netlify/Vite proxy rules for /api/* and /media/*.
const configured = (import.meta.env.VITE_API_URL || '').trim();
export const API_BASE_URL = configured;
