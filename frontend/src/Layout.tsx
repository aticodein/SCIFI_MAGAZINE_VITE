import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CookieConsent } from "./components/User/CookieConsent";
import { AstraGuide } from "./components/AstraGuide";

export default function Layout() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <main className="p-1 bg-earth-olive">
        <Outlet />
      </main>

      <Footer />
      <CookieConsent />

      {/* Floating guide button & panel */}
      <AstraGuide />
    </div>
  );
}
