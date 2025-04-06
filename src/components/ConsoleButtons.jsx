import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ConsoleButtons.css";

export default function ConsoleButtons({ playButtonSound, setShowBooks }) {
  const navigate = useNavigate();

  return (
    <div className="buttons-box">
      <motion.button
        className="console-button"
        onClick={() => {
          playButtonSound();
          console.log("IGNITION clicked!");
        }}
      >
        IGNITION
      </motion.button>
      <motion.button
        className="console-button"
        onClick={() => {
          playButtonSound();
          navigate("/simulation");
        }}
      >
        PUZZLES
      </motion.button>
      <motion.button
        className="console-button"
        onClick={() => {
          playButtonSound();
          setShowBooks(true); // Show the Books Section
        }}
      >
        BOOKS
      </motion.button>
    </div>
  );
}