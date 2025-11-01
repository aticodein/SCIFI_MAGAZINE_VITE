// src/pages/Retro.tsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import fluxImg from "../../assets/images/flux.png";
import RetroModal from "../RetroModal";
import Diagnostics from "./Diagnostics";
import LiveTerminal from "./LiveTerminal";
import SignalDecoder from "./SignalDecoder";
import SystemNodes from "./SystemNodes";
import VitalsFeed from "./VitalsFeed";
import { API_BASE_URL } from "../../config/api";
import { clearSessionStoragePreservingPrefs } from "../../utils/session";

export default function Retro() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);

  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [showDecoderModal, setShowDecoderModal] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);

  const decoderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkUsername() {
      console.log("🔵 Fetching username from backend...");
      try {
        const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        console.log("🟢 Server responded with:", data);
        if (data.username) {
          console.log("✅ Username found:", data.username);
          setHasUsername(true);
        } else {
          console.log("⛔ No username found in session.");
          setHasUsername(false);
        }
      } catch (error) {
        console.error("❌ Error fetching username:", error);
        setHasUsername(false);
      } finally {
        console.log("🟡 Finished checking. Updating state...");
        setChecking(false);
      }
    }

    checkUsername();
  }, []);

  useEffect(() => {
    console.log("⚡ Checking effect: checking =", checking, ", hasUsername =", hasUsername);
    if (!checking && !hasUsername) {
      console.log("🚪 No username - redirecting to /");
      navigate('/');
    }
  }, [checking, hasUsername, navigate]);

  if (checking) {
    console.log("🔄 Still checking - showing loading message.");
    return (
      <div className="text-center py-20 text-green-400">
        Checking your RetroZone access...
      </div>
    );
  }

  if (!hasUsername) {
    console.log("🚷 No username - not rendering dashboard (should be redirecting).");
    return null;
  }

  console.log("🛸 Username verified - rendering RetroZone dashboard!");

  async function handleLogout() {
    try {
      console.log("🔄 RetroZone: Starting logout process...");
      const res = await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });
      console.log("🌐 RetroZone: Logout API response status:", res.status);
      const data = await res.json();
      console.log("✅ RetroZone: Logout successful:", data);
      console.log("🧹 RetroZone: Clearing session storage...");
      clearSessionStoragePreservingPrefs();
      console.log("🔄 RetroZone: Reloading page...");
      window.location.reload();
    } catch (err) {
      console.error("❌ RetroZone: Logout failed:", err);
      alert("❌ Failed to logout.");
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* User Status Bar */}
      <div className="bg-green-800 text-green-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">COMMANDER:</span>
          <strong className="text-green-100">USER_LOGGED_IN</strong>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-orange-500 transition font-bold text-base"
        >
          ⏻ LOGOUT
        </button>
      </div>

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
