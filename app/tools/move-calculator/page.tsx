"use client";

import { useState } from "react";
import { Calculator, TrendingUp, TrendingDown, DollarSign, Home, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/rent-calculator";
import Link from "next/link";

interface MoveResult {
  totalMovingCost: number;
  monthlySavings: number;
  breakEvenMonths: number;
  fiveYearSavings: number;
  recommendation: "move" | "stay" | "negotiate";
  breakdown: { label: string; amount: number }[];
  summary: string;
}

export default function MoveCalculatorPage() {
  const [currentRent, setCurrentRent] = useState("");
  const [newRent, setNewRent] = useState("");
  const [movingCosts, setMovingCosts] = useState("2000");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [brokerFee, setBrokerFee] = useState("0");
  const [earlyTermination, setEarlyTermination] = useState("0");
  const [result, setResult] = useState<MoveResult | null>(null);

  const calculate = () => {
    const current = Number(currentRent);
    const newR = Number(newRent);
    const moving = Number(movingCosts) || 2000;
    const deposit = Number(securityDeposit) || newR;
    const broker = Number(brokerFee) || 0;
    const termination = Number(earlyTermination) || 0;

    const totalMovingCost = moving + deposit + broker + termination;
    const monthlySavings = current - newR;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(totalMovingCost / monthlySavings) : 999;
    const fiveYearSavings = monthlySavings * 60 - totalMovingCost;

    let recommendation: "move" | "stay" | "negotiate" = "negotiate";
    let summary = "";

    if (monthlySavings <= 0) {
      recommendation = "stay";
      summary = `The new apartment costs ${formatCurrency(Math.abs(monthlySavings))} more per month. Staying at your current place is the better financial choice.`;
    } else if (breakEvenMonths <= 6) {
      recommendation = "move";
      summary = `You will break even in just ${breakEvenMonths} months and save ${formatCurrency(fiveYearSavings)} over 5 years. Moving is a strong financial decision.`;
    } else if (breakEvenMonths <= 12) {
      recommendation = "move";
      summary = `You will break even in ${breakEvenMonths} months. If you plan to stay at least a year, moving makes financial sense with ${formatCurrency(fiveYearSavings)} in 5 year savings.`;
    } else if (breakEvenMonths <= 18) {
      recommendation = "negotiate";
      summary = `Break even takes ${breakEvenMonths} months. Consider negotiating your current rent first. If you can reduce it by ${formatCurrency(monthlySavings / 2)}, staying might be better.`;
    } else {
      recommendation = "stay";
      summary = `It takes ${breakEvenMonths} months to break even. The upfront costs are too high relative to the monthly savings. Try negotiating your current rent instead.`;
    }

    setResult({
      totalMovingCost,
      monthlySavings,
      breakEvenMonths: monthlySavings > 0 ? breakEvenMonths : 0,
      fiveYearSavings,
      recommendation,
      breakdown: [
        { label: "Moving expenses", amount: moving },
        { label: "Security deposit", amount: deposit },
        { label: "Broker fee", amount: broker },
        { label: "Early termination fee", amount: termination },
      ],
      summary,
    });
  };

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#e2ddd5] text-xs font-medium text-[#c2410c] mb-4">
            <Calculator className="w-3.5 h-3.5" />
            CALCULATOR
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-3">
            Move vs Stay <span className="text-[#c2410c] font-bold">Calculator</span>
          </h1>
          <p className="text-[#57534e]">
            Compare the true cost of moving to a new apartment versus staying and negotiating. Free to use.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
            <h2 className="text-lg font-semibold text-[#1c1917] mb-5">Enter Your Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Current Monthly Rent</label>
                <input type="number" className="input-dark w-full px-4 py-3" placeholder="2000" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">New Apartment Rent</label>
                <input type="number" className="input-dark w-full px-4 py-3" placeholder="1700" value={newRent} onChange={(e) => setNewRent(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Estimated Moving Costs</label>
                <input type="number" className="input-dark w-full px-4 py-3" placeholder="2000" value={movingCosts} onChange={(e) => setMovingCosts(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">New Security Deposit</label>
                <input type="number" className="input-dark w-full px-4 py-3" placeholder="Same as new rent" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Broker Fee (if any)</label>
                <input type="number" className="input-dark w-full px-4 py-3" placeholder="0" value={brokerFee} onChange={(e) => setBrokerFee(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Early Termination Fee (if any)</label>
                <input type="number" className="input-dark w-full px-4 py-3" placeholder="0" value={earlyTermination} onChange={(e) => setEarlyTermination(e.target.value)} />
              </div>
              <button
                className="bg-[#0d9488] text-white font-semibold rounded-xl hover:bg-[#0f766e] transition-all w-full py-3 text-sm flex items-center justify-center gap-2 mt-2"
                onClick={calculate}
                disabled={!currentRent || !newRent}
              >
                <Calculator className="w-4 h-4" />
                Calculate
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Recommendation */}
                <div className={`rounded-2xl p-6 border ${
                  result.recommendation === "move"
                    ? "bg-white shadow-sm border-[#16a34a]/30"
                    : result.recommendation === "stay"
                    ? "bg-white shadow-sm border-[#c2410c]/30"
                    : "bg-white shadow-sm border-[#0d9488]/20"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {result.recommendation === "move" ? (
                      <Home className="w-6 h-6 text-[#16a34a]" />
                    ) : result.recommendation === "stay" ? (
                      <Home className="w-6 h-6 text-[#c2410c]" />
                    ) : (
                      <DollarSign className="w-6 h-6 text-[#b45309]" />
                    )}
                    <h3 className="text-lg font-bold text-[#1c1917] capitalize">
                      Recommendation: {result.recommendation === "negotiate" ? "Negotiate First" : result.recommendation}
                    </h3>
                  </div>
                  <p className="text-sm text-[#57534e] leading-relaxed">{result.summary}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
                    <div className="text-xs text-[#a8a29e] mb-1">Monthly Savings</div>
                    <div className={`text-xl font-bold ${result.monthlySavings > 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                      {result.monthlySavings > 0 ? "+" : ""}{formatCurrency(result.monthlySavings)}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
                    <div className="text-xs text-[#a8a29e] mb-1">Break Even</div>
                    <div className="text-xl font-bold text-[#c2410c]">
                      {result.breakEvenMonths > 0 ? `${result.breakEvenMonths} months` : "N/A"}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
                    <div className="text-xs text-[#a8a29e] mb-1">Total Moving Cost</div>
                    <div className="text-xl font-bold text-warning">{formatCurrency(result.totalMovingCost)}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
                    <div className="text-xs text-[#a8a29e] mb-1">5 Year Net Savings</div>
                    <div className={`text-xl font-bold ${result.fiveYearSavings > 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                      {formatCurrency(result.fiveYearSavings)}
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-5">
                  <h4 className="text-sm font-semibold text-[#1c1917] mb-3">Moving Cost Breakdown</h4>
                  <div className="space-y-2">
                    {result.breakdown.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-[#a8a29e]">{item.label}</span>
                        <span className="text-sm font-medium text-[#1c1917]">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#e2ddd5] pt-2 mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#1c1917]">Total</span>
                      <span className="text-sm font-bold text-[#c2410c]">{formatCurrency(result.totalMovingCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Visual comparison bar */}
                <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-5">
                  <h4 className="text-sm font-semibold text-[#1c1917] mb-4">Monthly Rent Comparison</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#a8a29e]">Current Rent</span>
                        <span className="text-[#1c1917] font-medium">{formatCurrency(Number(currentRent))}</span>
                      </div>
                      <div className="h-6 rounded-full bg-[#f5f3ef] overflow-hidden">
                        <div className="h-full rounded-full bg-[#dc2626]/60" style={{ width: "100%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#a8a29e]">New Rent</span>
                        <span className="text-[#1c1917] font-medium">{formatCurrency(Number(newRent))}</span>
                      </div>
                      <div className="h-6 rounded-full bg-[#f5f3ef] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#16a34a]/60"
                          style={{ width: `${(Number(newRent) / Number(currentRent)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {result.recommendation === "negotiate" && (
                  <Link href="/tools/negotiation-letter" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md w-full py-3 text-sm text-center inline-flex items-center justify-center gap-2">
                    Generate Negotiation Letter
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-8 text-center">
                <Calculator className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1c1917] mb-2">Enter your details</h3>
                <p className="text-sm text-[#a8a29e]">Fill in the form to see a detailed cost comparison and recommendation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
