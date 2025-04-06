import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header"; // Import the Header component
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
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="puzzle-screen">
      <Header isMuted={isMuted} toggleSound={toggleSound} />
      {/* Rest of the Puzzle page content */}
    </div>
  );
}
