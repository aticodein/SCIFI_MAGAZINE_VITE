import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header"; // Import the Header component
import ConsoleButtons from "../components/ConsoleButtons"; // Import the ConsoleButtons component
import ConsoleSliders from "../components/ConsoleSliders"; // Import the ConsoleSliders component
import Console from "../components/Console"; // Import the Console component
import BooksSection from "../components/BooksSection"; // Import the BooksSection component
import sciFiPing from "../assets/sounds/sci-fi-ping.mp3";
import sonarSound from "../assets/sounds/sci-fi-sonar.mp3";
import sciFiSlider from "../assets/sounds/sci-fi-slider.mp3";
import "./Home.css";

export default function Home() {
  const [started, setStarted] = useState(false); // State to track if START was clicked
  const [isMuted, setIsMuted] = useState(false); // State to track sound on/off
  const [showBooks, setShowBooks] = useState(false); // State to track if Books Section is displayed
  const sliderAudioRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  // Load the `started` state from localStorage when the component mounts
  useEffect(() => {
    const savedStartedState = localStorage.getItem("started");
    if (savedStartedState === "true") {
      setStarted(true);
    }
  }, []);

  // Save the `started` state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("started", started);
  }, [started]);

  const handleStart = () => {
    playButtonSound();
    setStarted(true); // Show the console section
  };

  const resetHomeState = () => {
    setStarted(false); // Reset the started state
    setShowBooks(false); // Hide the Books Section
  };

  const toggleSound = () => {
    const audio = new Audio(sciFiPing);
    audio.play();
    setIsMuted(!isMuted);
  };

  const playButtonSound = () => {
    if (!isMuted) {
      const audio = new Audio(sonarSound);
      audio.play();
    }
  };

  const playSliderSound = () => {
    if (!isMuted) {
      if (!sliderAudioRef.current) {
        sliderAudioRef.current = new Audio(sciFiSlider);
      }
      sliderAudioRef.current.loop = true; // Loop the sound while hovering
      sliderAudioRef.current.play();
    }
  };

  const stopSliderSound = () => {
    if (sliderAudioRef.current) {
      sliderAudioRef.current.pause();
      sliderAudioRef.current.currentTime = 0; // Reset the audio to the beginning
    }
  };

  // Animation Variants
  const sectionVariants = {
    hidden: (direction) => ({
      x: direction === "right" ? "100%" : "-100%", // Slide in from the left or right
      opacity: 0,
    }),
    visible: {
      x: 0, // Center the section
      opacity: 1,
      transition: {
        duration: 0.7, // Shorten the duration for faster entry
        ease: "easeInOut",
      },
    },
    exit: (direction) => ({
      x: direction === "right" ? "-100%" : "100%", // Slide out to the left or right
      opacity: 0,
      transition: {
        duration: 0.5, // Slightly shorter duration for exit
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="home-screen">
      {/* HEADER BANNER */}
      <Header
        isMuted={isMuted}
        toggleSound={toggleSound}
        resetHomeState={resetHomeState} // Pass the reset function
      />

      {/* MAIN CONTENT */}
      <div className="content flex-grow flex items-center justify-center">
        <AnimatePresence>
          {!started && (
            <motion.button
              className="start-button"
              onClick={handleStart}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              START
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* RESERVED SPACE FOR ANIMATED SECTIONS */}
      <div className="animated-sections-container">
        <AnimatePresence mode="sync" custom={showBooks ? "left" : "right"}>
          {/* Console Section */}
          {started && !showBooks && (
            <motion.div
              key="console"
              className="console-panel"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom="right"
            >
              <Console
                playSliderSound={playSliderSound}
                stopSliderSound={stopSliderSound}
                playButtonSound={playButtonSound}
                setShowBooks={setShowBooks}
              />
            </motion.div>
          )}

          {/* Books Section */}
          {showBooks && (
            <motion.div
              key="books"
              className="books-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom="left"
            >
              <BooksSection setShowBooks={setShowBooks} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}