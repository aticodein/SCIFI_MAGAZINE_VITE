// src/components/retro/VitalsFeed.tsx
import React, { useState, useEffect } from "react";
import RetroModal from "../RetroModal";

interface Vital {
  name: string;
  value: number;
  direction: "up" | "down";
  speed: number;
}

export default function VitalsFeed() {
  const [vitals, setVitals] = useState<Vital[]>([
    { name: "Alfa Synus", value: Math.random() * 30, direction: Math.random() > 0.5 ? "up" : "down", speed: (Math.random() * 3) + 1 },
    { name: "Thermal Read", value: 30 + Math.random() * 40, direction: Math.random() > 0.5 ? "up" : "down", speed: (Math.random() * 4) + 1 },
    { name: "CPU Capacity", value: 60 + Math.random() * 30, direction: Math.random() > 0.5 ? "up" : "down", speed: (Math.random() * 5) + 2 },
    { name: "Decoder Status", value: Math.random() * 100, direction: Math.random() > 0.5 ? "up" : "down", speed: (Math.random() * 3) + 2 },
  ]);
  const [paused, setPaused] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"decoder" | "node" | "emergency" | null>(null);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setVitals((prevVitals) =>
        prevVitals.map((vital) => {
          const randomFactor = (Math.random() * 1) + 0.5;
          const change = vital.speed * randomFactor;
          let newValue = vital.direction === "up" ? vital.value + change : vital.value - change;

          if (newValue >= 99) {
            newValue = 99;
            return { ...vital, value: newValue, direction: "down" };
          } else if (newValue <= 0) {
            newValue = 0;
            return { ...vital, value: newValue, direction: "up" };
          }

          return { ...vital, value: newValue };
        })
      );
    }, 180);

    return () => clearInterval(interval);
  }, [paused]);

  const getBarColor = (vital: Vital) => {
    if (vital.name === "Decoder Status") {
      if (vital.value >= 55 && vital.value <= 85) return "bg-orange-400"; // Highlight Decoder Warning
    }
    if (vital.value < 30) return "bg-green-700";
    if (vital.value < 60) return "bg-green-500";
    if (vital.value < 90) return "bg-green-300";
    return "bg-red-500";
  };

  const isDecoderWarning = (vital: Vital) => {
    return vital.name === "Decoder Status" && vital.value >= 55 && vital.value <= 85;
  };

  return (
    <div className="bg-[#111] border border-blue-500 p-4 rounded shadow-md flex flex-col justify-center relative">
      <button
        onClick={() => setPaused((prev) => !prev)}
        className="absolute top-4 right-4 bg-green-700 text-white text-xs px-3 py-1 rounded hover:bg-green-500 transition"
      >
        {paused ? "Resume" : "Pause"}
      </button>

      <h2 className="text-lg font-bold mb-2 border-b border-blue-500 pb-1 text-center">Vitals Feed</h2>

      <div className="flex flex-col gap-4 justify-center items-center h-full">
        {vitals.map((vital, index) => (
          <div
            key={index}
            className="w-full flex flex-col items-center gap-1"
            onClick={() => {
              if (isDecoderWarning(vital)) {
                setActiveCode("B-64");
                setActiveType("decoder");
                setShowModal(true);
              }
            }}
            style={{ cursor: isDecoderWarning(vital) ? "pointer" : "default" }}
          >
            <span className="text-xs text-white">{vital.name}</span>
            <div className="relative w-full h-6 bg-black/40 rounded overflow-hidden">
              <div
                className={`h-full ${getBarColor(vital)} transition-all duration-300 ease-in-out`}
                style={{ width: `${vital.value}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {Math.round(vital.value)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* RetroModal */}
      {showModal && activeCode && activeType && (
        <RetroModal
          onClose={() => setShowModal(false)}
          source={activeType}
          code={activeCode}
        />
      )}
    </div>
  );
}
