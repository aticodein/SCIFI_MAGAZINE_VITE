// src/components/User/CreateUsername.tsx

import React, { useState } from "react";
import { toast } from 'react-hot-toast';

export function CreateUsername() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const validateUsername = (name: string) => /^[a-zA-Z0-9]{3,20}$/.test(name);

  async function logoutUser() {
    try {
      const res = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      console.log('🚪 Logout successful:', data);
      window.location.reload(); // Reload to clear frontend session immediately
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }

  const handleSave = async () => {
    if (!validateUsername(username)) {
      setError("Invalid username. Use 3-20 letters or numbers only.");
      return;
    }

    setError("");
    toast.loading('Saving username... 🚀');

    try {
      const response = await fetch('http://localhost:8000/api/create-username/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
        credentials: 'include',
      });

      toast.dismiss();

      if (response.ok) {
        toast.success('Username created! Entering RetroZone 🚀');
        setTimeout(() => {
          window.location.reload(); // Reload to re-fetch username and trigger WelcomeBack
        }, 1000);
      } else if (response.status === 409) {
        const errorData = await response.json();
        setError(errorData.error || "Username already exists.");
        toast.error(`⚠️ ${errorData.error}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Unknown error.");
        toast.error(`❌ ${errorData.error}`);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error saving username:', error);
      setError("Failed to connect to server.");
      toast.error('🚫 Failed to connect to server.');
    }
  };

  return (
    <div className="mt-8 text-center mb-8">
      <div className="text-xl mb-4 text-green-400">Welcome to the RetroZone</div>

      <div className="relative inline-block w-72 mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          placeholder="Create your username..."
          className="px-4 py-2 pr-10 rounded-lg text-black w-full"
        />
        {username && (
          <button
            onClick={() => {
              setUsername("");
              setError("");
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 text-xl font-bold focus:outline-none"
            aria-label="Clear username input"
          >
            ×
          </button>
        )}
      </div>

      <div>
        <button
          onClick={handleSave}
          className="bg-brand-yellow text-brand-dark px-4 py-2 rounded font-semibold hover:bg-brand-orange transition"
        >
          Save Username
        </button>
      </div>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <div className="mt-6">
        <button
          onClick={logoutUser}
          className="text-sm underline text-earth-cream hover:text-brand-orange"
        >
          Force Logout (Clear Session)
        </button>
      </div>
    </div>
  );
}
