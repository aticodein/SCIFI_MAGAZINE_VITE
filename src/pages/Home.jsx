import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Import speaker icons
import sciFiPing from "../assets/sounds/sci-fi-ping.mp3"; // Import the sci-fi ping sound
import sonarSound from "../assets/sounds/sci-fi-sonar.mp3"; // Import the sonar sound
import sciFiSlider from "../assets/sounds/sci-fi-slider.mp3"; // Import the slider sound
import sciFiReadMoreSound from "../assets/sounds/sci-fi-read-more-sound.mp3";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false); // State to track if START was clicked
  const [showArticles, setShowArticles] = useState(false); // State to control article visibility
  const [selectedArticle, setSelectedArticle] = useState(null); // State to track the selected article
  const [isMuted, setIsMuted] = useState(false); // State to track sound on/off
  const sliderAudioRef = useRef(null); // Ref to manage slider audio

  const handleStart = () => {
    playButtonSound();
    setStarted(true); // Show the console section
  };

  const handleIgnition = () => {
    playButtonSound();
    console.log("Ignition button clicked!");
  };

  const handleArticlesClick = () => {
    playButtonSound();
    setShowArticles(true); // Show the articles section when "Articles" button is clicked
  };

  const handleReadMoreClick = (article) => {
    playReadMoreSound();
    setSelectedArticle(article); // Show the relevant article in the "Exclusive Content" section
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

  const toggleSound = () => {
    // Play the sci-fi ping sound first
    const audio = new Audio(sciFiPing);
    audio.play();

    // Then toggle the muted state
    setIsMuted(!isMuted);

    console.log(isMuted ? "Sound ON" : "Sound OFF");
  };

  const playReadMoreSound = () => {
    if (!isMuted) {
      const audio = new Audio(sciFiReadMoreSound);
      audio.play();
    }
  };

  return (
    <div className="home-screen">
      {/* HEADER BANNER */}
      <header className="header-banner">
        <span>SCI-FI Magazine</span>
        <button className="sound-toggle" onClick={toggleSound}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </header>

      {/* ARTICLES SECTION */}
      <AnimatePresence>
        {showArticles && (
          <motion.section
            className="articles-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="articles-title">Books</h2>
            <div className="articles-container">
              {[1, 2, 3, 4].map((article) => (
                <article key={article} className="article-card">
                  <h3>Book {article}</h3>
                  <p>
                    This is a short description of the Book {article}. Click to 
                  </p>
                  <motion.button
                    className="button read-more-button"
                    onClick={() => handleReadMoreClick(article)} // Show the relevant article
                    whileTap={{ scale: 0.95 }}
                  >
                    Read More
                  </motion.button>
                </article>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* EXCLUSIVE CONTENT SECTION */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.section
            className="exclusive-content-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="exclusive-content-title">Book{selectedArticle}</h2>
            <div className="exclusive-content-container">
              <article className="exclusive-content-card">
                <h3>Book {selectedArticle}</h3>
                <p>
                  This is the detailed content of the Book {selectedArticle}.
                </p>
              </article>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

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

      {/* CONSOLE SECTION */}
      <AnimatePresence>
        {started && (
          <motion.section
            id="console"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="console-panel"
          >
            {/* SLIDERS */}
            <div className="slider-box">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="slider-container">
                  <label className="slider-label">Slider {n}</label>
                  <motion.input
                    type="range"
                    min="0"
                    max="100"
                    className="styled-slider"
                    whileTap={{ scale: 1.05 }}
                    onMouseEnter={playSliderSound} // Play sound on hover
                    onMouseLeave={stopSliderSound} // Stop sound when hover off
                  />
                </div>
              ))}
            </div>

            {/* BUTTONS BOX */}
            <div className="buttons-box">
              <motion.button
                className="console-button"
                onClick={handleIgnition} // Use the defined function
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
                GAMES
              </motion.button>
              {[3, 4, 5, 6].map((n) => (
                <motion.button
                  key={n}
                  className="console-button"
                  onClick={n === 3 ? handleArticlesClick : playButtonSound} // Show articles on Button 3 click
                >
                  {n === 3 ? "Books" : `BUTTON ${n}`}
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}