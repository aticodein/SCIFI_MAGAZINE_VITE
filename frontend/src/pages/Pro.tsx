// src/pages/Pro.tsx

import React, { useState, useEffect } from "react";
import { CodeCollector } from "../components/Pro/CodeCollector";
import { ProgressTracker } from "../components/Pro/ProgressTracker";
import { SessionLogin } from "../components/User/SessionLogin";
import { API_BASE_URL } from "../config/api";
import { clearSessionStoragePreservingPrefs } from "../utils/session";

type CodesState = Record<"A" | "B" | "C" | "D" | "E", string | null>;

export default function ProPage() {
  const [codes, setCodes] = useState<CodesState>({
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
  });

  // Debug: Log codes state changes (can be removed in production)
  // useEffect(() => {
  //   console.log(`🔍 [Pro] Codes state changed:`, codes);
  // }, [codes]);

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
    // Load initial codes from localStorage
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
      initialCodes[part] = activated;
      localStorage.removeItem("activatedCode");
    }

    setCodes(initialCodes);
  }, []);



  useEffect(() => {
    // Only update localStorage if we have actual codes or if localStorage is empty
    const existingCodes = JSON.parse(localStorage.getItem("proCodes") || '{"A":null,"B":null,"C":null,"D":null,"E":null}');
    const hasNewCodes = Object.values(codes).some(code => code !== null);
    const hasExistingCodes = Object.values(existingCodes).some(code => code !== null);
    
    // Update localStorage if:
    // 1. We have new codes to save, OR
    // 2. There are no existing codes in localStorage
    if (hasNewCodes || !hasExistingCodes) {
      localStorage.setItem("proCodes", JSON.stringify(codes));
    }
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
      console.log("🔄 ProPage: Starting logout process...");
      const res = await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });
      console.log("🌐 ProPage: Logout API response status:", res.status);
      const data = await res.json();
      console.log("✅ ProPage: Logout successful:", data);
      console.log("🧹 ProPage: Clearing session storage...");
      clearSessionStoragePreservingPrefs();
      console.log("🔄 ProPage: Reloading page...");
      window.location.reload();
    } catch (err) {
      console.error("❌ ProPage: Logout failed:", err);
      alert("❌ Failed to logout.");
    }
  }

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream">
      {/* User Status Bar */}
      <div className="bg-earth-clay text-earth-cream px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">USER:</span>
          <strong className="text-yellow-300">{username}</strong>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-orange-500 transition font-bold text-base"
        >
          ⏻ LOGOUT
        </button>
      </div>

      <div className="p-8">
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
    </div>
  );
}