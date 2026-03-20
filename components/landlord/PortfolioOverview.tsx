import Link from "next/link";
import { Building2, MapPin, Star } from "lucide-react";

interface PortfolioBuilding {
  id: string;
  name: string;
  address: string;
  citySlug: string;
  neighborhood: string;
  units: number;
  ratings: { overall: number };
  avgRent1Bed: number;
}

interface PortfolioOverviewProps {
  buildings: PortfolioBuilding[];
  totalProperties: number;
  cities: string[];
}

export default function PortfolioOverview({
  buildings,
  totalProperties,
  cities,
}: PortfolioOverviewProps) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const totalUnits = buildings.reduce((sum, b) => sum + b.units, 0);
  const avgRating =
    buildings.length > 0
      ? (buildings.reduce((sum, b) => sum + b.ratings.overall, 0) / buildings.length).toFixed(1)
      : "N/A";

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-4 text-center">
          <div className="text-xs text-[#a8a29e] mb-1">Properties</div>
          <div className="text-xl font-bold text-[#1c1917]">{totalProperties}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-4 text-center">
          <div className="text-xs text-[#a8a29e] mb-1">Total Units</div>
          <div className="text-xl font-bold text-[#1c1917]">{totalUnits}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-4 text-center">
          <div className="text-xs text-[#a8a29e] mb-1">Avg Rating</div>
          <div className="text-xl font-bold text-[#c2410c]">{avgRating}</div>
        </div>
      </div>

      {/* Cities */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cities.map((c) => (
          <span key={c} className="px-3 py-1 text-xs rounded-full bg-white border border-[#e2ddd5] text-[#a8a29e] capitalize">
            {c.replace(/-/g, " ")}
          </span>
        ))}
      </div>

      {/* Building List */}
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
    </div>
  );
}
