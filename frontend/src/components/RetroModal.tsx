// src/components/RetroModal.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface RetroModalProps {
  onClose: () => void;
  type: "decoder" | "node" | "emergency";
  code: string;
  nodeNumber?: number;
}

export default function RetroModal({ onClose, type, code, nodeNumber }: RetroModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-[#111] border border-green-500 p-6 rounded-lg shadow-lg text-green-300 max-w-sm w-full text-center">
        {type === "decoder" ? (
          <>
            <h2 className="text-xl font-bold mb-4">⚙️ Encrypted Sequence</h2>
            <p className="text-sm mb-6">
              You’ve just uncovered a signal artifact.  
              Use code <span className="text-yellow-400 font-bold">{code}</span> to activate a hidden protocol.
            </p>
            <button
              className="bg-yellow-400 text-black font-bold px-4 py-2 rounded hover:bg-yellow-300 transition"
              onClick={() => {
                onClose();
                navigate("/pro");
              }}
            >
              Activate {code}
            </button>
          </>
        ) : type === "emergency" ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-orange-400">🚨 Critical Systems Warning</h2>
            <p className="text-sm mb-6">
              Oxygen anomaly detected. Immediate action required.  
              Confirm code <span className="text-orange-400 font-bold">{code}</span> to stabilize life support.
            </p>
            <button
              className="bg-orange-400 text-black font-bold px-4 py-2 rounded hover:bg-orange-300 transition"
              onClick={() => {
                onClose();
                navigate("/pro");
              }}
            >
              Confirm {code}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">🧬 Node #{nodeNumber}</h2>
            <p className="text-sm mb-6">
              Node signal verified and linked to encrypted memory strand.  
              Code: <span className="text-yellow-400 font-bold">{code}</span>
            </p>
            <button
              className="bg-yellow-400 text-black font-bold px-4 py-2 rounded hover:bg-yellow-300 transition"
              onClick={() => {
                onClose();
                navigate("/pro");
              }}
            >
              Link {code}
            </button>
          </>
        )}

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
