// src/components/LoadingCard.tsx
import React from "react";
import "../styles/scanline.css";// This imports your optional retro scanline

export default function LoadingCard() {
  return (
     <div className="animate-pulse bg-earth-sand rounded-2xl p-6 shadow-lg text-center">
     <div className="w-full h-64 bg-earth-clay rounded-xl mb-4" />
     <div className="h-6 bg-earth-clay rounded mb-2 w-3/4 mx-auto" />
     <div className="h-4 bg-earth-clay rounded w-full mx-auto" />
      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <p className="text-earth-cream text-sm sm:text-base font-semibold animate-pulse">
          Loading Books<span className="animate-ping ml-1">…</span>
        </p>
      </div>

      {/* Optional scanline flicker */}
     <div className="scanline-overlay"></div>
     </div>

  );
}
