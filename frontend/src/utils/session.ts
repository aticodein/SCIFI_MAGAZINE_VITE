// src/utils/session.ts

export function clearSessionStoragePreservingPrefs() {
    const preservedKeys = ["cookieConsent", "createDarkMode", "footerDarkMode"];
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
  