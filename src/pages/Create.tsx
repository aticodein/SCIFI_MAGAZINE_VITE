// src/pages/Create.tsx
import CardGrid from "../components/CardGrid";
import React, { useState, useEffect } from "react";
import { Sparkles, FolderKanban, Settings2, Wand2, Sun, Moon } from "lucide-react";

const sampleTools = [
  {
    title: "AI Comic Script Generator",
    description: "Generate comic panel ideas and dialogue using your prompt.",
    icon: Wand2,
    badge: "NEW",
  },
  {
    title: "Cyberpunk Tone Adjuster",
    description: "Transform basic text into gritty neon-drenched sci-fi.",
    icon: Sparkles,
  },
  {
    title: "Character Name Forge",
    description: "Create original sci-fi hero, villain, or alien names.",
    icon: Settings2,
  },
  {
    title: "Character Style Forge",
    description: "Create original sci-fi hero, villain, or alien style.",
    icon: FolderKanban,
  },
];


export default function Create() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-earth-olive dark:bg-gray-900 px-4 py-12 transition-colors">
      <div className="bg-earth-cream dark:bg-gray-800 text-gray-800 dark:text-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24 rounded-xl shadow-lg text-center">
        {/* Top Info Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
          <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow">
            <strong>Tools Available</strong>
            <p>4 AI tools, more coming soon.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow">
            <strong>Pro-Status</strong>
            <p>Basic User – Upgrade for early access.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow">
            <strong>News</strong>
            <p>Retro Style Generator launching next week.</p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 bg-brand-yellow text-brand-dark px-4 py-2 rounded-xl shadow hover:bg-brand-orange transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-semibold">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        {/* Dashboard Header */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark dark:text-earth-clay bg-brand-light dark:bg-gray-700 px-6 py-2 rounded-md border border-earth-sand dark:border-brand-yellow shadow-md inline-block mb-4">
          DASHBOARD
        </h1>

        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-brand-dark dark:text-earth-clay mb-6">
          AI Tools for Creators
        </h2>

        <p className="text-earth-olive-700 dark:text-gray-300 max-w-2xl mx-auto underline text-sm sm:text-base mb-10">
          Explore our AI-powered tools to help you create stunning sci-fi content.
          More features coming soon.
        </p>

        {/* Tools Grid */}
        <div className="bg-brand-dark dark:bg-gray-700 px-4 sm:px-6 py-8 sm:py-10 rounded-md shadow-xl">
          <CardGrid
            items={sampleTools.map((tool) => ({
              ...tool,
              icon: tool.icon ? <tool.icon size={18} className="text-brand-dark dark:text-brand-dark mb-2" /> : null,
              titleClass: "text-brand-dark dark:text-brand-dark font-bold text-lg",
            }))}
          />
        </div>

        {/* Coming Soon Footer */}
        <p className="mt-6 text-xs text-earth-olive dark:text-gray-400 uppercase tracking-widest">
          COMING SOON
        </p>
      </div>
    </div>
  );
}
