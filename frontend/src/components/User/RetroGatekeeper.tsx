// src/components/User/RetroGatekeeper.tsx

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import RetroZoneDashboard from "../Retro/RetroZoneDashboard.tsx";
import { SessionLogin } from "./SessionLogin";
import { WelcomeBack } from "./WelcomeBack.tsx";


export function RetroGatekeeper() {
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [welcomeDone, setWelcomeDone] = useState(false);


  useEffect(() => {
    async function fetchUsername() {
      try {
        console.log('🔄 RetroGatekeeper: Checking username with API:', API_BASE_URL);
        const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
          method: 'GET',
          credentials: 'include',
        });
        console.log('🌐 RetroGatekeeper: Response status:', res.status);
        const data = await res.json();
        console.log('📡 RetroGatekeeper: Response data:', data);
        if (data.username) {
          console.log('✅ RetroGatekeeper: Found username:', data.username);
          setUsername(data.username);
        } else {
          console.log('❌ RetroGatekeeper: No username found');
          setUsername(null);
        }
      } catch (error) {
        console.error('💥 RetroGatekeeper: Error fetching username:', error);
        setUsername(null);
      } finally {
        console.log('🏁 RetroGatekeeper: Setting checking to false');
        setChecking(false);
      }
    }

    fetchUsername();
  }, []);

  if (checking) {
    return <div>Checking your RetroZone access...</div>;
  }
  
  if (!username) {
    return <SessionLogin onLogin={() => window.location.href = "/retro"} />;
  }
  
  if (!welcomeDone) {
    return <WelcomeBack username={username} onCountdownDone={() => setWelcomeDone(true)} />;
  }
  
  // Final stage: retrozone unlocked
  return <RetroZoneDashboard />;
}
