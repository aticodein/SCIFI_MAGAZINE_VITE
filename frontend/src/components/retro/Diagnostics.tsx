// src/components/retro/Diagnostics.tsx
import React, { useState, useEffect } from "react";
import RetroModal from "../RetroModal";

export default function Diagnostics() {
  const [spinRate, setSpinRate] = useState(5420);
  const [powerCell, setPowerCell] = useState(87);
  const [memoryUsage, setMemoryUsage] = useState(68);
  const [cpuTemp, setCpuTemp] = useState(65);
  const [radiationLevel, setRadiationLevel] = useState(12);
  const [signalStrength, setSignalStrength] = useState(92);
  const [shieldIntegrity, setShieldIntegrity] = useState(95);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [fuelReserve, setFuelReserve] = useState(78);
  const [corePressure, setCorePressure] = useState(210);

  const [showModal, setShowModal] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"decoder" | "node" | "emergency" | null>(null);

  // Update all vitals (except oxygen) every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSpinRate(5200 + Math.floor(Math.random() * 400));
      setPowerCell(30 + Math.floor(Math.random() * 70));
      setMemoryUsage(50 + Math.floor(Math.random() * 45));
      setCpuTemp(50 + Math.floor(Math.random() * 30));
      setRadiationLevel(5 + Math.floor(Math.random() * 20));
      setSignalStrength(60 + Math.floor(Math.random() * 40));
      setShieldIntegrity(50 + Math.floor(Math.random() * 50));
      setFuelReserve(30 + Math.floor(Math.random() * 70));
      setCorePressure(190 + Math.floor(Math.random() * 30));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Special oxygen control
  useEffect(() => {
    let phase: "normal" | "middle" | "low" = "normal";

    const oxygenInterval = setInterval(() => {
      if (phase === "normal") {
        setOxygenLevel(85 + Math.floor(Math.random() * 15));
      } else if (phase === "middle") {
        setOxygenLevel(65 + Math.floor(Math.random() * 20));
      } else {
        setOxygenLevel(20 + Math.floor(Math.random() * 45));
      }
    }, 1000);

    const phaseController = () => {
      if (phase === "normal") {
        setTimeout(() => {
          phase = "middle";
          phaseController();
        }, 5000);
      } else if (phase === "middle") {
        setTimeout(() => {
          phase = "low";
          phaseController();
        }, 3000);
      } else {
        setTimeout(() => {
          phase = "normal";
          phaseController();
        }, 2000);
      }
    };
    phaseController();

    return () => clearInterval(oxygenInterval);
  }, []);

  return (
    <div className="p-4 bg-[#111] border border-yellow-300 rounded shadow-md">
      <h2 className="text-lg font-bold text-yellow-300 mb-4">Diagnostics</h2>
      <ul className="text-sm space-y-1">
        <li>⚙️ Drive Spin Rate: <span className="text-yellow-200">{spinRate} RPM</span></li>
        <li>🔋 Power Cell Charge: <span className={`text-yellow-200 ${powerCell < 40 ? "text-red-500 animate-pulse" : ""}`}>{powerCell}%</span></li>
        <li>🧠 Memory Usage: <span className={`text-yellow-200 ${memoryUsage > 85 ? "text-red-500 animate-pulse" : ""}`}>{memoryUsage}%</span></li>
        <li>🌡️ CPU Core Temp: <span className={`text-yellow-200 ${cpuTemp > 75 ? "text-red-500 animate-pulse" : ""}`}>{cpuTemp}°C</span></li>
        <li>☢️ Radiation Level: <span className={`text-yellow-200 ${radiationLevel > 20 ? "text-red-500 animate-pulse" : ""}`}>{radiationLevel} Rads</span></li>
        <li>📶 Signal Strength: <span className={`text-yellow-200 ${signalStrength < 70 ? "text-red-500 animate-pulse" : ""}`}>{signalStrength}%</span></li>
        <li>🛡️ Shield Integrity: <span className={`text-yellow-200 ${shieldIntegrity < 60 ? "text-red-500 animate-pulse" : ""}`}>{shieldIntegrity}%</span></li>

        {oxygenLevel >= 65 && oxygenLevel < 85 ? (
          <button
            onClick={() => {
              setActiveCode("E-17");
              setActiveType("emergency");
              setShowModal(true);
            }}
            className="flex items-center text-orange-400 hover:text-orange-300 transition p-2 rounded w-full text-left"
          >
            ⚠️ Oxygen Level:
            <span className={`ml-2 ${
              oxygenLevel >= 85
                ? "text-green-400"
                : oxygenLevel >= 65
                ? "text-orange-400"
                : "text-red-500 animate-pulse"
            }`}>
              {Math.round(oxygenLevel)}%
            </span>
          </button>
        ) : (
          <li className="flex items-center gap-2">
            <span className="text-earth-cream">🫧</span>
            Oxygen Level:
            <span className={`ml-2 ${
              oxygenLevel >= 85
                ? "text-green-400"
                : oxygenLevel >= 65
                ? "text-orange-400"
                : "text-red-500 animate-pulse"
            }`}>
              {Math.round(oxygenLevel)}%
            </span>
          </li>
        )}

        <li>⛽ Fuel Reserve: <span className={`text-yellow-200 ${fuelReserve < 40 ? "text-red-500 animate-pulse" : ""}`}>{fuelReserve}%</span></li>
        <li>💥 Core Pressure: <span className={`text-yellow-200 ${corePressure > 215 ? "text-red-500 animate-pulse" : ""}`}>{corePressure} PSI</span></li>
      </ul>

      {/* RetroModal */}
      {showModal && activeCode && activeType && (
        <RetroModal
          onClose={() => setShowModal(false)}
          type={activeType}
          code={activeCode}
        />
      )}
    </div>
  );
}
