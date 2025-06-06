//  /frontend/src/components/User/SessionLogin.tsx

import React, { useState } from "react";
import { toast } from "react-hot-toast";

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
      const res = await fetch("http://localhost:8000/api/create-username/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "include",
      });

      toast.dismiss();
      const data = await res.json();

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
