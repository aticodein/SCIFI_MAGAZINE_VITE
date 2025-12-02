// src/components/CtaBanner.tsx

import React from "react";
import { Link } from "react-router-dom";

const CtaBanner: React.FC = () => {
  return (
    <div className="bg-brand-dark py-12 text-center text-earth-cream">
      <h3 className="text-2xl font-bold mb-3">Join the Crew</h3>
      <p className="text-sm mb-4">
        Subscribe for early access to AI tools, story drops, and more.
      </p>

      <Link
        to="/pro"
        className="inline-block bg-brand-yellow text-brand-dark px-5 py-2 rounded font-semibold hover:bg-brand-orange transition"
      >
        Become a Pro Member
      </Link>
    </div>
  );
};

export default CtaBanner;
