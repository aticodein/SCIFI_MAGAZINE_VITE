// src/components/RetroModal.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

interface RetroModalProps {
  onClose: () => void;
  source: "vitals" | "terminal" | "decoder" | "node" | "diagnostics";
  code: string;
}

export default function RetroModal({ onClose, source, code }: RetroModalProps) {
  const navigate = useNavigate();

  console.log("RetroModal source:", source); // 💬 This is your debug print Captain!

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-[#111] border border-green-500 p-6 rounded-lg shadow-lg text-green-300 max-w-sm w-full text-center">
      
        {/* === Display Different Text Based on Source === */}

        {source === "vitals" && (
          <>
            <h2 className="text-xl font-bold mb-4">Vital Signal Anomaly Found</h2>
            <p className="text-sm mb-6">
              Critical fluctuations detected.  
              Use code <span className="text-yellow-400 font-bold">{code}</span> to analyze in Pro Lab.
            </p>
          </>
        )}

        {source === "terminal" && (
          <>
            <h2 className="text-xl font-bold mb-4">Terminal Anomaly Intercepted</h2>
            <p className="text-sm mb-6">
              Unauthorized signal detected.  
              Use code <span className="text-yellow-400 font-bold">{code}</span> to continue investigation.
            </p>
          </>
        )}

        {source === "decoder" && (
          <>
            <h2 className="text-xl font-bold mb-4">Decoder Artifact Retrieved</h2>
            <p className="text-sm mb-6">
              Decrypted memory fragment secured.  
              Use code <span className="text-yellow-400 font-bold">{code}</span> for protocol activation.
            </p>
          </>
        )}

        {source === "node" && (
          <>
            <h2 className="text-xl font-bold mb-4">System Node Linked</h2>
            <p className="text-sm mb-6">
              Node verified and paired.  
              Code: <span className="text-yellow-400 font-bold">{code}</span>
            </p>
          </>
        )}

        {source === "diagnostics" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-orange-400">🚨 Emergency Diagnostics Alert</h2>
            <p className="text-sm mb-6">
              Critical system instability detected.  
              Confirm code <span className="text-orange-400 font-bold">{code}</span> to stabilize.
            </p>
          </>
        )}

        {/* === Buttons === */}
        <button
          className="bg-yellow-400 text-black font-bold px-4 py-2 rounded hover:bg-yellow-300 transition w-full mt-4"
          onClick={() => {
            onClose();
            navigate("/pro");
          }}
        >
          Activate {code}
        </button>

        <button
          className="block mt-4 text-xs text-green-400 hover:underline"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
}
