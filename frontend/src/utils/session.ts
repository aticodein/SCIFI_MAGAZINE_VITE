// src/utils/session.ts

export const SESSION_CHANGED_EVENT = 'scifi:session-changed';

export function notifySessionChanged() {
  // Fire-and-forget event that any component can listen to.
  // Used to re-check session-backed username without a full page refresh.
  window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

export function clearSessionStoragePreservingPrefs() {
  const preservedKeys = ['cookieConsent', 'createDarkMode', 'footerDarkMode'];
  const preserved: Record<string, string | null> = {};

  preservedKeys.forEach((key) => {
    preserved[key] = localStorage.getItem(key);
  });

  localStorage.clear();

  preservedKeys.forEach((key) => {
    if (preserved[key] !== null) {
      localStorage.setItem(key, preserved[key]!);
    }
  });
}
