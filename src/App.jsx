import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Puzzle from "./pages/Puzzle";
import Movies from "./pages/Movies"; // Import Movies page
import About from "./pages/About"; // Import About page

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/puzzle" element={<Puzzle />} />
        <Route path="/movies" element={<Movies />} /> {/* Add Movies route */}
        <Route path="/about" element={<About />} /> {/* Add About route */}
      </Routes>
    </Router>
  );
}