// src/components/RetroModal.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Define props type separately
interface RetroModalProps {
  onClose: () => void;
  type: "node" | "decoder";
  nodeNumber?: number;
}

export default function RetroModal({ onClose, nodeNumber, type }: RetroModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-[#111] border border-green-500 p-6 rounded-lg shadow-lg text-green-300 max-w-sm w-full text-center">
        {type === "decoder" ? (
          <>
            <h2 className="text-xl font-bold mb-4">⚙️ Encrypted Sequence</h2>
            <p className="text-sm mb-6">
              You’ve just uncovered a signal artifact.
              Use code <span className="text-yellow-400 font-bold">D-74</span> to activate a hidden protocol.
            </p>
            <button
              className="bg-yellow-400 text-black font-bold px-4 py-2 rounded hover:bg-yellow-300 transition"
              onClick={() => {
                onClose();
                navigate("/pro");
              }}
            >
              Activate D-74
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">🧬 Node #{nodeNumber}</h2>
            {nodeNumber === 7 && (
              <button
                className="bg-yellow-400 text-black font-bold px-4 py-2 rounded hover:bg-yellow-300 transition mb-4"
                onClick={() => {
                  onClose();
                  navigate("/pro");
                }}
              >
                Activate C-56
              </button>
            )}
            <p className="text-sm mb-4">
              Node signal verified and linked to encrypted memory strand.
            </p>
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
