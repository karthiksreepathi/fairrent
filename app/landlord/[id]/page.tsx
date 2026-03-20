"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { User, ArrowLeft, Building2, TrendingUp, Scale, Star, AlertTriangle, MapPin } from "lucide-react";
import RatingDisplay from "@/components/building/RatingDisplay";

interface LandlordData {
  id: string;
  name: string;
  type: string;
  portfolioSize: number;
  cities: string[];
  avgRentIncrease: number;
  ratings: {
    overall: number;
    responsiveness: number;
    fairness: number;
    maintenance: number;
    reviewCount: number;
  };
  legalIssues: number;
  founded: number;
  managementStyle: string;
  description: string;
}

interface LandlordBuilding {
  id: string;
  name: string;
  address: string;
  citySlug: string;
  neighborhood: string;
  units: number;
  ratings: { overall: number };
  avgRent1Bed: number;
}

export default function LandlordPage() {
  const params = useParams();
  const id = params.id as string;
  const [landlord, setLandlord] = useState<LandlordData | null>(null);
  const [buildings, setBuildings] = useState<LandlordBuilding[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/landlord/${id}`);
        const data = await res.json();
        setLandlord(data.landlord || null);
        setBuildings(data.buildings || []);
      } catch {
        setLandlord(null);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#faf9f7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c2410c]/30 border-t-[#c2410c] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#a8a29e]">Loading landlord data...</p>
        </div>
      </div>
    );
  }

  if (!landlord) {
    return (
      <div className="bg-[#faf9f7] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-12 text-center max-w-md">
          <User className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#1c1917] mb-2">Landlord Not Found</h2>
          <p className="text-sm text-[#a8a29e] mb-6">
            The landlord profile you are looking for could not be found.
          </p>
          <Link href="/buildings" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md px-6 py-2.5 text-sm inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Buildings
          </Link>
        </div>
      </div>
    );
  }

  const ratingBreakdown = [
    { label: "Responsiveness", value: landlord.ratings.responsiveness },
    { label: "Fairness", value: landlord.ratings.fairness },
    { label: "Maintenance", value: landlord.ratings.maintenance },
  ];

  const getRentIncreaseColor = (rate: number) => {
    if (rate <= 2) return "text-[#16a34a]";
    if (rate <= 4) return "text-amber-400";
    return "text-[#dc2626]";
  };

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/buildings" className="inline-flex items-center gap-1.5 text-sm text-[#a8a29e] hover:text-[#c2410c] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            All Buildings
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#f5f3ef] text-[#c2410c] border border-[#c2410c]/30 capitalize">
                  {landlord.type}
                </span>
                <span className="text-xs text-[#a8a29e]">Since {landlord.founded}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1917]">{landlord.name}</h1>
              <p className="text-sm text-[#57534e] mt-1 max-w-xl">{landlord.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-3 text-center">
                <div className="text-xs text-[#a8a29e]">Rating</div>
                <div className="flex items-center gap-1 justify-center mt-0.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-lg font-bold text-[#1c1917]">{landlord.ratings.overall.toFixed(1)}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-3 text-center">
                <div className="text-xs text-[#a8a29e]">Properties</div>
                <div className="text-lg font-bold text-[#1c1917]">{landlord.portfolioSize}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ratings */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h2 className="text-lg font-semibold text-[#1c1917] mb-4">Tenant Ratings</h2>
              <RatingDisplay
                overall={landlord.ratings.overall}
                breakdown={ratingBreakdown}
                reviewCount={landlord.ratings.reviewCount}
                size="lg"
              />
            </div>

            {/* Portfolio / Buildings */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h2 className="text-lg font-semibold text-[#1c1917] mb-4">
                Property Portfolio
                <span className="text-sm font-normal text-[#a8a29e] ml-2">
                  ({buildings.length} buildings)
                </span>
              </h2>

              {buildings.length > 0 ? (
                <div className="space-y-3">
                  {buildings.map((b) => (
                    <Link key={b.id} href={`/building/${b.id}`} className="block group">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white hover:bg-[#f5f3ef] border border-[#e2ddd5]/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-[#f5f3ef] flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-[#c2410c]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#1c1917] group-hover:text-[#c2410c] transition-colors truncate">
                            {b.name}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-[#a8a29e]">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{b.neighborhood}</span>
                            <span className="mx-1">·</span>
                            <span>{b.units} units</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-medium text-[#1c1917]">{b.ratings.overall.toFixed(1)}</span>
                          </div>
                          <div className="text-sm font-bold text-[#c2410c] mt-0.5">
                            {formatCurrency(b.avgRent1Bed)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#a8a29e]">No building data available for this landlord.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h3 className="text-base font-semibold text-[#1c1917] mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2 text-sm text-[#a8a29e]">
                      <TrendingUp className="w-4 h-4" />
                      Avg Rent Increase
                    </span>
                    <span className={`text-sm font-bold ${getRentIncreaseColor(landlord.avgRentIncrease)}`}>
                      {landlord.avgRentIncrease}%/yr
                    </span>
                  </div>
                  <div className="h-2 bg-[#f5f3ef] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        landlord.avgRentIncrease <= 2 ? "bg-[#16a34a]" :
                        landlord.avgRentIncrease <= 4 ? "bg-amber-400" : "bg-[#dc2626]"
                      }`}
                      style={{ width: `${Math.min(100, (landlord.avgRentIncrease / 10) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-[#a8a29e]">
                    <Scale className="w-4 h-4" />
                    Legal Issues
                  </span>
                  <span className={`text-sm font-bold ${landlord.legalIssues === 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                    {landlord.legalIssues}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#a8a29e]">Management Style</span>
                  <span className="text-sm font-medium text-[#1c1917] capitalize">{landlord.managementStyle}</span>
                </div>
              </div>
            </div>

            {/* Cities */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h3 className="text-base font-semibold text-[#1c1917] mb-3">Active Markets</h3>
              <div className="flex flex-wrap gap-2">
                {landlord.cities.map((c) => (
                  <span key={c} className="px-3 py-1 text-xs rounded-full bg-[#f5f3ef] border border-[#e2ddd5] text-[#a8a29e] capitalize">
                    {c.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Warning if high increase */}
            {landlord.avgRentIncrease > 5 && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 border-l-4 border-l-[#dc2626]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#dc2626] mb-1">High Rent Increases</h4>
                    <p className="text-xs text-[#a8a29e] leading-relaxed">
                      This landlord has historically raised rents above the market average. Consider negotiating a longer lease term with a cap on annual increases.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#0d9488]/20 p-6 text-center">
              <h3 className="text-base font-semibold text-[#1c1917] mb-2">Need to Negotiate?</h3>
              <p className="text-xs text-[#a8a29e] mb-4">
                Use market data and comparables to build your case.
              </p>
              <Link href="/tools/negotiation-letter" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md w-full py-2.5 text-sm inline-flex items-center justify-center gap-2">
                Generate Letter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
