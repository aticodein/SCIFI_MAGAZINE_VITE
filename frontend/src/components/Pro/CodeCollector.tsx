// src/components/Pro/CodeCollector.tsx
import React from "react";

interface CodeCollectorProps {
  codes: { [key: string]: string | null };
  onFindCode: (part: string | number | symbol) => void;
}

export function CodeCollector({ codes, onFindCode }: CodeCollectorProps) {
  // Real codes from Retro Zone have specific patterns (A-94, B-64, etc.)
  const isRealCode = (code: string | null) => {
    if (!code) return false;
    const realCodes = ['A-94', 'B-64', 'C-71', 'D-82', 'E-17'];
    return realCodes.includes(code);
  };

  return (
    <div className="mb-10">
      <div className="text-center mb-6">
        <p className="text-earth-light text-sm">
          🎮 <strong>Find codes in the Retro Zone</strong> or use temporary codes below for testing
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.keys(codes).map((part) => {
          const code = codes[part];
          const hasRealCode = isRealCode(code);
          
          return (
            <button
              key={part}
              onClick={() => onFindCode(part)}
              disabled={hasRealCode}
              className={`
                font-bold px-4 py-2 rounded transition
                ${hasRealCode 
                  ? 'bg-green-600 text-white cursor-not-allowed' 
                  : 'bg-brand-yellow text-brand-dark hover:bg-brand-orange'
                }
              `}
              title={hasRealCode ? `Real code ${code} found in Retro Zone!` : `Generate temporary code for ${part}`}
            >
              {hasRealCode ? `✅ ${part} Found` : `Find ${part}`}
            </button>
          );
        })}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-earth-light">
          ✅ = Real codes from Retro Zone | 🎲 = Temporary test codes
        </p>
      </div>
    </div>
  );
}