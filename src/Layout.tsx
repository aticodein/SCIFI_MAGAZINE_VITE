//src/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import React from "react";
import Footer from "./components/Footer";



export default function Layout() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="p-1 bg-earth-olive">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
