// src/pages/ReadBooks.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const genres = [
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Cyberpunk",
  "Dystopia",
];

const genreStyles: Record<string, string> = {
  "Sci-Fi": "bg-earth-cream text-earth-forest",
  Fantasy: "bg-brand-light text-brand-dark",
  Horror: "bg-earth-clay text-white",
  Cyberpunk: "bg-brand-yellow text-brand-dark",
  Dystopia: "bg-earth-sand text-earth-forest",
};

const generateBooks = (genre: string) =>
  Array.from({ length: 9 }, (_, i) => ({
    id: `${genre}-${i}`,
    title: `${genre} Book ${i + 1}`,
    description: `A must-read from the ${genre} shelf. Book ${i + 1}`,
  }));

export default function ReadBooks() {
  const [activeGenre, setActiveGenre] = useState("Sci-Fi");
  const books = generateBooks(activeGenre);

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream px-4 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 gap-4 px-2">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
            Advised Books by Sci-Fi Magazine
          </h1>

          <Link
            to="/read"
            className="px-4 py-2 bg-earth-forest text-earth-cream rounded-md shadow hover:bg-earth-clay transition text-sm sm:text-base"
          >
            ← Back to Read
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-3 mb-8 sm:mb-10 px-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200 text-sm sm:text-base hover:scale-105 ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {books.map((book) => (
            <div
              key={book.id}
              className={`rounded-2xl shadow-lg p-6 hover:scale-[1.03] transition-transform duration-300 text-center ${
                genreStyles[activeGenre] || "bg-white text-black"
              }`}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-2">{book.title}</h2>
              <p className="text-sm sm:text-base opacity-80">{book.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
