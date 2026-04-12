// src/config/api.ts
/// <reference types="vite/client" />

// We prefer same-origin API calls in production to avoid third-party cookie/session issues.
// Netlify handles proxying `/api/*` and `/media/*` to Railway via `public/_redirects`.
const configured = (import.meta.env.VITE_API_URL || '').trim();

function getApiBaseUrl(): string {
  // Default: same-origin
  if (!configured) return '';

  // In production builds, ignore cross-origin API_BASE_URL so sessions work reliably.
  // This also protects against a misconfigured Netlify env var.
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    try {
      const configuredOrigin = new URL(configured).origin;
      if (configuredOrigin !== window.location.origin) return '';
    } catch {
      // If it's not a valid URL, fall back to same-origin.
      return '';
    }
  }

  return configured;
}

export const API_BASE_URL = getApiBaseUrl();
