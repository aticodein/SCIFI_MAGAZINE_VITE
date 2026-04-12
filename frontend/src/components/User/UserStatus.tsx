// src/components/User/UserStatus.tsx

import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import {
    clearSessionStoragePreservingPrefs,
    notifySessionChanged,
    SESSION_CHANGED_EVENT,
} from '../../utils/session';

export function UserStatus() {
  const [username, setUsername] = useState<string | null>(null);

  const fetchUsername = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setUsername(data.username || null);
    } catch (err) {
      console.error('Failed to check user session:', err);
      setUsername(null);
    }
  }, []);

  useEffect(() => {
    fetchUsername();
  }, [fetchUsername]);

  useEffect(() => {
    const handler = () => {
      fetchUsername();
    };
    window.addEventListener(SESSION_CHANGED_EVENT, handler);
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, handler);
  }, [fetchUsername]);

  async function handleLogout() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      console.log('🚪 Logged out:', data);
      clearSessionStoragePreservingPrefs(); // ✅ new utility
      setUsername(null);
      notifySessionChanged();
    } catch (err) {
      console.error('Logout failed:', err);
      alert('❌ Failed to logout.');
    }
  }

  if (!username) return null;

  return (
    <div className="flex items-center text-sm text-earth-clay gap-2">
      <span>
        Operator: <strong>{username}</strong>
      </span>
      <button onClick={handleLogout} className="text-red-400 underline hover:text-red-600">
        Logout
      </button>
    </div>
  );
}
