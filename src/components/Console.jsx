import React from "react";
import { motion } from "framer-motion";
import ConsoleSliders from "./ConsoleSliders"; // Import ConsoleSliders
import ConsoleButtons from "./ConsoleButtons"; // Import ConsoleButtons
import "./Console.css";

export default function Console({
  playSliderSound,
  stopSliderSound,
  playButtonSound,
  setShowBooks,
  sectionVariants,
}) {
  return (
    <motion.section
      key="console"
      id="console"
      className="console-panel"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom="right"
    >
      <div className="console-content">
        {/* Sliders */}
        <ConsoleSliders
          playSliderSound={playSliderSound}
          stopSliderSound={stopSliderSound}
        />

        {/* Buttons */}
        <ConsoleButtons
          playButtonSound={playButtonSound}
          setShowBooks={setShowBooks}
        />
      </div>
    </motion.section>
  );
}