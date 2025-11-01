//  /frontend/src/components/User/SessionLogin.tsx

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";

export function SessionLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const validateUsername = (name: string) => /^[a-zA-Z0-9]{3,20}$/.test(name);

  const handleSave = async () => {
    if (!validateUsername(username)) {
      setError("Use 3–20 letters or numbers.");
      return;
    }

    setError("");
    toast.loading("Logging in...");

    try {
      console.log("🔵 Making request to:", `${API_BASE_URL}/api/create-username/`);
      console.log("🔵 Request body:", JSON.stringify({ username }));
      
      const res = await fetch(`${API_BASE_URL}/api/create-username/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "include",
      });

      console.log("🔵 Response status:", res.status);
      console.log("🔵 Response headers:", [...res.headers.entries()]);
      
      toast.dismiss();
      const data = await res.json();
      console.log("🟢 Response data:", data);

      if (res.status === 201) {
        toast.success(`New user: ${username} created. Welcome! 🚀`);
        setTimeout(() => onLogin(), 4000);
      } else if (res.status === 409) {
        // Existing user — treat as login
        toast.success(`Welcome back, ${username}! You're now logged in. 🚀`);
        setTimeout(() => onLogin(), 4000);
      } else {
        setError(data.error || "Unknown error.");
        toast.error(`❌ ${data.error}`);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("🚫 Could not connect to server.");
    }
  };

  return (
    <div className="text-center mt-12">
      <h2 className="text-xl text-brand-yellow mb-4">Enter Your Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError("");
        }}
        placeholder="Your Username"
        className="px-4 py-2 rounded text-black"
      />
      <div className="mt-4">
        <button
          onClick={handleSave}
          className="bg-brand-yellow text-brand-dark px-4 py-2 rounded font-semibold hover:bg-brand-orange transition"
        >
          Login / Create
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
