// src/pages/Retro.tsx
import React, { useEffect, useRef, useState } from "react";

const randomTextLines = [
  "[INFO] Data initialization started",
  "[LOG] Margin codes detected",
  "[ERROR] Packet fragment dropped",
  "[TRACE] Stream realigned with /core/synapse",
  "[AUTH] Login attempt received from 172.16.254.1",
  "[ALERT] Memory surge at Sector 12B",
  "[COMMAND] Reroute signal through relay delta",
  "[LOG] Quantum flux recalibrated",
  "[INFO] Uplink channel secured",
  "[SYSTEM] Checkpoint 42 achieved"
];

export default function Retro() {
  const [lines, setLines] = useState<string[]>(["/decoding/signal--trace--192.168.xx.xxx", "", "-- fragment --", "01100011 01101111 01101110 01110100 01110010 01101111 01101100", "/command/reroute initialized..."]);
  const [paused, setPaused] = useState(false);
  const decoderRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Code Streaming Panel */}
      <div className="bg-[#111] border border-green-600 p-4 rounded shadow-md animate-pulse overflow-hidden">
        <h2 className="text-lg font-bold mb-2 border-b border-green-600 pb-1">Live Terminal</h2>
        <div className="text-sm leading-snug h-64 overflow-y-auto whitespace-pre-wrap animate-fade-in">
          <pre>
            {"[INFO] Booting Retro Commander Interface...\n[OK] Subsystem A1 online\n[OK] Loading memory banks...\n[LOG] Initializing neon HUD\n[DATA] Signal locked | Source: Mars Relay 03\n[WARN] Anomaly detected in Sector 7G\n[LOG] Auto-correcting...\n[OK] Stream stabilized\n[INFO] Awaiting input...\n_"}
          </pre>
        </div>
      </div>

      {/* Vitals Feed – Static Single Bar aligned at the bottom */}
      <div className="bg-[#111] border border-blue-500 p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2 border-b border-blue-500 pb-1">Vitals Feed</h2>
        <div className="flex justify-center h-40 mt-20">
          <div className="flex flex-col justify-end items-center h-full">
            <div
              className="w-6 rounded-t shadow-lg"
              style={{ height: "70%", backgroundColor: "#34D399" }}
            />
            <span className="text-xs mt-2 text-white">Alfa Synus</span>
          </div>
        </div>
      </div>

      {/* System Nodes Display */}
      <div className="bg-[#111] border border-green-400 p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2 border-b border-green-400 pb-1">System Nodes</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-green-600 py-3 px-2 text-xs hover:bg-green-700/30 transition"
            >
              Node #{i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Signal Decoder Panel */}
      <div className="bg-[#111] border border-green-400 p-4 rounded shadow-md col-span-1 md:col-span-2 relative">
        <h2 className="text-lg font-bold mb-2 border-b border-green-400 pb-1">Signal Decoder</h2>
        <div ref={decoderRef} className="text-sm text-green-300 h-64 overflow-y-auto whitespace-pre-wrap">
          {lines.map((line, index) => (
            <div key={index} className="animate-glitch text-green-300">
              {line}
            </div>
          ))}
        </div>
        <button
          onClick={() => setPaused(!paused)}
          className="absolute top-4 right-4 bg-green-700 text-white text-xs px-3 py-1 rounded hover:bg-green-500"
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      {/* Diagnostics Panel */}
      <div className="bg-[#111] border border-yellow-300 p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2 border-b border-yellow-300 pb-1">Diagnostics</h2>
        <ul className="text-sm space-y-1">
          <li>⚙️ Drive Spin Rate: <span className="text-yellow-200">5420 RPM</span></li>
          <li>🔋 Power Cell: <span className="text-yellow-200">87%</span></li>
          <li>📡 Uplink Status: <span className="text-yellow-200">Stable</span></li>
          <li>💾 Memory Usage: <span className="text-yellow-200">68%</span></li>
        </ul>
      </div>
    </div>
  );
}
