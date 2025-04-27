// src/pages/Pro.tsx

import React, { useState, useEffect } from "react";
import { CodeCollector } from "../components/Pro/CodeCollector";
import { ProgressTracker } from "../components/Pro/ProgressTracker";

type CodesState = Record<"A" | "B" | "C" | "D" | "E", string | null>;

export default function ProPage() {
  const [codes, setCodes] = useState<CodesState>({
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
  });

  useEffect(() => {
    const savedCodes = localStorage.getItem("proCodes");
    const activated = localStorage.getItem("activatedCode");

    let initialCodes: CodesState = {
      A: null,
      B: null,
      C: null,
      D: null,
      E: null,
    };

    if (savedCodes) {
      initialCodes = JSON.parse(savedCodes);
    }

    if (activated) {
      const part = activated[0] as keyof CodesState;
      console.log("ProPage caught Activated Code:", activated, " for part:", part);
      initialCodes[part] = activated;
      localStorage.removeItem("activatedCode"); // Clean up
    }

    setCodes(initialCodes);
  }, []);

  useEffect(() => {
    localStorage.setItem("proCodes", JSON.stringify(codes));
  }, [codes]);

  function handleFakeAdd(part: keyof CodesState) {
    setCodes((prev) => ({ ...prev, [part]: generateCodePiece(part) }));
  }

  function generateCodePiece(part: keyof CodesState) {
    return `${part}-${Math.floor(Math.random() * 90 + 10)}`;
  }

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Unlock Pro Access</h1>

        {/* Code progress tracker */}
        <ProgressTracker codes={codes} />

        {/* Code collection simulator */}
        <CodeCollector codes={codes} onFindCode={handleFakeAdd} />

        {/* Submission button */}
        <div className="text-center mt-6">
          <button className="bg-brand-dark text-earth-cream px-6 py-3 rounded-full font-semibold hover:bg-brand-light transition">
            Submit Your Full Code
          </button>
        </div>
      </div>
    </div>
  );
}
