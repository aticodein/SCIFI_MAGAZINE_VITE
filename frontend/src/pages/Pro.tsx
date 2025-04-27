// src/pages/Pro.tsx
import React, { useState, useEffect } from "react";
import { CodeCollector } from "../components/pro/CodeCollector";
import { ProgressTracker } from "../components/pro/ProgressTracker";

type CodesState = { [key: string]: string | null };

export default function ProPage() {
  const [codes, setCodes] = useState<{ [key: string]: string | null }>({
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("proCodes");
    if (saved) {
      setCodes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("proCodes", JSON.stringify(codes));
  }, [codes]);

  function handleFakeAdd(part: keyof typeof codes) {
    setCodes((prev: CodesState) => ({ ...prev, [part]: generateCodePiece(part) }));
  }

  function generateCodePiece(part: string) {
    return `${part}-${Math.floor(Math.random() * 90 + 10)}`;
  }

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Unlock Pro Access</h1>

        <ProgressTracker codes={codes} />

        <CodeCollector codes={codes} onFindCode={handleFakeAdd} />

        <div className="text-center">
          <button className="bg-brand-dark text-earth-cream px-6 py-3 rounded-full font-semibold hover:bg-brand-light transition">
            Submit Your Code
          </button>
        </div>
      </div>
    </div>
  );
}