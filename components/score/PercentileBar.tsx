"use client";

import { useEffect, useState } from "react";

interface PercentileBarProps {
  percentile: number; // 0-100
}

export default function PercentileBar({ percentile }: PercentileBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentile), 100);
    return () => clearTimeout(timer);
  }, [percentile]);

  const getDescription = () => {
    if (percentile >= 80)
      return `Your rent is higher than ${percentile}% of similar apartments. You are paying more than most tenants in your area.`;
    if (percentile >= 60)
      return `Your rent is higher than ${percentile}% of similar apartments. Slightly above the median for your area.`;
    if (percentile >= 40)
      return `Your rent is higher than ${percentile}% of similar apartments. You are paying around the median.`;
    if (percentile >= 20)
      return `Your rent is higher than only ${percentile}% of similar apartments. You have a good deal.`;
    return `Your rent is in the bottom ${percentile}% of similar apartments. Excellent deal!`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[#1c1917]">Rent Percentile</h4>
        <span className="text-sm font-bold text-[#c2410c]">{percentile}th percentile</span>
      </div>

      {/* Gradient bar */}
      <div className="relative h-4 rounded-full bg-[#faf9f7] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${animatedWidth}%`,
            background: "linear-gradient(90deg, #16a34a, #c2410c, #f59e0b, #dc2626)",
          }}
        />
        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#c2410c] shadow-lg transition-all duration-1000 ease-out"
          style={{ left: `calc(${animatedWidth}% - 8px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-[#16a34a]">Cheapest</span>
        <span className="text-xs text-[#a8a29e]">Median</span>
        <span className="text-xs text-[#dc2626]">Most Expensive</span>
      </div>

      <p className="text-xs text-[#a8a29e] mt-3 leading-relaxed">{getDescription()}</p>
    </div>
  );
}
