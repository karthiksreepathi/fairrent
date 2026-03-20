"use client";

import { Download, Printer, TrendingUp, Home, Calendar, MapPin } from "lucide-react";

interface Factor {
  name: string;
  score: number;
  weight: number;
}

interface Comparable {
  address: string;
  rent: number;
  bedrooms: number;
}

interface ReportPreviewProps {
  score: number;
  grade: string;
  city: string;
  rent: number;
  bedrooms: number;
  factors: Factor[];
  recommendations: string[];
  comparables?: Comparable[];
}

function getScoreColor(s: number): string {
  if (s >= 80) return "#16a34a";
  if (s >= 60) return "#c2410c";
  if (s >= 40) return "#f59e0b";
  if (s >= 20) return "#c2410c";
  return "#dc2626";
}

function getScoreLabel(s: number): string {
  if (s >= 80) return "Great Deal";
  if (s >= 60) return "Fair Price";
  if (s >= 40) return "Above Average";
  if (s >= 20) return "Overpriced";
  return "Significantly Overpriced";
}

function getGradeBgClass(g: string): string {
  switch (g) {
    case "A": return "bg-[#16a34a]/20 text-[#16a34a] border-[#16a34a]/30";
    case "B": return "bg-[#c2410c]/20 text-[#c2410c] border-[#c2410c]/30";
    case "C": return "bg-warning/20 text-warning border-warning/30";
    case "D": return "bg-[#f5f3ef]0/20 text-orange-400 border-[#f5f3ef]0/30";
    default: return "bg-[#dc2626]/20 text-[#dc2626] border-[#dc2626]/30";
  }
}

function getGradePrintBgClass(g: string): string {
  switch (g) {
    case "A": return "print-grade-a";
    case "B": return "print-grade-b";
    case "C": return "print-grade-c";
    case "D": return "print-grade-d";
    default: return "print-grade-f";
  }
}

function getBarColorClass(s: number): string {
  if (s >= 70) return "bg-[#16a34a]";
  if (s >= 50) return "bg-[#c2410c]";
  if (s >= 30) return "bg-warning";
  return "bg-[#dc2626]";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ReportPreview({
  score,
  grade,
  city,
  rent,
  bedrooms,
  factors,
  recommendations,
  comparables,
}: ReportPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: #1c1917 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .report-container {
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .report-container * {
            color: #1c1917 !important;
            border-color: #e2ddd5 !important;
          }
          .report-header {
            background: #f5f3ef !important;
            border-bottom: 2px solid #c2410c !important;
          }
          .report-section {
            background: #faf9f7 !important;
            border: 1px solid #e2ddd5 !important;
          }
          .report-gauge-ring {
            border-color: #e2ddd5 !important;
          }
          .report-bar-track {
            background: #e2ddd5 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-grade-a { background: #d1fae5 !important; color: #065f46 !important; }
          .print-grade-b { background: #ffedd5 !important; color: #9a3412 !important; }
          .print-grade-c { background: #fef3c7 !important; color: #92400e !important; }
          .print-grade-d { background: #fed7aa !important; color: #9a3412 !important; }
          .print-grade-f { background: #fecaca !important; color: #991b1b !important; }
        }
      `}</style>

      <div className="report-container bg-white rounded-2xl shadow-sm border border-[#e2ddd5] overflow-hidden">
        {/* Report Header */}
        <div className="report-header bg-[#f5f3ef]/50 px-6 py-5 border-b border-[#e2ddd5]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-5 h-5 text-[#c2410c]" />
                <h2 className="text-lg font-bold text-[#1c1917]">FairRent Fairness Report</h2>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#a8a29e]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {city}
                </span>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="no-print bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] shadow-sm px-4 py-2.5 text-xs flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Download Report
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score Gauge and Grade */}
          <div className="report-section bg-[#faf9f7]/50 rounded-xl p-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              {/* Score Ring */}
              <div className="relative">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {/* Background circle */}
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-[#e2ddd5] report-gauge-ring"
                  />
                  {/* Score arc */}
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 58}`}
                    strokeDashoffset={`${2 * Math.PI * 58 * (1 - score / 100)}`}
                    transform="rotate(-90 70 70)"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                  {/* Score text */}
                  <text
                    x="70"
                    y="65"
                    textAnchor="middle"
                    className="fill-[#1c1917] text-3xl font-bold"
                    style={{ fill: scoreColor }}
                  >
                    {score}
                  </text>
                  <text
                    x="70"
                    y="85"
                    textAnchor="middle"
                    className="fill-[#a8a29e] text-xs"
                  >
                    out of 100
                  </text>
                </svg>
              </div>

              {/* Grade and Label */}
              <div className="text-center sm:text-left">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-lg border text-2xl font-bold mb-2 ${getGradeBgClass(grade)} ${getGradePrintBgClass(grade)}`}
                >
                  Grade: {grade}
                </div>
                <p className="text-sm font-medium text-[#57534e]">{scoreLabel}</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="report-section bg-[#faf9f7]/50 rounded-xl p-4 text-center">
              <p className="text-xs text-[#a8a29e] mb-1">Current Rent</p>
              <p className="text-lg font-bold text-[#1c1917]">{formatCurrency(rent)}</p>
              <p className="text-xs text-[#a8a29e] mt-0.5">/month</p>
            </div>
            <div className="report-section bg-[#faf9f7]/50 rounded-xl p-4 text-center">
              <p className="text-xs text-[#a8a29e] mb-1">Bedrooms</p>
              <p className="text-lg font-bold text-[#1c1917]">{bedrooms}</p>
              <p className="text-xs text-[#a8a29e] mt-0.5">{bedrooms === 1 ? "bedroom" : "bedrooms"}</p>
            </div>
            <div className="report-section bg-[#faf9f7]/50 rounded-xl p-4 text-center">
              <p className="text-xs text-[#a8a29e] mb-1">Location</p>
              <p className="text-lg font-bold text-[#1c1917]">{city}</p>
              <p className="text-xs text-[#a8a29e] mt-0.5">metro area</p>
            </div>
          </div>

          {/* Factor Breakdown Table */}
          <div className="report-section bg-[#faf9f7]/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#c2410c]" />
              <h3 className="text-sm font-semibold text-[#1c1917]">Factor Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2ddd5]">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#a8a29e] uppercase tracking-wider">
                      Factor
                    </th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-[#a8a29e] uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-[#a8a29e] uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#a8a29e] uppercase tracking-wider w-1/3">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {factors.map((factor, index) => (
                    <tr
                      key={factor.name}
                      className={`${index !== factors.length - 1 ? "border-b border-[#e2ddd5]/50" : ""}`}
                    >
                      <td className="py-3 px-3 font-medium text-[#1c1917]">{factor.name}</td>
                      <td className="py-3 px-3 text-center font-bold text-[#1c1917]">{factor.score}</td>
                      <td className="py-3 px-3 text-center text-[#57534e]">
                        {Math.round(factor.weight * 100)}%
                      </td>
                      <td className="py-3 px-3">
                        <div className="h-2 rounded-full bg-[#e2ddd5] report-bar-track overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getBarColorClass(factor.score)}`}
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="report-section bg-[#faf9f7]/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#1c1917] mb-3">Recommendations</h3>
            <ul className="space-y-2.5">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f5f3ef] text-[#c2410c] text-xs font-bold flex items-center justify-center mt-0.5"
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-[#57534e] leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comparables Table */}
          {comparables && comparables.length > 0 && (
            <div className="report-section bg-[#faf9f7]/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#1c1917] mb-3">Comparable Listings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2ddd5]">
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#a8a29e] uppercase tracking-wider">
                        Address
                      </th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold text-[#a8a29e] uppercase tracking-wider">
                        Bedrooms
                      </th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-[#a8a29e] uppercase tracking-wider">
                        Rent
                      </th>
                      <th className="text-right py-2.5 px-3 text-xs font-semibold text-[#a8a29e] uppercase tracking-wider">
                        Difference
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparables.map((comp, index) => {
                      const diff = comp.rent - rent;
                      return (
                        <tr
                          key={index}
                          className={`${index !== comparables.length - 1 ? "border-b border-[#e2ddd5]/50" : ""}`}
                        >
                          <td className="py-3 px-3 text-[#1c1917]">{comp.address}</td>
                          <td className="py-3 px-3 text-center text-[#57534e]">{comp.bedrooms}</td>
                          <td className="py-3 px-3 text-right font-medium text-[#1c1917]">
                            {formatCurrency(comp.rent)}
                          </td>
                          <td className={`py-3 px-3 text-right font-medium ${diff > 0 ? "text-[#dc2626]" : diff < 0 ? "text-[#16a34a]" : "text-[#a8a29e]"}`}>
                            {diff > 0 ? "+" : ""}{formatCurrency(diff)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-2 border-t border-[#e2ddd5]/50">
            <p className="text-xs text-[#a8a29e]">
              Generated by FairRent on {formatDate()}. Data is for informational purposes only.
            </p>
          </div>

          {/* Print Button (bottom) */}
          <div className="no-print flex justify-center pt-2">
            <button
              onClick={handlePrint}
              className="btn-outline px-6 py-2.5 text-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
