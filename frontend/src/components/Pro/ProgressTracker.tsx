// src/components/Pro/ProgressTracker.tsx
import React from "react";

interface ProgressTrackerProps {
  codes: { [key: string]: string | null };
}

export function ProgressTracker({ codes }: ProgressTrackerProps) {
  // Real codes from Retro Zone have specific patterns
  const isRealCode = (code: string | null) => {
    if (!code) return false;
    const realCodes = ['A-94', 'B-64', 'C-71', 'D-82', 'E-17'];
    return realCodes.includes(code);
  };

  console.log("🎯 ProgressTracker rendering with codes:", codes);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-center mb-6">Code Collection Progress</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        {Object.entries(codes).map(([part, value]) => {
          const hasRealCode = isRealCode(value);
          const hasAnyCode = Boolean(value);
          
          return (
            <div
              key={part}
              className={`
                p-6 rounded-xl text-center shadow-md border-2 transition-all duration-300
                ${hasRealCode 
                  ? 'bg-green-900 border-green-400 shadow-green-400/20' 
                  : hasAnyCode 
                    ? 'bg-yellow-900 border-yellow-400 shadow-yellow-400/20'
                    : 'bg-earth-forest border-earth-light'
                }
              `}
            >
              <p className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                {part}
                {hasRealCode && <span className="text-green-400">✅</span>}
                {hasAnyCode && !hasRealCode && <span className="text-yellow-400">🎲</span>}
              </p>
              
              {value ? (
                <div>
                  <p className={`font-bold text-sm ${hasRealCode ? 'text-green-300' : 'text-yellow-300'}`}>
                    {value}
                  </p>
                  <p className={`text-xs mt-1 ${hasRealCode ? 'text-green-400' : 'text-yellow-400'}`}>
                    {hasRealCode ? 'Retro Zone' : 'Test Code'}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-earth-cream opacity-50 text-sm">Missing</p>
                  <p className="text-xs text-earth-light mt-1">Find in Retro Zone</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-sm text-earth-light">
        <p>✅ Real codes from Retro Zone | 🎲 Temporary test codes | Missing codes need discovery</p>
      </div>
    </div>
  );
}