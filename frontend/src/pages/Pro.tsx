// src/pages/Pro.tsx

import React, { useState, useEffect } from "react";
import { CodeCollector } from "../components/Pro/CodeCollector";
import { ProgressTracker } from "../components/Pro/ProgressTracker";
import { SessionLogin } from "../components/User/SessionLogin";
import { API_BASE_URL } from "../config/api";

type CodesState = Record<"A" | "B" | "C" | "D" | "E", string | null>;

export default function ProPage() {
  const [codes, setCodes] = useState<CodesState>({
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
  });

  const [username, setUsername] = useState<string | null>(null);
  const [checkingLogin, setCheckingLogin] = useState(true);
  


  const fetchUsername = async () => {
    setCheckingLogin(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUsername(data.username || null);
    } catch (err) {
      console.error("Error checking username:", err);
      setUsername(null);
    } finally {
      setCheckingLogin(false);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  useEffect(() => {
    const savedCodes = localStorage.getItem("proCodes");
    const activated = localStorage.getItem("activatedCode");

    let initialCodes: CodesState = {
      A: null,
      B: null,
      C: null,
      D: null,
      E: null,
    };

    if (savedCodes) {
      initialCodes = JSON.parse(savedCodes);
    }

    if (activated) {
      const part = activated[0] as keyof CodesState;
      console.log("ProPage caught Activated Code:", activated, " for part:", part);
      initialCodes[part] = activated;
      localStorage.removeItem("activatedCode");
    }

    setCodes(initialCodes);
  }, []);

  // Listen for storage changes (when coming from Retro Zone)
  useEffect(() => {
    const handleStorageChange = () => {
      const activated = localStorage.getItem("activatedCode");
      if (activated) {
        const part = activated[0] as keyof CodesState;
        console.log("Storage change detected - Activated Code:", activated, " for part:", part);
        setCodes(prev => ({ ...prev, [part]: activated }));
        localStorage.removeItem("activatedCode");
      }
    };

    // Listen for storage events (from other tabs/navigation)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on focus (when returning to this tab)
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("proCodes", JSON.stringify(codes));
  }, [codes]);

  function handleFakeAdd(part: string | number | symbol) {
    const codePart = part as keyof CodesState;
    // Only add fake code if no real code exists for this part
    if (!codes[codePart]) {
      setCodes((prev) => ({ ...prev, [codePart]: generateCodePiece(codePart) }));
    }
  }

  function generateCodePiece(part: keyof CodesState) {
    return `${part}-${Math.floor(Math.random() * 90 + 10)}`;
  }

  async function handleSubmitCode() {
    // 1. Check that all 5 code parts are present
    const parts = ["A", "B", "C", "D", "E"] as (keyof CodesState)[];
    const missing = parts.filter((p) => !codes[p]);
  
    if (missing.length > 0) {
      alert(`You're missing these parts: ${missing.join(", ")}`);
      return;
    }
  
    // 2. Assemble token
    const fullToken = parts.map((p) => codes[p]).join("-");
  
    // 3. Send to backend
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/redeem/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: fullToken }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(`✅ ${data.message}\nExpires: ${data.expires}`);
        localStorage.removeItem("proCodes");
        window.location.reload();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error("Redemption error:", err);
      alert("🚫 Failed to redeem code. Server unreachable.");
    }
  }

  if (checkingLogin) return <div className="p-6">Checking session...</div>;

  if (!username) {
    return (
      <div className="min-h-screen bg-earth-olive text-earth-cream p-8">
        <SessionLogin onLogin={fetchUsername} />
      </div>
    );
  }

  async function handleLogout() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log("🚪 Logged out:", data);
      localStorage.clear(); // Clear token state too
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("❌ Failed to logout.");
    }
  }
  

  

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Unlock Pro Access</h1>

        <ProgressTracker codes={codes} />

        <CodeCollector codes={codes} onFindCode={handleFakeAdd} />

        <div className="text-center mt-6">
          <button
              className="bg-brand-dark text-earth-cream px-6 py-3 rounded-full font-semibold hover:bg-brand-light transition"
              onClick={handleSubmitCode}
            >
            Submit Your Full Code
          </button>
        </div>
      </div>
    </div>
  );
}
