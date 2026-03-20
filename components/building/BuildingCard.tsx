import Link from "next/link";
import { Building2, MapPin, Star, AlertTriangle } from "lucide-react";

interface BuildingCardProps {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  type: string;
  ratings: { overall: number; reviewCount: number };
  violations: { status: string }[];
  avgRent1Bed: number;
  amenities: string[];
}

export default function BuildingCard({
  id,
  name,
  address,
  neighborhood,
  type,
  ratings,
  violations,
  avgRent1Bed,
  amenities,
}: BuildingCardProps) {
  const openViolations = violations.filter((v) => v.status === "open").length;
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <Link href={`/building/${id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 transition-all overflow-hidden duration-300">
        {/* Header */}
        <div className="h-28 bg-gradient-to-br from-[#c2410c]/10 to-[#0d9488]/10 relative flex items-center justify-center">
          <Building2 className="w-10 h-10 text-[#a8a29e]/20" />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/80 border border-[#e2ddd5] text-[#a8a29e] capitalize">
              {type.replace("-", " ")}
            </span>
          </div>
          {openViolations > 0 && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-[#dc2626] border border-[#dc2626]/30">
                <AlertTriangle className="w-3 h-3" />
                {openViolations} open
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-[#1c1917] group-hover:text-[#c2410c] transition-colors truncate">
            {name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-[#a8a29e]">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{neighborhood}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-[#1c1917]">{ratings.overall.toFixed(1)}</span>
              <span className="text-xs text-[#a8a29e]">({ratings.reviewCount})</span>
            </div>
            <div className="text-sm font-bold text-[#c2410c]">
              {formatCurrency(avgRent1Bed)}<span className="text-xs text-[#a8a29e] font-normal">/mo</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {amenities.slice(0, 3).map((a) => (
              <span key={a} className="px-2 py-0.5 text-xs rounded-full bg-white border border-[#e2ddd5] text-[#a8a29e]">
                {a}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-white border border-[#e2ddd5] text-[#a8a29e]">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
