"use client";

import { useState } from "react";
import { cities } from "@/data/cities";
import { BarChart3, CheckCircle, AlertTriangle, XCircle, ChevronRight } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { formatCurrency } from "@/lib/rent-calculator";
import Link from "next/link";

interface AnalysisResult {
  proposedIncrease: number;
  proposedIncreasePercent: number;
  marketAvgIncrease: number;
  fairRangeMin: number;
  fairRangeMax: number;
  isFair: boolean;
  negotiationPoints: string[];
  riskAssessment: "low" | "medium" | "high";
  recommendation: string;
  estimatedNegotiatedRent: number;
}

export default function LeaseAnalyzerPage() {
  const [currentRent, setCurrentRent] = useState("");
  const [proposedRent, setProposedRent] = useState("");
  const [citySlug, setCitySlug] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const selectedCity = cities.find((c) => c.slug === citySlug);

  const analyze = () => {
    const current = Number(currentRent);
    const proposed = Number(proposedRent);
    if (!current || !proposed || !selectedCity) return;

    const proposedIncrease = proposed - current;
    const proposedIncreasePercent = (proposedIncrease / current) * 100;

    // Market average increase based on city YoY change
    const marketAvgIncrease = selectedCity.yoyChange;
    const fairIncreaseMin = Math.max(0, marketAvgIncrease - 1.5);
    const fairIncreaseMax = marketAvgIncrease + 1.5;

    const fairRangeMin = Math.round(current * (1 + fairIncreaseMin / 100));
    const fairRangeMax = Math.round(current * (1 + fairIncreaseMax / 100));

    const isFair = proposed <= fairRangeMax;

    const negotiationPoints: string[] = [];

    if (proposedIncreasePercent > marketAvgIncrease + 2) {
      negotiationPoints.push(
        `Your proposed increase of ${proposedIncreasePercent.toFixed(1)}% exceeds the market average of ${marketAvgIncrease.toFixed(1)}% for ${selectedCity.name}.`
      );
    }

    if (selectedCity.vacancyRate > 5) {
      negotiationPoints.push(
        `The vacancy rate in ${selectedCity.name} is ${selectedCity.vacancyRate}%, which gives you leverage to negotiate. Landlords prefer keeping reliable tenants over finding new ones.`
      );
    }

    if (selectedCity.yoyChange < 0) {
      negotiationPoints.push(
        `Rents in ${selectedCity.name} have been declining (${selectedCity.yoyChange}% year over year). A rent increase is not supported by market trends.`
      );
    }

    negotiationPoints.push(
      "As an existing tenant, you save your landlord turnover costs (typically $2,000 to $5,000 in vacancy, cleaning, and marketing)."
    );

    if (proposedIncreasePercent > 5) {
      negotiationPoints.push(
        "Consider requesting a longer lease term (18 or 24 months) in exchange for a smaller increase."
      );
    }

    let riskAssessment: "low" | "medium" | "high" = "low";
    if (selectedCity.vacancyRate < 3 && selectedCity.yoyChange > 4) {
      riskAssessment = "high";
    } else if (selectedCity.vacancyRate < 5 && selectedCity.yoyChange > 2) {
      riskAssessment = "medium";
    }

    const estimatedNegotiatedRent = Math.round(
      current * (1 + Math.min(proposedIncreasePercent, marketAvgIncrease + 1) / 100)
    );

    let recommendation = "";
    if (isFair) {
      recommendation = `The proposed rent of ${formatCurrency(proposed)} is within the fair market range. While you can always try to negotiate, the increase is reasonable for ${selectedCity.name}.`;
    } else if (proposedIncreasePercent > marketAvgIncrease + 5) {
      recommendation = `The proposed increase is significantly above market. Present comparable rents and market data to counter. Target ${formatCurrency(estimatedNegotiatedRent)} as your counter offer.`;
    } else {
      recommendation = `The proposed increase is slightly above fair market. You have good grounds to negotiate down to approximately ${formatCurrency(estimatedNegotiatedRent)}.`;
    }

    setResult({
      proposedIncrease,
      proposedIncreasePercent,
      marketAvgIncrease,
      fairRangeMin,
      fairRangeMax,
      isFair,
      negotiationPoints,
      riskAssessment,
      recommendation,
      estimatedNegotiatedRent,
    });
  };

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#e2ddd5] text-xs font-medium text-[#c2410c] mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            ANALYZER
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-3">
            Lease Renewal <span className="text-[#c2410c] font-bold">Analyzer</span>
          </h1>
          <p className="text-[#57534e]">
            Analyze your renewal offer against market rates. Know if the proposed increase is fair before you sign. Free to use.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
            <h2 className="text-lg font-semibold text-[#1c1917] mb-5">Renewal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">City</label>
                <CustomSelect
                  value={citySlug}
                  onChange={setCitySlug}
                  options={cities.map((city) => ({ value: city.slug, label: `${city.name}, ${city.stateCode}` }))}
                  placeholder="Select your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Bedrooms</label>
                <CustomSelect
                  value={bedrooms}
                  onChange={setBedrooms}
                  options={[
                    { value: "0", label: "Studio" },
                    { value: "1", label: "1 Bedroom" },
                    { value: "2", label: "2 Bedrooms" },
                    { value: "3", label: "3 Bedrooms" },
                  ]}
                  placeholder="Select bedrooms..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Current Monthly Rent</label>
                <input type="number" className="input-dark w-full px-4 py-3" placeholder="2000" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Proposed Monthly Rent</label>
                <input type="number" className="input-dark w-full px-4 py-3" placeholder="2150" value={proposedRent} onChange={(e) => setProposedRent(e.target.value)} />
              </div>
              <button
                className="bg-[#0d9488] text-white font-semibold rounded-xl hover:bg-[#0f766e] transition-all w-full py-3 text-sm flex items-center justify-center gap-2 mt-2"
                onClick={analyze}
                disabled={!currentRent || !proposedRent || !citySlug}
              >
                <BarChart3 className="w-4 h-4" />
                Analyze Renewal
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Verdict */}
                <div className={`rounded-2xl p-6 border ${result.isFair ? "bg-white shadow-sm border-[#16a34a]/30" : "bg-white shadow-sm border-amber-400/30"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {result.isFair ? (
                      <CheckCircle className="w-6 h-6 text-[#16a34a]" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    )}
                    <h3 className="text-lg font-bold text-[#1c1917]">
                      {result.isFair ? "Fair Increase" : "Above Market Rate"}
                    </h3>
                  </div>
                  <p className="text-sm text-[#57534e] leading-relaxed">{result.recommendation}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
                    <div className="text-xs text-[#a8a29e] mb-1">Proposed Increase</div>
                    <div className={`text-xl font-bold ${result.proposedIncreasePercent > result.marketAvgIncrease ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
                      +{result.proposedIncreasePercent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-[#a8a29e]">{formatCurrency(result.proposedIncrease)}/mo</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
                    <div className="text-xs text-[#a8a29e] mb-1">Market Average</div>
                    <div className="text-xl font-bold text-[#c2410c]">+{result.marketAvgIncrease.toFixed(1)}%</div>
                    <div className="text-xs text-[#a8a29e]">for {selectedCity?.name}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
                    <div className="text-xs text-[#a8a29e] mb-1">Fair Range</div>
                    <div className="text-sm font-bold text-[#1c1917]">
                      {formatCurrency(result.fairRangeMin)} to {formatCurrency(result.fairRangeMax)}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
                    <div className="text-xs text-[#a8a29e] mb-1">Target Counter</div>
                    <div className="text-xl font-bold text-[#c2410c]">
                      {formatCurrency(result.estimatedNegotiatedRent)}
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-[#1c1917]">Negotiation Risk</h4>
                    <span className={`text-sm font-bold capitalize ${
                      result.riskAssessment === "low" ? "text-[#16a34a]" :
                      result.riskAssessment === "medium" ? "text-amber-500" : "text-[#dc2626]"
                    }`}>
                      {result.riskAssessment}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f5f3ef] overflow-hidden">
                    <div className={`h-full rounded-full ${
                      result.riskAssessment === "low" ? "bg-[#16a34a] w-1/3" :
                      result.riskAssessment === "medium" ? "bg-amber-400 w-2/3" : "bg-[#dc2626] w-full"
                    }`} />
                  </div>
                  <p className="text-xs text-[#a8a29e] mt-2">
                    {result.riskAssessment === "low"
                      ? "Low risk of losing your apartment if you negotiate."
                      : result.riskAssessment === "medium"
                      ? "Moderate competition in this market. Negotiate carefully."
                      : "High demand market. Be prepared with strong data if you negotiate."}
                  </p>
                </div>

                {/* Negotiation Points */}
                <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-5">
                  <h4 className="text-sm font-semibold text-[#1c1917] mb-3">Key Negotiation Points</h4>
                  <ul className="space-y-2">
                    {result.negotiationPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#c2410c] text-sm mt-0.5">&#8226;</span>
                        <span className="text-sm text-[#57534e] leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {!result.isFair && (
                  <Link href="/tools/negotiation-letter" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md w-full py-3 text-sm text-center inline-flex items-center justify-center gap-2">
                    Generate Negotiation Letter
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-8 text-center">
                <BarChart3 className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1c1917] mb-2">Analyze your renewal</h3>
                <p className="text-sm text-[#a8a29e]">Enter your current and proposed rent to see if the increase is fair.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
