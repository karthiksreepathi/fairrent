"use client";

import { useState, useMemo } from "react";
import { cities } from "@/data/cities";
import { Building2, Search, MapPin, Star, Filter } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import Link from "next/link";

interface Building {
  id: string;
  name: string;
  address: string;
  citySlug: string;
  neighborhood: string;
  type: string;
  ratings: { overall: number; reviewCount: number };
  violations: { status: string }[];
  avgRent1Bed: number;
  amenities: string[];
  units: number;
  stories: number;
  yearBuilt: number;
}

export default function BuildingsPage() {
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchBuildings = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (cityFilter) params.set("city", cityFilter);
      if (typeFilter) params.set("type", typeFilter);
      params.set("sort", sortBy);
      const res = await fetch(`/api/buildings?${params}`);
      const data = await res.json();
      setBuildings(data.buildings || []);
    } catch {
      setBuildings([]);
    }
    setLoading(false);
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#e2ddd5] text-xs font-medium text-[#c2410c] mb-4">
            <Building2 className="w-3.5 h-3.5" />
            BUILDING INTELLIGENCE
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-3">
            Building <span className="text-[#c2410c] font-bold">Directory</span>
          </h1>
          <p className="text-[#57534e]">
            Research buildings before you sign. View ratings, violations, rent history, and landlord information. All free.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 mb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">City</label>
              <CustomSelect
                value={cityFilter}
                onChange={setCityFilter}
                options={cities.map((c) => ({ value: c.slug, label: c.name }))}
                placeholder="All Cities"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Building Type</label>
              <CustomSelect
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { value: "high-rise", label: "High Rise" },
                  { value: "mid-rise", label: "Mid Rise" },
                  { value: "walk-up", label: "Walk Up" },
                  { value: "garden", label: "Garden" },
                  { value: "townhouse", label: "Townhouse" },
                  { value: "mixed-use", label: "Mixed Use" },
                ]}
                placeholder="All Types"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Sort By</label>
              <CustomSelect
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "rating", label: "Highest Rated" },
                  { value: "rent-low", label: "Lowest Rent" },
                  { value: "rent-high", label: "Highest Rent" },
                  { value: "newest", label: "Newest Built" },
                ]}
                placeholder="Sort by..."
              />
            </div>
            <div className="flex items-end">
              <button
                className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md w-full py-2.5 text-sm flex items-center justify-center gap-2"
                onClick={searchBuildings}
                disabled={loading}
              >
                <Search className="w-4 h-4" />
                {loading ? "Searching..." : "Search Buildings"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div>
            {buildings.length > 0 ? (
              <>
                <p className="text-sm text-[#a8a29e] mb-4">{buildings.length} buildings found</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buildings.map((b) => {
                    const openViolations = b.violations.filter((v) => v.status === "open").length;
                    return (
                      <Link key={b.id} href={`/building/${b.id}`} className="group block">
                        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 overflow-hidden transition-all duration-300">
                          <div className="h-28 bg-gradient-to-br from-[#f5f3ef] to-teal-50 relative flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-[#a8a29e]/20" />
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/80 border border-[#e2ddd5] text-[#a8a29e] capitalize">
                                {b.type.replace("-", " ")}
                              </span>
                            </div>
                            {openViolations > 0 && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold rounded-full bg-red-50 text-[#dc2626] border border-[#dc2626]/30">
                                {openViolations} violations
                              </span>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="text-base font-semibold text-[#1c1917] group-hover:text-[#c2410c] transition-colors truncate">
                              {b.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-xs text-[#a8a29e]">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{b.neighborhood}</span>
                              <span className="mx-1">·</span>
                              <span>{b.units} units</span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-medium text-[#1c1917]">{b.ratings.overall.toFixed(1)}</span>
                                <span className="text-xs text-[#a8a29e]">({b.ratings.reviewCount})</span>
                              </div>
                              <div className="text-sm font-bold text-[#c2410c]">
                                {formatCurrency(b.avgRent1Bed)}<span className="text-xs text-[#a8a29e] font-normal">/mo</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {b.amenities.slice(0, 3).map((a) => (
                                <span key={a} className="px-2 py-0.5 text-xs rounded-full bg-[#f5f3ef] border border-[#e2ddd5] text-[#a8a29e]">
                                  {a}
                                </span>
                              ))}
                              {b.amenities.length > 3 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-[#f5f3ef] border border-[#e2ddd5] text-[#a8a29e]">
                                  +{b.amenities.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-12 text-center">
                <Building2 className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1c1917] mb-2">No buildings found</h3>
                <p className="text-sm text-[#a8a29e]">Try adjusting your filters or selecting a different city.</p>
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-12 text-center">
            <Building2 className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1c1917] mb-2">Search for buildings</h3>
            <p className="text-sm text-[#a8a29e]">
              Select a city and click search to explore buildings, ratings, and violation history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
