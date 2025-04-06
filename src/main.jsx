import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Puzzle from './pages/Puzzle'
import Games from './pages/Games' // Import Games page
import About from './pages/About' // Import About page
import Movies from './pages/Movies' // Import Movies page

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulation" element={<Puzzle />} />
        <Route path="/games" element={<Games />} /> {/* Add Games route */}
        <Route path="/about" element={<About />} /> {/* Add About route */}
        <Route path="/movies" element={<Movies />} /> {/* Add Movies route */}
      </Routes>
    </Router>
  </React.StrictMode>,
)
