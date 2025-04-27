// src/components/Pro/ProgressTracker.tsx
import React from "react";

interface ProgressTrackerProps {
  codes: { [key: string]: string | null };
}

export function ProgressTracker({ codes }: ProgressTrackerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-10">
      {Object.entries(codes).map(([part, value]) => (
        <div
          key={part}
          className="bg-earth-forest p-6 rounded-xl text-center shadow-md"
        >
          <p className="text-lg font-bold mb-2">{part}</p>
          {value ? (
            <p className="text-brand-yellow font-bold">{value}</p>
          ) : (
            <p className="text-earth-cream opacity-50">Missing</p>
          )}
        </div>
      ))}
    </div>
  );
}