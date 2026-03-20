"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Calendar, Layers, Users, Star, ArrowLeft, ExternalLink } from "lucide-react";
import RatingDisplay from "@/components/building/RatingDisplay";
import ViolationTimeline from "@/components/building/ViolationTimeline";
import AmenityGrid from "@/components/building/AmenityGrid";

interface BuildingData {
  id: string;
  name: string;
  address: string;
  citySlug: string;
  neighborhood: string;
  yearBuilt: number;
  units: number;
  stories: number;
  type: string;
  amenities: string[];
  landlordId: string;
  ratings: {
    overall: number;
    maintenance: number;
    management: number;
    noise: number;
    amenities: number;
    valueForMoney: number;
    reviewCount: number;
  };
  violations: {
    date: string;
    type: string;
    description: string;
    status: "open" | "resolved" | "pending";
    severity: "minor" | "moderate" | "major" | "critical";
  }[];
  managementCompany: string;
  avgRent1Bed: number;
  avgRent2Bed: number;
  petPolicy: string;
  laundry: string;
  parking: boolean;
  yearRenovated?: number;
}

interface LandlordInfo {
  id: string;
  name: string;
  type: string;
  avgRentIncrease: number;
  ratings: { overall: number };
}

export default function BuildingPage() {
  const params = useParams();
  const id = params.id as string;
  const [building, setBuilding] = useState<BuildingData | null>(null);
  const [landlord, setLandlord] = useState<LandlordInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/building/${id}`);
        const data = await res.json();
        setBuilding(data.building || null);
        setLandlord(data.landlord || null);
      } catch {
        setBuilding(null);
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
          <p className="text-sm text-[#a8a29e]">Loading building data...</p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="bg-[#faf9f7] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-12 text-center max-w-md">
          <Building2 className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#1c1917] mb-2">Building Not Found</h2>
          <p className="text-sm text-[#a8a29e] mb-6">
            The building you are looking for could not be found.
          </p>
          <Link href="/buildings" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md px-6 py-2.5 text-sm inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Buildings
          </Link>
        </div>
      </div>
    );
  }

  const openViolations = building.violations.filter((v) => v.status === "open").length;
  const ratingBreakdown = [
    { label: "Maintenance", value: building.ratings.maintenance },
    { label: "Management", value: building.ratings.management },
    { label: "Noise Level", value: building.ratings.noise },
    { label: "Amenities", value: building.ratings.amenities },
    { label: "Value for Money", value: building.ratings.valueForMoney },
  ];

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
                  {building.type.replace("-", " ")}
                </span>
                {openViolations > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-50 text-[#dc2626] border border-[#dc2626]/30">
                    {openViolations} open violations
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1917]">{building.name}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-[#a8a29e]">
                <MapPin className="w-4 h-4" />
                {building.address} · {building.neighborhood}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-3 text-center">
                <div className="text-xs text-[#a8a29e]">1-Bed</div>
                <div className="text-lg font-bold text-[#c2410c]">{formatCurrency(building.avgRent1Bed)}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-3 text-center">
                <div className="text-xs text-[#a8a29e]">2-Bed</div>
                <div className="text-lg font-bold text-[#c2410c]">{formatCurrency(building.avgRent2Bed)}</div>
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
                overall={building.ratings.overall}
                breakdown={ratingBreakdown}
                reviewCount={building.ratings.reviewCount}
                size="lg"
              />
            </div>

            {/* Violations */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h2 className="text-lg font-semibold text-[#1c1917] mb-4">
                Violation History
                {building.violations.length > 0 && (
                  <span className="text-sm font-normal text-[#a8a29e] ml-2">
                    ({building.violations.length} total)
                  </span>
                )}
              </h2>
              <ViolationTimeline violations={building.violations} />
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h2 className="text-lg font-semibold text-[#1c1917] mb-4">Amenities</h2>
              <AmenityGrid amenities={building.amenities} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h3 className="text-base font-semibold text-[#1c1917] mb-4">Building Details</h3>
              <div className="space-y-3">
                {[
                  { icon: Calendar, label: "Year Built", value: building.yearBuilt.toString() },
                  { icon: Layers, label: "Stories", value: building.stories.toString() },
                  { icon: Users, label: "Units", value: building.units.toString() },
                  { icon: Building2, label: "Laundry", value: building.laundry === "in-unit" ? "In-Unit" : building.laundry === "in-building" ? "In-Building" : "None" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-[#a8a29e]">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                    <span className="text-sm font-medium text-[#1c1917]">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#a8a29e]">Parking</span>
                  <span className={`text-sm font-medium ${building.parking ? "text-[#16a34a]" : "text-[#a8a29e]"}`}>
                    {building.parking ? "Available" : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#a8a29e]">Pet Policy</span>
                  <span className="text-sm font-medium text-[#1c1917]">{building.petPolicy}</span>
                </div>
                {building.yearRenovated && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#a8a29e]">Renovated</span>
                    <span className="text-sm font-medium text-[#1c1917]">{building.yearRenovated}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Landlord */}
            {landlord && (
              <Link href={`/landlord/${landlord.id}`} className="block group">
                <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 p-6">
                  <h3 className="text-base font-semibold text-[#1c1917] mb-3">Landlord Info</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#1c1917] group-hover:text-[#c2410c] transition-colors font-medium">
                        {landlord.name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-[#a8a29e] group-hover:text-[#c2410c] transition-colors" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#a8a29e]">
                      <span>Type</span>
                      <span className="capitalize">{landlord.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#a8a29e]">
                      <span>Avg Rent Increase</span>
                      <span className={landlord.avgRentIncrease > 4 ? "text-[#dc2626]" : "text-[#16a34a]"}>
                        {landlord.avgRentIncrease}%/yr
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-medium text-[#1c1917]">
                        {landlord.ratings.overall.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#c2410c] mt-3 font-medium">View landlord profile</p>
                </div>
              </Link>
            )}

            {/* Management */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h3 className="text-base font-semibold text-[#1c1917] mb-2">Management</h3>
              <p className="text-sm text-[#a8a29e]">{building.managementCompany}</p>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#0d9488]/20 p-6 text-center">
              <h3 className="text-base font-semibold text-[#1c1917] mb-2">Check Your Rent</h3>
              <p className="text-xs text-[#a8a29e] mb-4">
                See how your rent compares to this building and the local market.
              </p>
              <Link href="/rent-checker" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md w-full py-2.5 text-sm inline-flex items-center justify-center gap-2">
                Analyze My Rent
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
