// File: src/components/HeroSection.tsx
// Type: NEW COMPONENT
// Purpose: Reusable hero section containing the welcome text and the carousel.

import React from "react";
import { Link } from "react-router-dom";
import Carousel from "./Carousel";

const HeroSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-10">
      {/* Text side */}
      <div className="max-w-xl text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          Welcome to <span className="text-brand-yellow">Sci-Fi Magazine</span>
        </h1>

        <p className="text-lg sm:text-xl text-earth-cream mb-6">
          Your portal to futuristic storytelling, AI-powered creativity, and
          classic sci-fi gems.
        </p>

        <Link
          to="/create"
          className="inline-block bg-brand-yellow text-brand-dark font-semibold px-6 py-3 rounded-md hover:bg-brand-orange transition-all"
        >
          Explore Creator Tools
        </Link>
      </div>

      {/* Carousel */}
      <div className="w-full md:w-1/3 mt-6 overflow-hidden rounded-lg shadow-lg relative h-80">
        <Carousel />
      </div>
    </div>
  );
};

export default HeroSection;
