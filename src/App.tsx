// src/App.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg1 from "./assets/images/green.jpg";
import heroImg2 from "./assets/images/hero2.png";
import heroImg3 from "./assets/images/movie1.jpg";
import heroImg4 from "./assets/images/movie2.jpg";
import heroImg5 from "./assets/images/wonderwoman.jpg";
import heroImg6 from "./assets/images/war.png";
import heroImg7 from "./assets/images/golden-age2.png";
import heroImg8 from "./assets/images/movie3.png";
import "./index.css";

const images = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6, heroImg7, heroImg8];

export default function App() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-10">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Welcome to <span className="text-brand-yellow">Sci-Fi Magazine</span>
          </h1>
          <p className="text-lg sm:text-xl text-earth-cream mb-6">
            Your portal to futuristic storytelling, AI-powered creativity, and classic sci-fi gems.
          </p>
          <Link
            to="/create"
            className="inline-block bg-brand-yellow text-brand-dark font-semibold px-6 py-3 rounded-md hover:bg-brand-orange transition-all"
          >
            Explore Creator Tools
          </Link>
        </div>

        <div className="w-full md:w-1/3 mt-6 overflow-hidden rounded-lg shadow-lg relative h-80">
          {images.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out rounded-lg ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <img
                src={img}
                alt="Sci-Fi"
                className="w-full h-full object-cover rounded-lg"
              />
              {/* fading dark overlay */}
              <div
                className="absolute inset-0 bg-black transition-opacity duration-[3000ms] delay-[1000ms] rounded-lg"
                style={{ opacity: i === index ? 0.7 : 0 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-earth-forest py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-earth-cream">Discover More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/read" className="bg-white text-earth-forest p-6 rounded-lg shadow hover:scale-105 transition">
              <h3 className="font-bold text-lg mb-2">Read</h3>
              <p className="text-sm">Books, novels, comics — explore curated and AI-enhanced content.</p>
            </Link>
            <Link to="/create" className="bg-white text-earth-forest p-6 rounded-lg shadow hover:scale-105 transition">
              <h3 className="font-bold text-lg mb-2">Create</h3>
              <p className="text-sm">Use GPT-powered tools to invent characters, scripts, and plots.</p>
            </Link>
            <Link to="/watch" className="bg-white text-earth-forest p-6 rounded-lg shadow hover:scale-105 transition">
              <h3 className="font-bold text-lg mb-2">Watch</h3>
              <p className="text-sm">Check out upcoming sci-fi movies and AI predictions.</p>
            </Link>
            <Link to="/retro" className="bg-white text-earth-forest p-6 rounded-lg shadow hover:scale-105 transition">
              <h3 className="font-bold text-lg mb-2">Retro</h3>
              <p className="text-sm">Explore vintage media from the golden age of science fiction.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-brand-dark py-12 text-center text-earth-cream">
        <h3 className="text-2xl font-bold mb-3">Join the Crew</h3>
        <p className="text-sm mb-4">Subscribe for early access to AI tools, story drops, and more.</p>
        <Link
          to="/pro"
          className="inline-block bg-brand-yellow text-brand-dark px-5 py-2 rounded font-semibold hover:bg-brand-orange transition"
        >
          Become a Pro Member
        </Link>
      </div>
    </div>
  );
}
