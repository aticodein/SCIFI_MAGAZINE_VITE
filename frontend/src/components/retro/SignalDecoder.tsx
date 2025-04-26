// src/components/retro/SignalDecoder.tsx
import React, { useEffect, useState, useRef } from "react";
import RetroModal from "../RetroModal";

const randomTextLines = [
  "[INFO] Data initialization started",
  "[LOG] Margin codes detected",
  "[ERROR] Packet fragment dropped",
  "[TRACE] Stream realigned with /core/synapse",
  "[AUTH] Login attempt received from 172.16.254.1",
  "[ALERT] Memory surge at Sector 12B",
  "[COMMAND] Reroute signal through relay delta",
  "[LOG2] Quantum flux recalibrated",
  "[INFO] Uplink channel secured",
  "[SYSTEM] Checkpoint 42 achieved"
];

export default function SignalDecoder() {
  const [lines, setLines] = useState<string[]>([]);
  const [paused, setPaused] = useState(false);
  const decoderRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"decoder" | "node" | "emergency" | null>(null);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      const isText = Math.random() < 0.3;
      const line = isText
        ? randomTextLines[Math.floor(Math.random() * randomTextLines.length)]
        : Array.from({ length: Math.floor(Math.random() * 30 + 30) }, () => (Math.random() > 0.5 ? "0" : "1")).join("");

      setLines((prev) => [...prev.slice(-100), line]);

      if (decoderRef.current) {
        decoderRef.current.scrollTop = decoderRef.current.scrollHeight;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="bg-[#111] border border-green-400 p-4 rounded shadow-md col-span-1 md:col-span-2 relative">
      <h2 className="text-lg font-bold mb-2 border-b border-green-400 pb-1">Signal Decoder</h2>

      <div
        ref={decoderRef}
        className="text-sm text-green-300 h-64 overflow-y-auto whitespace-pre-wrap"
      >
        {lines.map((line, index) => (
          <div
            key={index}
            className={`${
              line.includes("[LOG2]")
                ? "text-yellow-400 font-bold cursor-pointer animate-pulse"
                : "text-green-300"
            }`}
            onClick={() => {
              if (line.includes("[LOG2]")) {
                setActiveCode("D-82");
                setActiveType("decoder");
                setShowModal(true);
              }
            }}
          >
            {line}
          </div>
        ))}
      </div>

      <button
        onClick={() => setPaused((prev) => !prev)}
        className="absolute top-4 right-4 bg-green-700 text-white text-xs px-3 py-1 rounded hover:bg-green-500 transition"
      >
        {paused ? "Resume" : "Pause"}
      </button>

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
