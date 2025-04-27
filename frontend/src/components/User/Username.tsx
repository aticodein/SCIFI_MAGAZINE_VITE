// src/components/User/Username.tsx

import React, { useState, useEffect } from "react";

interface UsernameProps {
  mode?: "default" | "retro";
}

export function Username({ mode = "default" }: UsernameProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("usernames");
    if (!saved) {
      localStorage.setItem("usernames", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (mode === "retro") {
      if (countdown !== null && countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1500);
      } else if (countdown === 0) {
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, mode]);

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
    localStorage.setItem("username", username);
    setError("");
    setSuccess(true);

    if (mode === "retro") {
      setCountdown(3); // Only start countdown if in Retro mode
    }
  };

  return (
    <div className="mt-8 text-center mb-8">
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

      {success && (
        <div className="mt-4 text-green-400 text-center">
          {mode === "retro" ? (
            countdown !== null && countdown > 0 ? (
              <div className="text-4xl animate-pulse transition-transform transform scale-110">
                Username created! Entering RetroZone in {countdown}!
              </div>
            ) : (
              <div className="text-lg mt-2 animate-bounce">
                ENTER
              </div>
            )
          ) : (
            <div className="text-lg mt-2">
              Username created successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
