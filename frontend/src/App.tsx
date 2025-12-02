// src/App.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

// Reusable section component
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CtaBanner from "./components/CtaBanner";

export default function App() {
  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream">

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />


      {/* CTA Banner */}
      <CtaBanner />

    </div>
  );
}
