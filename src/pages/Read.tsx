import React from "react";
import { Link } from "react-router-dom";

// Import your background images
import warImg from "../assets/images/war.png";
import movie2Img from "../assets/images/movie2.jpg";
import hero2Img from "../assets/images/hero2.png";

const categories = [
  {
    title: "Books",
    description: "Reviews and features of classic and new sci-fi books across the galaxy.",
    image: warImg,
    bgTint: "bg-earth-cream bg-opacity-20",
    text: "text-white",
    path: "/read/books",
  },
  {
    title: "Novels",
    description: "In-depth stories that shaped the genre. Dune, Foundation, and beyond.",
    image: movie2Img,
    bgTint: "bg-brand-light bg-opacity-20",
    text: "text-white",
    path: "/read/novels",
  },
  {
    title: "Comics",
    description: "Explore graphic novels, vintage panels, and the best illustrated sci-fi.",
    image: hero2Img,
    bgTint: "bg-earth-sand bg-opacity-20",
    text: "text-white",
    path: "/read/comics",
  },
];

export default function Read() {
  return (
    <div className="min-h-screen bg-earth-olive px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-earth-cream mb-10 text-center">Explore Sci-Fi Reads</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat, i) => (
            <Link to={cat.path} key={i} className="block">
            <div
              className={`relative aspect-[4/3] rounded-2xl p-[3px] bg-earth-cream transform transition-transform duration-300 hover:scale-[1.06] overflow-hidden shadow-xl`}
            >
              <div className="relative w-full h-full rounded-[1rem] overflow-hidden">
                {/* Background image */}
                <img
                  src={cat.image}
                  alt={`${cat.title} image`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
          
                {/* Optional dark overlay for contrast */}
                <div className="absolute inset-0 bg-black bg-opacity-30 z-0" />
          
                {/* Centered text */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
                  <h2 className="text-3xl font-bold text-white drop-shadow-md mb-3">{cat.title}</h2>
                  <p className="text-base text-white opacity-90 drop-shadow">{cat.description}</p>
                </div>
              </div>
            </div>
          </Link>
          
          
          
          ))}
        </div>
      </div>
    </div>
  );
}
