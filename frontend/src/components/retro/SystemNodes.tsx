// src/components/retro/SystemNodes.tsx
import React, { useEffect, useState } from "react";
import RetroModal from "../RetroModal";

export default function SystemNodes() {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [flashSpecialNode, setFlashSpecialNode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"decoder" | "node" | "emergency" | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomActiveNodes = Array.from({ length: 5 }, () => Math.floor(Math.random() * 15) + 1);
      setActiveNodes(randomActiveNodes);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const specialInterval = setInterval(() => {
      setFlashSpecialNode(true);
      setTimeout(() => setFlashSpecialNode(false), 200);
    }, 5000);

    return () => clearInterval(specialInterval);
  }, []);

  return (
    <div className="bg-[#111] border border-green-400 p-4 rounded shadow-md relative">
      <h2 className="text-lg font-bold mb-2 border-b border-green-400 pb-1">System Nodes</h2>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[...Array(15)].map((_, i) => {
          const nodeNumber = i + 1;
          const isFlashing = activeNodes.includes(nodeNumber);
          const isSpecialNode = nodeNumber === 7;

          return (
            <div
              key={i}
              className={`border py-3 px-2 text-xs transition cursor-pointer ${
                isSpecialNode
                  ? flashSpecialNode
                    ? "border-orange-400 bg-orange-300 animate-pulse-short"
                    : "border-green-600"
                  : isFlashing
                  ? "border-green-400 bg-green-500/40 animate-pulse-fast"
                  : "border-green-600"
              }`}
              onClick={() => {
                if (isSpecialNode) {
                  setActiveCode("C-71");
                  setActiveType("node");
                  setShowModal(true);
                }
              }}
            >
              Node #{nodeNumber}
            </div>
          );
        })}
      </div>

      {/* RetroModal */}
      {showModal && activeCode && activeType && (
        <RetroModal
          onClose={() => setShowModal(false)}
          source={activeType}
          code={activeCode}
          nodeNumber={7}
        />
      )}
    </div>
  );
}

