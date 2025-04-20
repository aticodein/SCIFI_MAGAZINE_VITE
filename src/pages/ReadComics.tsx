import React, { useState } from "react";
import { Link } from "react-router-dom";

const categories = ["DC", "Marvel", "Others"];

const categoryStyles: Record<string, string> = {
  DC: "bg-brand-dark text-brand-yellow",
  Marvel: "bg-brand-light text-brand-dark",
  Others: "bg-earth-clay text-white",
};

const generateComics = (category: string) =>
  Array.from({ length: 9 }, (_, i) => ({
    id: `${category}-${i}`,
    title: `${category} Comic ${i + 1}`,
    description: `Explore the universe of ${category}. Issue ${i + 1}`,
  }));

export default function ReadComics() {
  const [activeCategory, setActiveCategory] = useState("DC");
  const comics = generateComics(activeCategory);

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
            Advised Comics by Sci-Fi Magazine
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105 ${
                activeCategory === cat
                  ? "bg-white text-earth-forest border-2 border-earth-clay"
                  : "bg-earth-forest text-earth-cream"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {comics.map((comic) => (
            <div
              key={comic.id}
              className={`rounded-xl shadow-lg p-6 hover:scale-[1.03] transition-transform duration-300 text-center ${
                categoryStyles[activeCategory] || "bg-white text-black"
              }`}
            >
              <h2 className="text-2xl font-bold mb-2">{comic.title}</h2>
              <p className="text-sm opacity-80">{comic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
