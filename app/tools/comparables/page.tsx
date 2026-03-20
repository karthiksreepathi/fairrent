"use client";

import { useState, useEffect } from "react";
import { cities } from "@/data/cities";
import { Search, MapPin, Bed, Square, Filter, ChevronRight } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { formatCurrency } from "@/lib/rent-calculator";
import Link from "next/link";

interface Listing {
  id: string;
  address: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  amenities: string[];
  available: boolean;
  noFee: boolean;
  renovated: boolean;
  floorLevel: string;
}

export default function ComparablesPage() {
  const [citySlug, setCitySlug] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [maxRent, setMaxRent] = useState("");
  const [noFeeOnly, setNoFeeOnly] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [stats, setStats] = useState<{ avg: number; median: number; lowest: number; count: number } | null>(null);

  const searchComparables = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({
        city: citySlug,
        bedrooms,
        ...(maxRent && { maxRent }),
        ...(noFeeOnly && { noFee: "true" }),
      });
      const res = await fetch(`/api/comparables?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setStats(data.stats || null);
    } catch {
      setListings([]);
      setStats(null);
    }
    setLoading(false);
  };

  const selectedCity = cities.find((c) => c.slug === citySlug);

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#e2ddd5] text-xs font-medium text-[#c2410c] mb-4">
            <Search className="w-3.5 h-3.5" />
            COMPARABLE FINDER
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-3">
            Find <span className="text-[#c2410c] font-bold">Comparable Units</span>
          </h1>
          <p className="text-[#57534e]">
            Discover similar apartments at lower prices to build your negotiation case. Completely free.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 mb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">City</label>
              <CustomSelect
                value={citySlug}
                onChange={setCitySlug}
                options={cities.map((city) => ({ value: city.slug, label: city.name }))}
                placeholder="Select city"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Bedrooms</label>
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
              <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Max Rent</label>
              <input type="number" className="input-dark w-full px-3 py-2.5 text-sm" placeholder="Any" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={noFeeOnly} onChange={(e) => setNoFeeOnly(e.target.checked)} className="w-4 h-4 rounded border-[#e2ddd5] bg-white text-[#c2410c]" />
                <span className="text-sm text-[#57534e]">No Fee Only</span>
              </label>
            </div>
            <div className="flex items-end">
              <button
                className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md w-full py-2.5 text-sm flex items-center justify-center gap-2"
                onClick={searchComparables}
                disabled={!citySlug || loading}
              >
                <Search className="w-4 h-4" />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">Listings Found</div>
              <div className="text-xl font-bold text-[#c2410c]">{stats.count}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">Average Rent</div>
              <div className="text-xl font-bold text-[#1c1917]">{formatCurrency(stats.avg)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">Median Rent</div>
              <div className="text-xl font-bold text-[#c2410c]">{formatCurrency(stats.median)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">Lowest Rent</div>
              <div className="text-xl font-bold text-[#16a34a]">{formatCurrency(stats.lowest)}</div>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {searched && (
          <div>
            {listings.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 overflow-hidden transition-all duration-300">
                    {/* Image placeholder */}
                    <div className="h-36 bg-gradient-to-br from-[#f5f3ef] to-teal-50 relative flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-[#a8a29e]/30" />
                      {listing.noFee && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold rounded-full bg-green-50 text-[#16a34a] border border-[#16a34a]/30">
                          NO FEE
                        </span>
                      )}
                      {listing.renovated && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold rounded-full bg-[#f5f3ef] text-[#c2410c] border border-[#c2410c]/30">
                          RENOVATED
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-xl font-bold text-[#c2410c] mb-1">
                        {formatCurrency(listing.rent)}<span className="text-sm text-[#a8a29e] font-normal">/mo</span>
                      </div>
                      <p className="text-sm text-[#57534e] mb-3 truncate">{listing.address}</p>
                      <div className="flex items-center gap-4 text-xs text-[#a8a29e] mb-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bed`}
                        </span>
                        <span>{listing.bathrooms} Bath</span>
                        <span className="flex items-center gap-1">
                          <Square className="w-3.5 h-3.5" />
                          {listing.sqft} sqft
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {listing.amenities.slice(0, 3).map((a) => (
                          <span key={a} className="px-2 py-0.5 text-xs rounded-full bg-[#f5f3ef] border border-[#e2ddd5] text-[#a8a29e]">
                            {a}
                          </span>
                        ))}
                        {listing.amenities.length > 3 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-[#f5f3ef] border border-[#e2ddd5] text-[#a8a29e]">
                            +{listing.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-12 text-center">
                <Search className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1c1917] mb-2">No listings found</h3>
                <p className="text-sm text-[#a8a29e]">Try adjusting your filters or selecting a different city.</p>
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-12 text-center">
            <Search className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1c1917] mb-2">Search for comparable units</h3>
            <p className="text-sm text-[#a8a29e]">Select a city and bedroom count to find similar apartments at competitive prices.</p>
          </div>
        )}
      </div>
    </div>
  );
}
