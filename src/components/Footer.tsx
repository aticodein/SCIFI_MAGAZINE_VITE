// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white text-earth-forest py-6">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-lg mb-3">Sci-Fi Magazine</h3>
            <p className="text-sm leading-relaxed">
              Curated content, AI tools, and reviews for sci-fi lovers. From classic books to futuristic comics, we help you discover and create across the stars.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-semibold mb-2">Explore</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/read" className="hover:underline">Read</Link></li>
              <li><Link to="/create" className="hover:underline">Create</Link></li>
              <li><Link to="/watch" className="hover:underline">Watch</Link></li>
              <li><Link to="/retro" className="hover:underline">Retro Zone</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/pro" className="hover:underline">Pro Tools</Link></li>
              <li><a href="mailto:contact@scifimagazine.com" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold mb-2">Stay Connected</h4>
            <p className="text-sm">Follow us for updates and new drops:</p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="hover:underline text-sm">Twitter</a>
              <a href="#" className="hover:underline text-sm">Instagram</a>
              <a href="#" className="hover:underline text-sm">YouTube</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-earth-olive pt-6 text-sm text-center opacity-70">
          <p>Powered by Sci-Fi Magazine AI. Some content is generated or enriched by AI systems.</p>
          <p className="mt-1">© {new Date().getFullYear()} Sci-Fi Magazine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
