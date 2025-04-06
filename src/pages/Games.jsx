import React, { useState } from "react";
import Header from "../components/Header"; // Import the Header component
import "./Games.css";

export default function Games() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    console.log(isMuted ? "Sound ON" : "Sound OFF");
  };

  return (
    <div className="games-screen">
      <Header isMuted={isMuted} toggleSound={toggleSound} />
      <div className="content flex-grow flex items-center justify-center">
        <h1 className="text-xl text-white">Welcome to the Games Page!</h1>
      </div>
    </div>
  );
}