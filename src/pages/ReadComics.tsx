// src/pages/ReadComics.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const categories = ["DC", "Marvel", "Others"];

const categoryStyles: Record<string, string> = {
  DC: "bg-brand-dark text-brand-yellow",
  Marvel: "bg-brand-light text-brand-dark",
  Others: "bg-earth-clay text-white",
};

const BASE_URL = "/.netlify/functions/comicvine"; // your Netlify Function

const fetchComics = async (category: string) => {
  try {
    // Mock fallback for Others
    if (category === "Others") {
      return Array.from({ length: 9 }, (_, i) => ({
        id: `others-${i}`,
        title: `Cyberpunk Saga ${i + 1}`,
        description: `An underground manga epic set in Neo-Tokyo. Volume ${i + 1}`,
        image: `https://placehold.co/300x400?text=Cyberpunk+${i + 1}`,
      }));
    }

    // ComicVine API for DC or Marvel
    const response = await axios.get(
      `/.netlify/functions/comicvine?category=${category.toLowerCase()}`
    );

    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;

    return [];
  } catch (error) {
    console.error("Error fetching comics:", error);
    return [];
  }
};



export default function ReadComics() {
  const [activeCategory, setActiveCategory] = useState("DC");
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      console.log("Fetching category:", activeCategory);
      const data = await fetchComics(activeCategory);
      console.log("Fetched comics titles:", data.map((c) => c.title));
      setComics(data);
    };
    load();
  }, [activeCategory]);
  
  

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream px-4 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 gap-4 px-2">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
            Advised Comics by Sci-Fi Magazine
          </h1>
          <Link
            to="/read"
            className="px-4 py-2 bg-earth-forest text-earth-cream rounded-md shadow hover:bg-earth-clay transition text-sm sm:text-base"
          >
            ← Back to Read
          </Link>
        </div>

        {/* Category buttons */}
        <div className="flex justify-center flex-wrap gap-3 mb-8 sm:mb-10 px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200 text-sm sm:text-base hover:scale-105 ${
                activeCategory === cat
                  ? "bg-white text-earth-forest border-2 border-earth-clay"
                  : "bg-earth-forest text-earth-cream"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Comic grid */}
        <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {comics.map((comic) => (
            <div
              key={comic.id}
              className={`rounded-2xl shadow-lg p-6 hover:scale-[1.03] transition-transform duration-300 text-center ${
                categoryStyles[activeCategory] || "bg-white text-black"
              }`}
            >
              {comic.image && (
                <img
                  src={comic.image}
                  alt={comic.title}
                  className="w-full h-64 object-cover object-top rounded-xl mb-4"
                />
              )}
              <h2 className="text-lg sm:text-xl font-bold mb-2">{comic.title}</h2>
              <p className="text-sm sm:text-base opacity-80">
                {comic.description.replace(/<[^>]*>?/gm, "").slice(0, 160)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
