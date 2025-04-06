import React from "react";
import { useNavigate } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import "./Header.css";

export default function Header({ isMuted, toggleSound, resetHomeState }) {
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER BANNER */}
      <header className="header-banner">
        <span>SCI-FI Magazine</span>
        <button className="sound-toggle" onClick={toggleSound}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </header>

      {/* NAVIGATION SECTION */}
      <nav className="nav-section">
        <button
          className="nav-button"
          onClick={() => {
            if (resetHomeState) resetHomeState(); // Reset the Home state if provided
            navigate("/"); // Navigate to Home
          }}
        >
          Home
        </button>
        <button className="nav-button" onClick={() => navigate("/games")}>
          Games
        </button>
        <button className="nav-button" onClick={() => navigate("/movies")}>
          Movies
        </button>
        <button className="nav-button" onClick={() => navigate("/about")}>
          About
        </button>
      </nav>
    </>
  );
}