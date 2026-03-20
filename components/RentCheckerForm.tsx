"use client";

import { useState } from "react";
import { cities, getCityBySlug } from "@/data/cities";
import { formatCurrency, formatPercentage, getMarketCondition, calculateRentToIncome } from "@/lib/rent-calculator";
import ScoreCard from "@/components/score/ScoreCard";
import CustomSelect from "@/components/ui/CustomSelect";
import { Search, Loader2, ChevronDown, Building2, Ruler, Layers, Calendar } from "lucide-react";

interface FairnessResult {
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
}

const amenityOptions = [
  "Doorman",
  "Elevator",
  "Gym",
  "Pool",
  "Rooftop",
  "Parking",
  "In-Unit Laundry",
  "Laundry",
  "Dishwasher",
  "Central Air",
  "Balcony",
  "Concierge",
  "Storage",
  "Pet-Friendly",
  "Hardwood Floors",
];

const cityOptions = cities.map((c) => ({
  value: c.slug,
  label: `${c.name}, ${c.stateCode}`,
}));

const floorOptions = [
  { value: "low", label: "Low (1-3)" },
  { value: "mid", label: "Mid (4-10)" },
  { value: "high", label: "High (11+)" },
  { value: "penthouse", label: "Penthouse" },
];

export default function RentCheckerForm() {
  const [selectedCity, setSelectedCity] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [currentRent, setCurrentRent] = useState("");
  const [income, setIncome] = useState("");
  const [sqft, setSqft] = useState("");
  const [floorLevel, setFloorLevel] = useState("");
  const [buildingAge, setBuildingAge] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [neighborhood, setNeighborhood] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FairnessResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const city = getCityBySlug(selectedCity);
  const market = city ? getMarketCondition(city.yoyChange, city.vacancyRate) : null;

  const getAvgRent = () => {
    if (!city) return 0;
    switch (bedrooms) {
      case 0: return city.avgRentStudio;
      case 1: return city.avgRent1Bed;
      case 2: return city.avgRent2Bed;
      case 3: return city.avgRent3Bed;
      default: return city.avgRent1Bed;
    }
  };

  const avgRent = getAvgRent();
  const rentRatio = income && currentRent ? calculateRentToIncome(Number(currentRent), Number(income)) : null;

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const neighborhoodOptions = city
    ? city.neighborhoods.map((n) => ({ value: n.name, label: n.name }))
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !currentRent) return;

    setLoading(true);
    setShowResults(true);

    try {
      const res = await fetch("/api/fairness-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citySlug: selectedCity,
          currentRent: Number(currentRent),
          bedrooms,
          sqft: sqft ? Number(sqft) : undefined,
          floorLevel: floorLevel || undefined,
          amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
          buildingAge: buildingAge ? Number(buildingAge) : undefined,
          neighborhood: neighborhood || undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: City + Bedrooms */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#57534e] mb-2 uppercase tracking-wide">City</label>
            <CustomSelect
              value={selectedCity}
              onChange={(val) => {
                setSelectedCity(val);
                setShowResults(false);
                setResult(null);
                setNeighborhood("");
              }}
              options={cityOptions}
              placeholder="Select a city..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534e] mb-2 uppercase tracking-wide">Bedrooms</label>
            <div className="flex gap-2">
              {[
                { value: 0, label: "Studio" },
                { value: 1, label: "1 Bed" },
                { value: 2, label: "2 Bed" },
                { value: 3, label: "3 Bed" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setBedrooms(value);
                    setShowResults(false);
                    setResult(null);
                  }}
                  className={`flex-1 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                    bedrooms === value
                      ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm"
                      : "bg-white text-[#57534e] border-[#e2ddd5] hover:border-[#d4cfc7]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Current Rent + Income */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#57534e] mb-2 uppercase tracking-wide">
              Your Current Rent
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] text-sm font-medium">$</span>
              <input
                type="number"
                value={currentRent}
                onChange={(e) => {
                  setCurrentRent(e.target.value);
                  setShowResults(false);
                  setResult(null);
                }}
                placeholder="e.g., 2500"
                required
                className="bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/10 w-full pl-7 pr-4 py-3 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534e] mb-2 uppercase tracking-wide">
              Annual Income <span className="text-[#a8a29e] normal-case font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] text-sm font-medium">$</span>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g., 75000"
                className="bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/10 w-full pl-7 pr-4 py-3 text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-[#57534e] hover:text-[#1c1917] transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          {showAdvanced ? "Hide" : "Show"} Advanced Options
          <span className="text-xs text-[#a8a29e]">(more accurate results)</span>
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 animate-fade-in bg-[#faf9f7] rounded-xl p-5 border border-[#ede8e0]">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#57534e] mb-2 uppercase tracking-wide">
                  <Ruler className="w-3.5 h-3.5" /> Sq Ft
                </label>
                <input
                  type="number"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  placeholder="e.g., 750"
                  className="bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/10 w-full px-3 py-2.5 text-sm transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#57534e] mb-2 uppercase tracking-wide">
                  <Layers className="w-3.5 h-3.5" /> Floor Level
                </label>
                <CustomSelect
                  value={floorLevel}
                  onChange={setFloorLevel}
                  options={floorOptions}
                  placeholder="Select..."
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#57534e] mb-2 uppercase tracking-wide">
                  <Calendar className="w-3.5 h-3.5" /> Building Age
                </label>
                <input
                  type="number"
                  value={buildingAge}
                  onChange={(e) => setBuildingAge(e.target.value)}
                  placeholder="e.g., 25 years"
                  className="bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/10 w-full px-3 py-2.5 text-sm transition-all"
                />
              </div>
            </div>

            {/* Neighborhood */}
            {city && city.neighborhoods.length > 0 && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#57534e] mb-2 uppercase tracking-wide">
                  <Building2 className="w-3.5 h-3.5" /> Neighborhood
                </label>
                <CustomSelect
                  value={neighborhood}
                  onChange={setNeighborhood}
                  options={neighborhoodOptions}
                  placeholder="Any neighborhood"
                />
              </div>
            )}

            {/* Amenities */}
            <div>
              <label className="block text-xs font-semibold text-[#57534e] mb-2.5 uppercase tracking-wide">
                Building Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                      selectedAmenities.includes(amenity)
                        ? "bg-[#1c1917] text-white border-[#1c1917]"
                        : "bg-white text-[#57534e] border-[#e2ddd5] hover:border-[#d4cfc7]"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!selectedCity || !currentRent || loading}
          className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-premium text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Your Rent...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Analyze My Rent
            </>
          )}
        </button>
      </form>

      {/* Results */}
      {showResults && city && (
        <div className="mt-8 space-y-6">
          {/* Market Overview */}
          <div className="bg-white rounded-2xl border border-[#e2ddd5] shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#1c1917] mb-4">
              Market Overview: {city.name}, {city.stateCode}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="bg-[#faf9f7] rounded-xl p-3 text-center border border-[#ede8e0]">
                <div className="text-xs text-[#a8a29e] mb-1">
                  Avg Rent ({bedrooms === 0 ? "Studio" : `${bedrooms}-Bed`})
                </div>
                <div className="text-lg font-bold text-[#c2410c]">{formatCurrency(avgRent)}</div>
              </div>
              <div className="bg-[#faf9f7] rounded-xl p-3 text-center border border-[#ede8e0]">
                <div className="text-xs text-[#a8a29e] mb-1">Year-over-Year</div>
                <div className={`text-lg font-bold ${city.yoyChange < 0 ? "text-[#16a34a]" : city.yoyChange < 3 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
                  {formatPercentage(city.yoyChange)}
                </div>
              </div>
              <div className="bg-[#faf9f7] rounded-xl p-3 text-center border border-[#ede8e0]">
                <div className="text-xs text-[#a8a29e] mb-1">Vacancy Rate</div>
                <div className="text-lg font-bold text-[#1c1917]">{city.vacancyRate}%</div>
              </div>
              <div className="bg-[#faf9f7] rounded-xl p-3 text-center border border-[#ede8e0]">
                <div className="text-xs text-[#a8a29e] mb-1">Median Income</div>
                <div className="text-lg font-bold text-[#1c1917]">{formatCurrency(city.medianIncome)}</div>
              </div>
            </div>

            {market && (
              <div className={`p-3 rounded-xl border ${
                market.color === "text-green-600" ? "border-[#16a34a]/20 bg-[#16a34a]/5" :
                market.color === "text-yellow-600" ? "border-[#d97706]/20 bg-[#d97706]/5" :
                "border-[#dc2626]/20 bg-[#dc2626]/5"
              }`}>
                <div className={`text-sm font-bold mb-0.5 ${
                  market.color === "text-green-600" ? "text-[#16a34a]" :
                  market.color === "text-yellow-600" ? "text-[#d97706]" :
                  "text-[#dc2626]"
                }`}>
                  {market.condition}
                </div>
                <p className="text-xs text-[#57534e]">{market.description}</p>
              </div>
            )}

            {rentRatio !== null && (
              <div className="mt-3 p-3 rounded-xl bg-[#faf9f7] border border-[#ede8e0]">
                <span className="text-xs text-[#57534e]">
                  Rent-to-income ratio:{" "}
                  <strong className={rentRatio > 30 ? "text-[#dc2626]" : "text-[#16a34a]"}>
                    {rentRatio.toFixed(1)}%
                  </strong>
                  {rentRatio > 30
                    ? " (above the recommended 30% guideline)"
                    : " (within the recommended 30% guideline)"}
                </span>
              </div>
            )}
          </div>

          {/* Deep Fairness Score */}
          {loading && (
            <div className="bg-white rounded-2xl border border-[#e2ddd5] shadow-sm p-12 text-center">
              <Loader2 className="w-10 h-10 text-[#c2410c] animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#a8a29e]">
                Running deep analysis across 6 factors...
              </p>
            </div>
          )}

          {result && !loading && (
            <ScoreCard
              result={result}
              currentRent={Number(currentRent)}
              citySlug={selectedCity}
              bedrooms={bedrooms}
            />
          )}

          {/* Neighborhood Breakdown */}
          <div className="bg-white rounded-2xl border border-[#e2ddd5] shadow-sm p-6">
            <h4 className="text-base font-semibold text-[#1c1917] mb-4">Neighborhood Breakdown</h4>
            <div className="space-y-2">
              {city.neighborhoods.map((n) => {
                const nRent =
                  bedrooms === 0
                    ? Math.round(n.avgRent1Bed * 0.8)
                    : bedrooms === 1
                      ? n.avgRent1Bed
                      : bedrooms === 2
                        ? n.avgRent2Bed
                        : n.avgRent3Bed;
                const isAbove = currentRent && Number(currentRent) > nRent;
                return (
                  <div
                    key={n.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#faf9f7] transition-colors border border-[#ede8e0]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#1c1917]">{n.name}</div>
                      <div className="text-xs text-[#a8a29e] truncate">
                        Walk Score: {n.walkScore} · Safety: {n.safetyRating}/10
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`font-bold text-sm ${isAbove ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
                        {formatCurrency(nRent)}
                      </div>
                      <div className="text-xs text-[#a8a29e]">/month</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-[#e2ddd5] shadow-sm p-6">
            <h4 className="text-base font-semibold text-[#1c1917] mb-3">
              Tips for Renting in {city.name}
            </h4>
            <ul className="space-y-2">
              {city.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#f5f3ef] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#c2410c]">{i + 1}</span>
                  </div>
                  <span className="text-sm text-[#57534e] leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
