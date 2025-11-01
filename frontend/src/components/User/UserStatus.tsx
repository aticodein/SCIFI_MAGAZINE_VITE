// src/components/User/UserStatus.tsx

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { clearSessionStoragePreservingPrefs } from "../../utils/session";

export function UserStatus() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsername() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUsername(data.username || null);
      } catch (err) {
        console.error("Failed to check user session:", err);
      }
    }

    fetchUsername();
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log("🚪 Logged out:", data);
      clearSessionStoragePreservingPrefs(); // ✅ new utility
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("❌ Failed to logout.");
    }
  }

  if (!username) return null;

  return (
    <div className="flex items-center text-sm text-earth-clay gap-2">
      <span>
        Logged in: <strong>{username}</strong>
      </span>
      <button
        onClick={handleLogout}
        className="text-red-400 underline hover:text-red-600"
      >
        Logout
      </button>
    </div>
  );
}
