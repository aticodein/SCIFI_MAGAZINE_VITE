// src/components/FeaturesSection.tsx

import React from "react";
import { Link } from "react-router-dom";

const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-earth-forest py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-earth-cream">
          Discover More
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/read"
            className="bg-white text-earth-forest p-6 rounded-lg shadow hover:scale-105 transition"
          >
            <h3 className="font-bold text-lg mb-2">Read</h3>
            <p className="text-sm">
              Books, novels, comics — explore curated and AI-enhanced content.
            </p>
          </Link>

          <Link
            to="/create"
            className="bg-white text-earth-forest p-6 rounded-lg shadow hover:scale-105 transition"
          >
            <h3 className="font-bold text-lg mb-2">Create</h3>
            <p className="text-sm">
              Use AI-powered tools to invent characters, scripts, and plots.
            </p>
          </Link>

          <Link
            to="/watch"
            className="bg-white text-earth-forest p-6 rounded-lg shadow hover:scale-105 transition"
          >
            <h3 className="font-bold text-lg mb-2">Watch</h3>
            <p className="text-sm">
              Check out upcoming sci-fi movies and AI predictions.
            </p>
          </Link>

          <Link
            to="/retro"
            className="bg-white text-earth-forest p-6 rounded-lg shadow hover:scale-105 transition"
          >
            <h3 className="font-bold text-lg mb-2">Retro Zone</h3>
            <p className="text-sm">
              Explore vintage media from the golden age of science fiction.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
