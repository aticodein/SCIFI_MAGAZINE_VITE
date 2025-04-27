// src/components/User/WelcomeBack.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface WelcomeBackProps {
  username: string;
  onCountdownDone: () => void;
}

export function WelcomeBack({ username, onCountdownDone }: WelcomeBackProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // ✅ Instead of navigate('/retro'), we now:
      onCountdownDone();
    }
  }, [countdown, onCountdownDone]);

  return (
    <div className="text-center py-20 text-xl text-green-400">
      <div className="text-3xl mb-6">Welcome to the RetroZone</div>
      <div className="text-2xl">
        Welcome back, <span className="font-bold">{username}</span>! 🚀
      </div>
      <div className="mt-4 text-lg">
        Entering RetroZone in {countdown}...
      </div>
    </div>
  );
}

