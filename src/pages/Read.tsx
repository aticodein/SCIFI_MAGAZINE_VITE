import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Books",
    description: "Reviews and features of classic and new sci-fi books across the galaxy.",
    bg: "bg-earth-cream",
    text: "text-earth-forest",
  },
  {
    title: "Novels",
    description: "In-depth stories that shaped the genre. Dune, Foundation, and beyond.",
    bg: "bg-brand-light",
    text: "text-brand-dark",
  },
  {
    title: "Comics",
    description: "Explore graphic novels, vintage panels, and the best illustrated sci-fi.",
    bg: "bg-earth-sand",
    text: "text-earth-forest",
  },
];

export default function Read() {
  return (
    <div className="min-h-screen bg-earth-olive px-4 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-earth-cream mb-8 sm:mb-10 text-center">
          Explore Sci-Fi Reads
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 px-2">
          {categories.map((cat, i) => {
            const link =
              cat.title === "Books"
                ? "/read/books"
                : cat.title === "Novels"
                ? "/read/novels"
                : cat.title === "Comics"
                ? "/read/comics"
                : null;

            const card = (
              <div
                className={`${cat.bg} ${cat.text} aspect-[4/3] min-h-[240px] rounded-2xl shadow-xl p-6 sm:p-8 transform hover:scale-[1.03] transition duration-300 flex flex-col justify-center items-center text-center`}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{cat.title}</h2>
                <p className="text-sm sm:text-base opacity-80 max-w-md">{cat.description}</p>
              </div>
            );

            return link ? (
              <Link to={link} key={i} className="block">
                {card}
              </Link>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
