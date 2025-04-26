// src/components/retro/LiveTerminal.tsx
import React, { useEffect, useState } from "react";
import RetroModal from "../RetroModal";

const bootLines = [
  "[INFO] Booting Retro Commander Interface...",
  "[OK] Subsystem A1 online",
  "[DATA] Loading memory banks...",
  "[LOG] Initializing neon HUD",
  "[FETCH] Signal locked | Source: Mars Relay 03",
  "[WARN] Anomaly detected in Sector 7G",
  "[GET] Auto-correcting...",
  "[PRINT] Uplink channel secured",
  "[TRACE] Initiating temporal node sync...",
  "[AUTH] Cryptographic handshake verified",
  "[FINAL] Retro memory banks primed",
  "[USER TYPING] Awaiting input..."
];

export default function LiveTerminal() {
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [glitchedLine, setGlitchedLine] = useState<string | null>(null);
  const [showCursor, setShowCursor] = useState(true);
  const [paused, setPaused] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"decoder" | "node" | "emergency" | null>(null);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (paused) return;

    if (currentIndex < bootLines.length) {
      const typingDelay = setTimeout(() => {
        const newLine = maybeGlitch(bootLines[currentIndex]);
        setGlitchedLine(newLine);

        setTimeout(() => {
          setCurrentLines((prev) => [...prev, bootLines[currentIndex]]);
          setCurrentIndex((prev) => prev + 1);
          setGlitchedLine(null);
        }, 400);
      }, 700);

      return () => clearTimeout(typingDelay);
    } else {
      const resetDelay = setTimeout(() => {
        setCurrentLines([]);
        setCurrentIndex(0);
      }, 6000);
      return () => clearTimeout(resetDelay);
    }
  }, [currentIndex, paused]);

  const maybeGlitch = (text: string) => {
    if (Math.random() < 0.3) {
      const glitchIndex = Math.floor(Math.random() * text.length);
      const glitchedChar = Math.random() > 0.5 ? "#" : "@";
      return text.slice(0, glitchIndex) + glitchedChar + text.slice(glitchIndex + 1);
    }
    return text;
  };

  const isSpecialOrangeLine = (line: string) => {
    return line.includes("[WARN] Anomaly detected in Sector 7G");
  };

  return (
    <div className="bg-[#111] border border-green-600 p-4 rounded shadow-md overflow-hidden relative">
      <h2 className="text-lg font-bold mb-2 border-b border-green-600 pb-1">Live Terminal</h2>

      {/* Pause/Resume Button */}
      <button
        onClick={() => setPaused((prev) => !prev)}
        className="absolute top-4 right-4 bg-green-700 text-white text-xs px-3 py-1 rounded hover:bg-green-500 transition"
      >
        {paused ? "Resume" : "Pause"}
      </button>

      <div className="text-sm leading-snug h-64 overflow-y-auto whitespace-pre-wrap font-mono animate-fade-in">
        {currentLines.map((line, index) => (
          <div
            key={index}
            className={`${isSpecialOrangeLine(line) ? "text-yellow-400 cursor-pointer animate-pulse" : "text-green-300"}`}
            onClick={() => {
              if (isSpecialOrangeLine(line)) {
                setActiveCode("A-94");
                setActiveType("decoder");
                setShowModal(true);
              }
            }}
          >
            {line}
          </div>
        ))}
        {glitchedLine && (
          <div
            className={`${isSpecialOrangeLine(glitchedLine) ? "text-yellow-400 cursor-pointer animate-pulse" : "text-green-300"}`}
            onClick={() => {
              if (isSpecialOrangeLine(glitchedLine)) {
                setActiveCode("A-94");
                setActiveType("decoder");
                setShowModal(true);
              }
            }}
          >
            {glitchedLine}
          </div>
        )}
        {currentIndex >= bootLines.length && (
          <div>
            _<span className={`${showCursor ? "opacity-100" : "opacity-0"}`}>█</span>
          </div>
        )}
      </div>

      {/* RetroModal */}
      {showModal && activeCode && activeType && (
        <RetroModal
          onClose={() => setShowModal(false)}
          type={activeType}
          code={activeCode}
        />
      )}
    </div>
  );
}
