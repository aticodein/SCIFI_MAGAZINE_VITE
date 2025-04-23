import React from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-earth-olive text-brand-light flex flex-col items-center justify-center px-4 py-20">
      <h1 className="text-4xl md:text-6xl font-bold text-earth-sand mb-6 text-center">
        Welcome to Sci-Fi Magazine
      </h1>
      <p className="text-lg md:text-xl text-white max-w-2xl text-center">
        Your modern portal to sci-fi stories, AI-powered tools, book and movie reviews,
        and a retro zone where nostalgia meets the future.
      </p>
      <Link to="/create">
        <button className="mt-10 px-6 py-3 rounded-md bg-brand-yellow text-brand-dark hover:bg-brand-orange transition-all duration-200">
          Explore Tools
        </button>
      </Link>
      
    </div>
  );
}
