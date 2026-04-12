// src/pages/Pro.tsx

import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CodeCollector } from '../components/Pro/CodeCollector';
import { ProgressTracker } from '../components/Pro/ProgressTracker';
import { SessionLogin } from '../components/User/SessionLogin';
import { API_BASE_URL } from '../config/api';
import { clearSessionStoragePreservingPrefs } from '../utils/session';

type CodesState = Record<'A' | 'B' | 'C' | 'D' | 'E', string | null>;

export default function ProPage() {
  const [codes, setCodes] = useState<CodesState>({
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
  });

  const [username, setUsername] = useState<string | null>(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

  const fetchUsername = async () => {
    setCheckingLogin(true);
    try {
      console.log('🔄 ProPage: Checking username with API:', API_BASE_URL);
      const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log('🌐 ProPage: Response status:', res.status);
      const data = await res.json();
      console.log('📡 ProPage: Response data:', data);
      if (data.username) {
        console.log('✅ ProPage: Found username:', data.username);
        setUsername(data.username);
      } else {
        console.log('❌ ProPage: No username found');
        setUsername(null);
      }
    } catch (err) {
      console.error('💥 ProPage: Error checking username:', err);
      setUsername(null);
    } finally {
      console.log('🏁 ProPage: Setting checkingLogin to false');
      setCheckingLogin(false);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  useEffect(() => {
    const savedCodes = localStorage.getItem('proCodes');
    const activated = localStorage.getItem('activatedCode');

    let initialCodes: CodesState = {
      A: null,
      B: null,
      C: null,
      D: null,
      E: null,
    };

    if (savedCodes) {
      initialCodes = JSON.parse(savedCodes);
    }

    if (activated) {
      const part = activated[0] as keyof CodesState;
      console.log('ProPage caught Activated Code:', activated, ' for part:', part);
      initialCodes[part] = activated;
      localStorage.removeItem('activatedCode');
    }

    setCodes(initialCodes);
  }, []);

  // 🔧 FIXED: Protective localStorage update to prevent race condition overwrites
  useEffect(() => {
    // Only update localStorage if we actually have codes to save
    const hasNewCodes = Object.values(codes).some((code) => code !== null);

    // Check what's currently in localStorage
    const existingCodes = localStorage.getItem('proCodes');
    const parsedExisting = existingCodes ? JSON.parse(existingCodes) : {};
    const hasExistingCodes = Object.values(parsedExisting).some((code) => code !== null);

    // Update localStorage if:
    // 1. We have new codes to save, OR
    // 2. There are no existing codes in localStorage
    if (hasNewCodes || !hasExistingCodes) {
      localStorage.setItem('proCodes', JSON.stringify(codes));
    }
  }, [codes]);

  function handleFakeAdd(part: string | number | symbol) {
    const codePart = part as keyof CodesState;
    // Only add fake code if no real code exists for this part
    if (!codes[codePart]) {
      setCodes((prev) => ({ ...prev, [codePart]: generateCodePiece(codePart) }));
    }
  }

  function generateCodePiece(part: keyof CodesState) {
    return `${part}-${Math.floor(Math.random() * 90 + 10)}`;
  }

  async function handleSubmitCode() {
    // 1. Check that all 5 code parts are present
    const parts = ['A', 'B', 'C', 'D', 'E'] as (keyof CodesState)[];
    const missing = parts.filter((p) => !codes[p]);

    if (missing.length > 0) {
      alert(`You're missing these parts: ${missing.join(', ')}`);
      return;
    }

    // 2. Assemble token
    const fullToken = parts.map((p) => codes[p]).join('-');

    // 3. Send to backend
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/redeem/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: fullToken }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}\nExpires: ${data.expires}`);
        localStorage.removeItem('proCodes');
        window.location.reload();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('Redemption error:', err);
      alert('🚫 Failed to redeem code. Server unreachable.');
    }
  }

  if (checkingLogin) return <div className="p-6">Checking session...</div>;

  const handleLoginSuccess = async () => {
    console.log('🔄 ProPage: Login successful, refetching username...');
    setCheckingLogin(true);
    try {
      // Small delay to ensure session is established
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchUsername();
    } catch (error) {
      console.error('💥 ProPage: Post-login error:', error);
      setUsername(null);
      setCheckingLogin(false);
    }
  };

  if (!username) {
    return (
      <div className="min-h-screen bg-earth-olive text-earth-cream p-8">
        <SessionLogin onLogin={handleLoginSuccess} />
      </div>
    );
  }

  async function handleLogout() {
    try {
      console.log('🔄 ProPage: Starting logout process...');
      const res = await fetch(`${API_BASE_URL}/api/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
      console.log('🌐 ProPage: Logout API response status:', res.status);
      const data = await res.json();
      console.log('✅ ProPage: Logout successful:', data);
      console.log('🧹 ProPage: Clearing session storage...');
      clearSessionStoragePreservingPrefs();
      console.log('🔄 ProPage: Reloading page...');
      window.location.reload();
    } catch (err) {
      console.error('❌ ProPage: Logout failed:', err);
      alert('❌ Failed to logout.');
    }
  }

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream">
      {/* User Status Bar */}
      <div className="bg-earth-clay text-earth-cream px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">USER:</span>
          <strong className="text-yellow-300">{username}</strong>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-orange-500 transition font-bold text-base"
        >
          <LogOut size={18} />
          <span>LOGOUT</span>
        </button>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Unlock Pro Access</h1>

          <ProgressTracker codes={codes} />

          <CodeCollector codes={codes} onFindCode={handleFakeAdd} />

          <div className="text-center mt-6">
            <button
              className="bg-brand-dark text-earth-cream px-6 py-3 rounded-full font-semibold hover:bg-brand-light transition"
              onClick={handleSubmitCode}
            >
              Submit Your Full Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
