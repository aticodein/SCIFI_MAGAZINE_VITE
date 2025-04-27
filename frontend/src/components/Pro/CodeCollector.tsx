// src/components/Pro/CodeCollector.tsx
import React from "react";

interface CodeCollectorProps {
  codes: { [key: string]: string | null };
  onFindCode: (part: keyof typeof codes) => void;
}

export function CodeCollector({ codes, onFindCode }: CodeCollectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10">
      {Object.keys(codes).map((part) => (
        <button
          key={part}
          onClick={() => onFindCode(part as keyof typeof codes)}
          className="bg-brand-yellow text-brand-dark font-bold px-4 py-2 rounded hover:bg-brand-orange transition"
        >
          Find {part}
        </button>
      ))}
    </div>
  );
}