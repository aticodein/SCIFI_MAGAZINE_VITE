import CardGrid from "../components/CardGrid";
import React from "react";

const sampleTools = [
  {
    title: "AI Comic Script Generator",
    description: "Generate comic panel ideas and dialogue using your prompt.",
  },
  {
    title: "Cyberpunk Tone Adjuster",
    description: "Transform basic text into gritty neon-drenched sci-fi.",
  },
  {
    title: "Character Name Forge",
    description: "Create original sci-fi hero, villain, or alien names.",
  }, {
    title: "Character Style Forge",
    description: "Create original sci-fi hero, villain, or alien syle.",
  },
];

export default function Create() {
  return (
    <div className="min-h-screen bg-earth-olive px-4 py-12">
      <div className="bg-earth-cream text-gray-800 max-w-8xl mx-auto px-12 py-36 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-indigo-600 bg-white px-6 py-2 rounded-xl border-2 border-earth-olive shadow inline-block mb-6">
          DASHBOARD
        </h1>

        <h2 className="text-3xl font-bold text-brand-dark mb-4">AI Tools for Creators</h2>
        <p className="text-gray-700 max-w-xl mb-10 mx-auto underline">
          Explore our AI-powered tools to help you create stunning sci-fi content.
          More features coming soon.
        </p>

        <div className="bg-brand-dark px-6 py-10 rounded-lg shadow-lg">
          <CardGrid items={sampleTools} />
        </div>
      </div>
    </div>
  );
}
