"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Factor {
  name: string;
  score: number;
  weight: number;
  description: string;
  impact: "positive" | "negative" | "neutral";
}

interface FactorBreakdownProps {
  factors: Factor[];
}

export default function FactorBreakdown({ factors }: FactorBreakdownProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-[#16a34a]";
      case "negative":
        return "text-[#dc2626]";
      default:
        return "text-[#a8a29e]";
    }
  };

  const getBarColor = (score: number) => {
    if (score >= 70) return "bg-[#16a34a]";
    if (score >= 50) return "bg-[#c2410c]";
    if (score >= 30) return "bg-warning";
    return "bg-[#dc2626]";
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "positive":
        return "Favorable";
      case "negative":
        return "Unfavorable";
      default:
        return "Neutral";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-5">
      <h4 className="text-sm font-semibold text-[#1c1917] mb-4">Scoring Factor Breakdown</h4>
      <div className="space-y-3">
        {factors.map((factor, index) => (
          <div key={factor.name} className="bg-white rounded-lg border border-[#e2ddd5] overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-3 hover:bg-[#f5f3ef]/50 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#1c1917] truncate">{factor.name}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-xs font-medium ${getImpactColor(factor.impact)}`}>
                        {getImpactLabel(factor.impact)}
                      </span>
                      <span className="text-sm font-bold text-[#1c1917]">{factor.score}</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-[#e2ddd5] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getBarColor(factor.score)} transition-all duration-500`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#a8a29e] ml-2 shrink-0 transition-transform duration-200 ${
                  expandedIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedIndex === index && (
              <div className="px-3 pb-3 border-t border-[#e2ddd5]">
                <p className="text-xs text-[#a8a29e] mt-2 leading-relaxed">{factor.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-[#a8a29e]">Weight:</span>
                  <span className="text-xs font-medium text-[#1c1917]">{Math.round(factor.weight * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
