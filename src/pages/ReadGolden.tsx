import React from "react";
import { Link } from "react-router-dom";

export default function ReadGolden() {
  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 sm:mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Golden Age Sci-Fi Collection</h1>
          <Link
            to="/read"
            className="px-4 py-2 bg-earth-forest text-earth-cream rounded-md shadow hover:bg-earth-clay transition text-sm sm:text-base"
          >
            ← Back to Read
          </Link>
        </div>

        <p className="text-lg text-earth-cream mb-6">
          Explore a curated library of timeless public domain science fiction from the early 20th century. These stories paved the way for the genre as we know it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {/* Placeholder for cards - replace with real data rendering */}
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-earth-forest p-6 rounded-2xl text-earth-cream hover:scale-[1.03] transition-transform duration-300 text-center cursor-pointer shadow-lg"
            >
              <img
                src="https://placehold.co/300x400?text=Classic+Cover"
                alt="Placeholder"
                className="w-full h-64 object-cover object-top rounded-xl mb-4"
              />
              <h2 className="text-lg sm:text-xl font-bold mb-2">Golden Era Title {i + 1}</h2>
              <p className="text-sm sm:text-base opacity-80">
                A short description of this classic sci-fi work from the early days of the genre.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
