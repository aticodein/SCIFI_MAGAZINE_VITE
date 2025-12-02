// src/components/Carousel.tsx
import React, { useEffect, useState } from "react";

// ✅ Import your actual image files:
import slide1 from "../assets/carousel/slide1.jpg";
import slide2 from "../assets/carousel/slide2.jpg";
import slide3 from "../assets/carousel/slide3.jpg";
import slide4 from "../assets/carousel/slide4.jpg";
import slide5 from "../assets/carousel/slide5.jpg";
import slide6 from "../assets/carousel/slide6.jpg";
import slide7 from "../assets/carousel/slide7.jpg";
import slide8 from "../assets/carousel/slide8.jpg";

const slides = [
  { src: slide1, alt: "Retro space hero cover" },
  { src: slide2, alt: "Alien planet landscape" },
  { src: slide3, alt: "Neon cyberpunk city" },
  { src: slide4, alt: "Vintage sci-fi magazine cover" },
  { src: slide5, alt: "Spaceship interior" },
  { src: slide6, alt: "Robot illustration" },
  { src: slide7, alt: "Time travel portal" },
  { src: slide8, alt: "Cosmic nebula scene" },
];

const AUTO_INTERVAL = 4000; // 4 seconds

const Carousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const goTo = (i: number) => setIndex(i);
  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-full">
      {/* Slides */}
      {slides.map((slide, i) => (
        <img
          key={i}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Gradient overlay for a bit of drama */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full text-sm hover:bg-black/60"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full text-sm hover:bg-black/60"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
