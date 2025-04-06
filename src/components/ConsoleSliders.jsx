import React from "react";
import { motion } from "framer-motion";
import "./ConsoleSliders.css";

export default function ConsoleSliders({ playSliderSound, stopSliderSound }) {
  return (
    <div className="slider-box">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="slider-container">
          <label className="slider-label">Slider {n}</label>
          <motion.input
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            className="styled-slider"
            whileTap={{ scale: 1.05 }}
            onMouseEnter={playSliderSound}
            onMouseLeave={stopSliderSound}
          />
        </div>
      ))}
    </div>
  );
}