// src/pages/Retro.tsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fluxImg from "../assets/images/flux.png";
import { Username } from "../components/User/Username";

import LiveTerminal from "../components/Retro/LiveTerminal";
import VitalsFeed from "../components/Retro/VitalsFeed";
import SystemNodes from "../components/Retro/SystemNodes";
import SignalDecoder from "../components/Retro/SignalDecoder";
import Diagnostics from "../components/Retro/Diagnostics";
import RetroModal from "../components/RetroModal";

export default function Retro() {
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [showDecoderModal, setShowDecoderModal] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);

  const [username, setUsername] = useState<string | null>(null);

  const decoderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  if (!username) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex flex-col justify-center items-center p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the RetroZone</h1>
        <Username mode="retro" />
        <p className="text-md mb-6 text-center max-w-md">
          Please create a username to access mining and decoding.
          Your personal adventure starts with your unique identity.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header Banner */}
      <div className="w-full bg-green-900 text-center py-10 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-200 mb-4">
          Retro Commander Interface
        </h1>
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
            <br /><br />
            Find 5 secret elements hidden across this system to unlock Pro Access!
          </p>
        </div>
      </div>

      {/* Components Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LiveTerminal setShowTerminalModal={setShowTerminalModal} decoderRef={decoderRef} />
        <VitalsFeed setShowVitalsModal={setShowVitalsModal} />
        <SystemNodes setShowNodeModal={setShowNodeModal} />
        <SignalDecoder setShowDecoderModal={setShowDecoderModal} decoderRef={decoderRef} />
        <Diagnostics setShowDiagnosticsModal={setShowDiagnosticsModal} />
      </div>

      {/* Modals */}
      {showVitalsModal && (
        <RetroModal
          onClose={() => setShowVitalsModal(false)}
          source="vitals"
          code="B-64"
        />
      )}
      {showTerminalModal && (
        <RetroModal
          onClose={() => setShowTerminalModal(false)}
          source="terminal"
          code="A-94"
        />
      )}
      {showDecoderModal && (
        <RetroModal
          onClose={() => setShowDecoderModal(false)}
          source="decoder"
          code="D-82"
        />
      )}
      {showNodeModal && (
        <RetroModal
          onClose={() => setShowNodeModal(false)}
          source="node"
          code="C-71"
        />
      )}
      {showDiagnosticsModal && (
        <RetroModal
          onClose={() => setShowDiagnosticsModal(false)}
          source="diagnostics"
          code="E-17"
        />
      )}
    </div>
  );
}
