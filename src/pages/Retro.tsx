// src/pages/Retro.tsx
import React, { useEffect, useRef, useState } from "react";
import RetroModal from "../components/RetroModal";
import fluxImg from "../assets/images/flux.png";

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

export default function Retro() {
  const [lines, setLines] = useState<string[]>(["/decoding/signal--trace--192.168.xx.xxx", "", "-- fragment --", "01100011 01101111 01101110 01110100 01110010 01101111 01101100", "/command/reroute initialized..."]);
  const [paused, setPaused] = useState(false);
  const decoderRef = useRef<HTMLDivElement>(null);
  const [showDecoderModal, setShowDecoderModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);


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
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header Banner */}
      <div className="w-full bg-green-900 text-center py-10 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-200 mb-4">Retro Commander Interface</h1>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-40 max-w-8xl mx-auto">
          <div className="animate-spin-reverse" >
          <img
           src={fluxImg} // or use /assets/flux.png if placed in public folder
           alt="Retro Dashboard"
           className="w-36 max-w-xs rounded-full shadow-xl animate-spin-slow-reverse"
          />
          </div>
          <p className="text-green-100 max-w-xl text-sm md:text-base text-left">
          Welcome to the Retro Commander Interface — your gateway to a lost era of deep space ops.
Monitor vitals, intercept binary transmissions, and scan live system logs from across the galaxy.

But this isn’t just a dashboard… it’s a <b>challenge.</b> <br />
Hidden within this interface are 5 secret elements.
Find them all to unlock your Entry Code — granting you 1 Month of Pro Access to Sci-Fi Magazine’s AI core. Look for Anomalies!

Decode. Discover. Dominate.
          </p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Code Streaming Panel */}
        <div className="bg-[#111] border border-green-600 p-4 rounded shadow-md  overflow-hidden">
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
          <span className="text-xs mt-2 text-white">[Alfa Synus] [Thermal Read] [CPU Cpacity] [Decoder Status]</span>
          <div className="flex justify-center h-40 mt-20">
            <div className="flex flex-col justify-end items-left h-full animate-pulse">
              <div
                className="w-1 rounded-t shadow-lg"
                style={{ height: "90%", backgroundColor: "#34D399", animationDuration: "2.5s" }}
              />
              
            </div>
            
          </div>
        </div>

        {/* System Nodes Display */}
        <div className="bg-[#111] border border-green-400 p-4 rounded shadow-md">
          <h2 className="text-lg font-bold mb-2 border-b border-green-400 pb-1">System Nodes</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="border border-green-600 py-3 px-2 text-xs hover:bg-green-700/30 transition cursor-pointer"
              onClick={() => setSelectedNode(i + 1)}
            >
              Node #{i + 1}
            </div>
          ))}


          </div>
        </div>

        {/* Signal Decoder Panel */}
        <div className="bg-[#111] border border-green-400 p-4 rounded shadow-md col-span-1 md:col-span-2 relative">
          <h2 className="text-lg font-bold mb-2 border-b border-green-400 pb-1 ">Signal Decoder</h2>
          {/* Signal Decoder Panel */}
          <div
             ref={decoderRef}
            className="text-sm text-green-300 h-64 overflow-y-auto whitespace-pre-wrap"
    >

            {lines.map((line, index) => (
             <div
               key={index}
               className={`animate-glitch ${
                 line.includes("[LOG2]") ? "font-bold text-yellow-400 cursor-pointer" : "text-green-300"
              }`}
                onClick={() => line.includes("[LOG2]") && setShowDecoderModal(true)}
              >
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
      {showDecoderModal && (
          <RetroModal
            onClose={() => setShowDecoderModal(false)}
             type="decoder"
           />
         )}

        {selectedNode && (
          <RetroModal
             onClose={() => setSelectedNode(null)}
              type="node"
             nodeNumber={selectedNode}
             />
        )}


    </div>
  );
}
