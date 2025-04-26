// Final refactored Retro.tsx using the separated components
import React, { useState, useRef } from "react";
import LiveTerminal from "../components/retro/LiveTerminal";
import VitalsFeed from "../components/retro/VitalsFeed";
import SystemNodes from "../components/retro/SystemNodes";
import SignalDecoder from "../components/retro/SignalDecoder";
import Diagnostics from "../components/retro/Diagnostics";
import RetroModal from "../components/RetroModal";
import fluxImg from "../assets/images/flux.png";

export default function Retro() {
  const [showDecoderModal, setShowDecoderModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header Banner */}
      <div className="w-full bg-green-900 text-center py-10 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-200 mb-4">Retro Commander Interface</h1>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-40 max-w-8xl mx-auto">
          <div className="animate-spin-reverse">
            <img
              src={fluxImg}
              alt="Retro Dashboard"
              className="w-36 max-w-xs rounded-full shadow-xl animate-spin-slow-reverse"
            />
          </div>
          <p className="text-green-100 max-w-xl text-sm md:text-base text-left">
            Welcome to the Retro Commander Interface — your gateway to a lost era of deep space ops.
            Monitor vitals, intercept binary transmissions, and scan live system logs from across the galaxy.
            But this isn’t just a dashboard… it’s a <b>challenge. </b>
            Hidden within this interface you need to find 5 secret elements.
            Find them all to unlock your Entry Code — Unlock 1 Month of Pro Access to Sci-Fi Magazine’s exclusive AI creative tools, resources, and features. Look for Anomalies!
            Decode. Discover. Dominate.
          </p>
        </div>
      </div>

      {/* Components Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LiveTerminal />
        <VitalsFeed />
        <SystemNodes />
        <SignalDecoder />
        <Diagnostics />
      </div>

      {/* Modals */}
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
