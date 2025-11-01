// src/components/User/RetroGatekeeper.tsx

import React, { useEffect, useState } from "react";
import RetroZoneDashboard from "../Retro/RetroZoneDashboard.tsx";
import { CreateUsername } from "./CreateUsername.tsx";
import { WelcomeBack } from "./WelcomeBack.tsx";
import { SessionLogin } from "./SessionLogin";
import { API_BASE_URL } from "../../config/api";


export function RetroGatekeeper() {
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [welcomeDone, setWelcomeDone] = useState(false);

  const fetchUsername = async () => {
    setChecking(true);
    try {
      console.log("🔍 RetroGatekeeper: Fetching username from:", `${API_BASE_URL}/api/check-username/`);
      const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log("🔍 RetroGatekeeper: Response status:", res.status);
      console.log("🔍 RetroGatekeeper: Response headers:", [...res.headers.entries()]);
      const data = await res.json();
      console.log("🔍 RetroGatekeeper: Response data:", data);
      if (data.username) {
        setUsername(data.username);
      } else {
        setUsername(null);
      }
    } catch (error) {
      console.error('❌ RetroGatekeeper: Error fetching username:', error);
      setUsername(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  const handleLoginSuccess = () => {
    // Re-fetch username instead of page reload
    fetchUsername();
  };

  if (checking) {
    return <div>Checking your RetroZone access...</div>;
  }
  
  if (!username) {
    return <SessionLogin onLogin={handleLoginSuccess} />;
  }
  
  if (!welcomeDone) {
    return <WelcomeBack username={username} onCountdownDone={() => setWelcomeDone(true)} />;
  }
  
  // Final stage: retrozone unlocked
  return <RetroZoneDashboard username={username} />;
}
