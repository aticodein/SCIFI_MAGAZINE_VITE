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
  
  const handleLoginSuccess = async () => {
    console.log('🔄 RetroGatekeeper: Login successful, refetching username...');
    setChecking(true);
    try {
      // Small delay to ensure session is established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log('🌐 RetroGatekeeper: Post-login response status:', res.status);
      const data = await res.json();
      console.log('📡 RetroGatekeeper: Post-login response data:', data);
      if (data.username) {
        console.log('✅ RetroGatekeeper: Post-login username found:', data.username);
        setUsername(data.username);
      } else {
        console.log('❌ RetroGatekeeper: Post-login no username found');
        setUsername(null);
      }
    } catch (error) {
      console.error('💥 RetroGatekeeper: Post-login error:', error);
      setUsername(null);
    } finally {
      setChecking(false);
    }
  };

  if (!username) {
    return <SessionLogin onLogin={handleLoginSuccess} />;
  }
  
  if (!welcomeDone) {
    return <WelcomeBack username={username} onCountdownDone={() => setWelcomeDone(true)} />;
  }
  
  // Final stage: retrozone unlocked
  return <RetroZoneDashboard />;
}
