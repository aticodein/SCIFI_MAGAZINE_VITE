import React, { useState } from "react";
import { Link } from "react-router-dom";

const genres = [
  "Hard Sci-Fi",
  "Romantic Sci-Fi",
  "Adventure",
  "Post-Apocalyptic",
  "Time Travel",
];

const genreStyles: Record<string, string> = {
  "Hard Sci-Fi": "bg-earth-cream text-earth-forest",
  "Romantic Sci-Fi": "bg-brand-light text-brand-dark",
  Adventure: "bg-earth-sand text-earth-forest",
  "Post-Apocalyptic": "bg-earth-clay text-white",
  "Time Travel": "bg-brand-yellow text-brand-dark",
};

const generateNovels = (genre: string) =>
  Array.from({ length: 9 }, (_, i) => ({
    id: `${genre}-${i}`,
    title: `${genre} Novel ${i + 1}`,
    description: `An epic story from the ${genre} category. Volume ${i + 1}`,
  }));

export default function ReadNovels() {
  const [activeGenre, setActiveGenre] = useState("Hard Sci-Fi");
  const novels = generateNovels(activeGenre);

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
            Advised Novels by Sci-Fi Magazine
          </h1>

          <Link
            to="/read"
            className="px-5 py-2 bg-earth-forest text-earth-cream rounded-md shadow hover:bg-earth-clay transition"
          >
            ← Back to Read
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-4 mb-10">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105 ${
                activeGenre === genre
                  ? "bg-white text-earth-forest border-2 border-earth-clay"
                  : "bg-earth-forest text-earth-cream"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {novels.map((novel) => (
            <div
              key={novel.id}
              className={`rounded-xl shadow-lg p-6 hover:scale-[1.03] transition-transform duration-300 text-center ${
                genreStyles[activeGenre] || "bg-white text-black"
              }`}
            >
              <h2 className="text-2xl font-bold mb-2">{novel.title}</h2>
              <p className="text-sm opacity-80">{novel.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
