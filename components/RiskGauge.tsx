"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface RiskGaugeProps {
  risk: number; // 0-1
}

export function RiskGauge({ risk }: RiskGaugeProps) {
  const gaugeRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (needleRef.current) {
      const angle = (risk * 180) - 90; // -90 to 90 degrees
      gsap.to(needleRef.current, {
        rotation: angle,
        duration: 1.5,
        ease: "power2.out",
      });
    }
  }, [risk]);

  const getRiskColor = (r: number) => {
    if (r < 0.33) return "text-green-400";
    if (r < 0.66) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div ref={gaugeRef} className="relative w-48 h-24">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Risk arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="url(#riskGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${risk * 188} 188`}
          />
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        {/* Needle */}
        <div
          ref={needleRef}
          className="absolute bottom-0 left-1/2 w-1 h-16 bg-white origin-bottom transform -translate-x-0.5"
          style={{ transformOrigin: "50% 80px" }}
        />
        {/* Center point */}
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1.5 translate-y-1" />
      </div>
      <div className={`text-2xl font-bold ${getRiskColor(risk)}`}>
        {(risk * 100).toFixed(1)}%
      </div>
      <div className="text-sm text-slate-400">Failure Risk</div>
    </div>
  );
}