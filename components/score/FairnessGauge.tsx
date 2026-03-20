"use client";

import { useEffect, useState } from "react";

interface FairnessGaugeProps {
  score: number; // 0-100
  grade: string;
  size?: number;
}

export default function FairnessGauge({ score, grade, size = 220 }: FairnessGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - 24) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * radius; // semicircle
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  const getColor = (s: number) => {
    if (s >= 80) return "#16a34a"; // success
    if (s >= 60) return "#c2410c"; // primary coral
    if (s >= 40) return "#f59e0b"; // warning
    if (s >= 20) return "#c2410c"; // orange
    return "#dc2626"; // danger
  };

  const getGradeColor = (g: string) => {
    switch (g) {
      case "A": return "text-[#16a34a]";
      case "B": return "text-[#c2410c]";
      case "C": return "text-warning";
      case "D": return "text-orange-500";
      default: return "text-[#dc2626]";
    }
  };

  const getLabel = (s: number) => {
    if (s >= 80) return "Great Deal";
    if (s >= 60) return "Fair Price";
    if (s >= 40) return "Above Average";
    if (s >= 20) return "Overpriced";
    return "Significantly Overpriced";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {/* Background track */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          className="score-gauge-track"
        />
        {/* Color segments (decorative) */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={getColor(animatedScore)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke 0.3s ease" }}
        />
        {/* Score text */}
        <text x={cx} y={cy - 15} textAnchor="middle" className="fill-[#1c1917] text-4xl font-bold">
          {animatedScore}
        </text>
        {/* Grade */}
        <text x={cx} y={cy + 10} textAnchor="middle" className={`text-lg font-bold ${getGradeColor(grade)}`} fill="currentColor">
          Grade: {grade}
        </text>
      </svg>
      <div className="text-sm font-medium text-[#a8a29e] mt-1">{getLabel(animatedScore)}</div>
    </div>
  );
}
