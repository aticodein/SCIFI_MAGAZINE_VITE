import React, { useState } from "react";
import { motion } from "framer-motion";
import movie1 from "../assets/images/movie1.jpg";
import movie2 from "../assets/images/movie2.jpg";
import movie3 from "../assets/images/movie3.jpg";
import movie4 from "../assets/images/movie4.jpg";

const initialPositions = {
  card1: { x: 0, y: 0 },
  card2: { x: 160, y: 0 },
  card3: { x: 0, y: 160 },
  card4: { x: 160, y: 160 },
};

export default function Puzzle() {
  const [positions, setPositions] = useState(initialPositions);
  const [buttonLabel, setButtonLabel] = useState("Reset Game");

  const images = [movie1, movie2, movie3, movie4];

  const resetGame = () => {
    setPositions({ ...initialPositions });
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-xl mb-4">Drag the images around</h1>
      <div
        className="relative bg-gray-800"
        style={{ width: 320, height: 320 }}
      >
        {images.map((src, index) => {
          const key = `card${index + 1}`;
          const { x, y } = positions[key];

          return (
            <motion.img
              key={key}
              src={src}
              alt={key}
              drag
              dragConstraints={{ top: 0, left: 0, right: 160, bottom: 160 }}
              whileDrag={{ scale: 1.05 }}
              style={{
                width: 140,
                height: 140,
                position: "absolute",
                left: x,
                top: y,
                borderRadius: "8px",
                cursor: "grab",
              }}
            />
          );
        })}
      </div>
      <button
        className="mt-6 px-6 py-2 bg-green-500 text-black rounded hover:bg-green-400 transition"
        onClick={resetGame}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
