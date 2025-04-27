// src/components/User/Username.tsx

import React, { useState, useEffect } from "react";

export function Username() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("usernames");
    if (!saved) {
      localStorage.setItem("usernames", JSON.stringify([]));
    }
  }, []);

  const validateUsername = (name: string) => {
    const regex = /^[a-zA-Z0-9]{3,20}$/;
    return regex.test(name);
  };

  const handleSave = () => {
    if (!validateUsername(username)) {
      setError("Invalid username. Use 3-20 letters or numbers only.");
      setSuccess(false);
      return;
    }

    const savedUsernames = JSON.parse(localStorage.getItem("usernames") || "[]");

    if (savedUsernames.includes(username)) {
      setError("Username already taken. Please choose another one.");
      setSuccess(false);
      return;
    }

    savedUsernames.push(username);
    localStorage.setItem("usernames", JSON.stringify(savedUsernames));
    localStorage.setItem("username", username); // Save current username separately too
    setError("");
    setSuccess(true);
  };

  return (
    <div className="mt-8 text-center">
      {/* Input field + Clear X */}
      <div className="relative inline-block w-72 mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Create your username..."
          className="px-4 py-2 pr-10 rounded-lg text-black w-full"
        />
        {username && (
          <button
            onClick={() => {
              setUsername("");
              setError("");
              setSuccess(false);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 text-xl font-bold focus:outline-none"
            aria-label="Clear username input"
          >
            ×
          </button>
        )}
      </div>
  
      {/* Save Username Button */}
      <div>
        <button
          onClick={handleSave}
          className="bg-brand-yellow text-brand-dark px-4 py-2 rounded font-semibold hover:bg-brand-orange transition"
        >
          Save Username
        </button>
      </div>
  
      {/* Error or Success Messages */}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {success && <p className="text-green-400 mt-2 text-sm">Username saved successfully!</p>}
    </div>
  );
}  
