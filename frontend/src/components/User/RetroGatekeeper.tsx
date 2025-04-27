// src/components/User/RetroGatekeeper.tsx

import React, { useEffect, useState } from "react";
import RetroZoneDashboard from "../Retro-temp/RetroZoneDashboard.tsx";
import { CreateUsername } from "./CreateUsername.tsx";
import { WelcomeBack } from "./WelcomeBack.tsx";

export function RetroGatekeeper() {
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [welcomeDone, setWelcomeDone] = useState(false);


  useEffect(() => {
    async function fetchUsername() {
      try {
        const res = await fetch('http://localhost:8000/api/check-username/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.username) {
          setUsername(data.username);
        } else {
          setUsername(null);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      } finally {
        setChecking(false);
      }
    }

    fetchUsername();
  }, []);

  if (checking) {
    return <div>Checking your RetroZone access...</div>;
  }
  
  if (!username) {
    return <CreateUsername />;
  }
  
  if (!welcomeDone) {
    return <WelcomeBack username={username} onCountdownDone={() => setWelcomeDone(true)} />;
  }
  
  // Final stage: retrozone unlocked
  return <RetroZoneDashboard />;
}
