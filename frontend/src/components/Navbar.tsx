import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import React from "react";
import logo from "../assets/images/scifim.png";
import { UserStatus } from "../components/User/UserStatus";





const navItems = [
  { name: "Home", path: "/" },
  { name: "Createor", path: "/create" },
  { name: "Reader", path: "/read" },
  { name: "Watcher", path: "/watch" },
  { name: "Retro Zone", path: "/retro" },
  { name: "Pro", path: "/pro" },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white text-gray-900 border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600">
        <img
  src={logo}
  alt="Sci-Fi Logo"
  className="h-12 w-10 object-contain transition-transform duration-300 ease-out hover:scale-[2.5] active:scale-[1.5] will-change-transform  translate-y-4"
/>

           <span className="text-xl font-bold tracking-tight text-earth-clay">Sci-Fi Magazine</span>
        </Link>


        {/* Hamburger Icon */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex gap-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-1 rounded-md hover:bg-earth-cream hover:text-earth-olive transition ${
                location.pathname === item.path
                  ? "bg-earth-olive text-white font-semibold"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
          <UserStatus />
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-700 transition ${
                location.pathname === item.path
                  ? "bg-indigo-500 text-white font-semibold"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
