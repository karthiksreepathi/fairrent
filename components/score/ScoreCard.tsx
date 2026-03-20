"use client";

import FairnessGauge from "./FairnessGauge";
import PercentileBar from "./PercentileBar";
import NegotiationLeverageMeter from "./NegotiationLeverageMeter";
import FactorBreakdown from "./FactorBreakdown";
import ConfidenceIndicator from "./ConfidenceIndicator";
import { formatCurrency } from "@/lib/rent-calculator";
import { DollarSign, TrendingDown, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ScoreCardProps {
  result: {
    overallScore: number;
    grade: "A" | "B" | "C" | "D" | "F";
    percentileRank: number;
    negotiationLeverage: "strong" | "moderate" | "weak" | "none";
    factors: {
      name: string;
      score: number;
      weight: number;
      description: string;
      impact: "positive" | "negative" | "neutral";
    }[];
    estimatedFairRent: number;
    potentialSavings: number;
    potentialSavingsAnnual: number;
    confidence: "high" | "medium" | "low";
    summary: string;
    recommendations: string[];
  };
  currentRent: number;
  citySlug: string;
  bedrooms: number;
}

export default function ScoreCard({ result, currentRent, citySlug, bedrooms }: ScoreCardProps) {
  return (
    <div className="space-y-6">
      {/* Main Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#0d9488]/20 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold text-[#1c1917] mb-4">Your Rent Fairness Score</h3>
        <FairnessGauge score={result.overallScore} grade={result.grade} />
        <p className="text-sm text-[#57534e] mt-4 max-w-md mx-auto leading-relaxed">
          {result.summary}
        </p>
        <div className="mt-4">
          <ConfidenceIndicator confidence={result.confidence} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-4 text-center">
          <DollarSign className="w-5 h-5 text-[#c2410c] mx-auto mb-2" />
          <div className="text-xs text-[#a8a29e] mb-1">Estimated Fair Rent</div>
          <div className="text-xl font-bold text-[#c2410c] font-bold">{formatCurrency(result.estimatedFairRent)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-4 text-center">
          <TrendingDown className="w-5 h-5 text-[#16a34a] mx-auto mb-2" />
          <div className="text-xs text-[#a8a29e] mb-1">Potential Annual Savings</div>
          <div className="text-xl font-bold text-[#16a34a]">
            {result.potentialSavingsAnnual > 0
              ? formatCurrency(result.potentialSavingsAnnual)
              : "$0"}
          </div>
        </div>
      </div>

      {/* Percentile */}
      <PercentileBar percentile={result.percentileRank} />

      {/* Negotiation Leverage */}
      <NegotiationLeverageMeter leverage={result.negotiationLeverage} />

      {/* Factor Breakdown */}
      <FactorBreakdown factors={result.factors} />

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-5">
        <h4 className="text-sm font-semibold text-[#1c1917] mb-3">Recommendations</h4>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#c2410c] text-sm mt-0.5">&#8226;</span>
              <span className="text-sm text-[#57534e] leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action CTAs */}
      {result.potentialSavings > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href={`/tools/negotiation-letter?city=${citySlug}&rent=${currentRent}&bedrooms=${bedrooms}`}
            className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] shadow-sm py-3 text-sm text-center inline-flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Negotiation Letter
          </Link>
          <Link
            href={`/tools/comparables?city=${citySlug}&bedrooms=${bedrooms}&maxRent=${currentRent}`}
            className="btn-outline py-3 text-sm text-center inline-flex items-center justify-center gap-2"
          >
            Find Cheaper Comparables
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
