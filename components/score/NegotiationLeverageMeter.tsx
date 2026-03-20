"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

interface NegotiationLeverageMeterProps {
  leverage: "strong" | "moderate" | "weak" | "none";
}

const leverageConfig = {
  strong: {
    width: 100,
    color: "bg-[#16a34a]",
    label: "Strong",
    description: "Market conditions and your rent level give you excellent negotiation power. Use data to request a reduction.",
    textColor: "text-[#16a34a]",
    icon: "",
  },
  moderate: {
    width: 66,
    color: "bg-[#c2410c]",
    label: "Moderate",
    description: "You have reasonable grounds to negotiate. Present comparable rents and market data to support your case.",
    textColor: "text-[#c2410c]",
    icon: "",
  },
  weak: {
    width: 33,
    color: "bg-warning",
    label: "Weak",
    description: "Limited negotiation power in this market. Focus on lease terms, amenities, or longer lease discounts instead.",
    textColor: "text-warning",
    icon: "",
  },
  none: {
    width: 10,
    color: "bg-[#dc2626]",
    label: "Very Weak",
    description: "Your rent appears to be at or below market rate. Negotiation may not yield significant savings at this time.",
    textColor: "text-[#dc2626]",
    icon: "",
  },
};

export default function NegotiationLeverageMeter({ leverage }: NegotiationLeverageMeterProps) {
  const config = leverageConfig[leverage];
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(config.width), 200);
    return () => clearTimeout(timer);
  }, [config.width]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-[#c2410c]" />
        <h4 className="text-sm font-semibold text-[#1c1917]">Negotiation Leverage</h4>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xl font-bold ${config.textColor}`}>{config.label}</span>
      </div>

      {/* Strength bar */}
      <div className="relative h-3 rounded-full bg-[#faf9f7] overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${config.color} transition-all duration-1000 ease-out`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mb-3">
        <span className="text-xs text-[#dc2626]">Weak</span>
        <span className="text-xs text-warning">Moderate</span>
        <span className="text-xs text-[#16a34a]">Strong</span>
      </div>

      <p className="text-xs text-[#a8a29e] leading-relaxed">{config.description}</p>
    </div>
  );
}
