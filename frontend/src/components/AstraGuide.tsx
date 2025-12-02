// src/components/AstraGuide.tsx
import React, { useState } from "react";
import astraAvatar from "../assets/images/astra9.png";

type MessageId = "welcome" | "howItWorks" | "whatNext";

const MESSAGES: Record<MessageId, string> = {
  welcome:
    "Hey, I’m Astra-9, your guide in this sci-fi universe. I can walk you through how this site works and how to unlock your first AI tools.",
  howItWorks:
    "Short version: you create a username, collect 5 codes (A–E), go through a short decision path, verify your email, and then you unlock your first AI tool for 30 days.",
  whatNext:
    "First step I recommend: create your username and start collecting codes. Once you have A–E, I’ll guide you through choosing your first tool."
};

export const AstraGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState<MessageId>("welcome");

  const handleOpen = () => {
    setIsOpen(true);
    setActiveMessage("welcome");
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className="fixed top-[15vh] left-[10vw] z-40 rounded-full shadow-lg border border-cyan-400 bg-black/80 hover:bg-black/90 transition flex items-center justify-center w-14 h-14"
        aria-label="Open Astra-9 guide"
      >
        <img
          src={astraAvatar}
          alt="Astra-9 AI guide"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      {/* Guide panel */}
      {isOpen && (
        <div className="fixed top-[calc(10vh+7rem)] left-[6vw] z-40 w-80 max-w-[90vw] bg-slate-950/95 border border-cyan-500 rounded-xl shadow-2xl p-4 text-sm text-slate-100">

          <div className="flex items-center mb-3">
            <img
              src={astraAvatar}
              alt="Astra-9 avatar"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <div className="text-xs uppercase tracking-wide text-cyan-300">
                AI Guide
              </div>
              <div className="font-semibold">Astra-9</div>
            </div>
            <button
              onClick={handleClose}
              className="ml-auto text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <p className="mb-3 leading-relaxed">{MESSAGES[activeMessage]}</p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveMessage("howItWorks")}
              className="px-3 py-1 rounded-full bg-cyan-600/80 hover:bg-cyan-500 text-xs font-medium"
            >
              How does this site work?
            </button>
            <button
              onClick={() => setActiveMessage("whatNext")}
              className="px-3 py-1 rounded-full bg-purple-600/80 hover:bg-purple-500 text-xs font-medium"
            >
              What should I do first?
            </button>
          </div>

          <div className="mt-3 text-[10px] text-slate-400">
            (For now I’m scripted. Later I’ll be connected to real AI logic.)
          </div>
        </div>
      )}
    </>
  );
};
