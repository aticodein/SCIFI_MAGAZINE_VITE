// src/components/User/CookieConsent.tsx

import React, { useState, useEffect } from "react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-earth-cream text-earth-forest text-sm p-4 flex flex-col sm:flex-row justify-center items-center gap-4 shadow-lg z-50">
      <p>
        We use cookies to improve your experience. By using our site, you agree to our cookie policy.
      </p>
      <button
        onClick={handleAccept}
        className="bg-brand-yellow text-brand-dark px-4 py-2 rounded-md font-semibold hover:bg-brand-orange transition"
      >
        Accept
      </button>
    </div>
  );
}
