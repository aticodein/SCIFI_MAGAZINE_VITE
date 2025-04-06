import React, { useState } from "react";
import Header from "../components/Header"; // Import the Header component
import "./About.css";

export default function About() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    console.log(isMuted ? "Sound ON" : "Sound OFF");
  };

  return (
    <div className="about-screen">
      <Header isMuted={isMuted} toggleSound={toggleSound} />
      <div className="content flex-grow flex items-center justify-center">
        <h1 className="text-xl text-white">Welcome to the About Page!</h1>
      </div>
    </div>
  );
}