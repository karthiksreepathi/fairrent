import Link from "next/link";
import type { CityData } from "@/data/cities";
import { formatCurrency, formatPercentage } from "@/lib/rent-calculator";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

export default function CityCard({ city }: { city: CityData }) {
  const isDecline = city.yoyChange < 0;
  const isStable = city.yoyChange >= 0 && city.yoyChange < 2;

  const trendColor = isDecline
    ? "text-[#16a34a]"
    : isStable
      ? "text-[#d97706]"
      : "text-[#dc2626]";

  const trendBg = isDecline
    ? "bg-[#16a34a]/8"
    : isStable
      ? "bg-[#d97706]/8"
      : "bg-[#dc2626]/8";

  const TrendIcon = isDecline
    ? TrendingDown
    : isStable
      ? Minus
      : TrendingUp;

  return (
    <Link href={`/rent/${city.slug}`} className="group block">
      <div className="p-6 bg-white rounded-2xl border border-[#e2ddd5] hover:border-[#d4cfc7] hover:shadow-md transition-all duration-300">
        {/* City Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-[#1c1917] group-hover:text-[#c2410c] transition-colors">
              {city.name}
            </h3>
            <p className="text-sm text-[#a8a29e]">{city.state}</p>
          </div>
          <span
            className={`text-xs font-semibold ${trendColor} flex items-center gap-1 px-2.5 py-1 rounded-lg ${trendBg}`}
          >
            <TrendIcon className="w-3.5 h-3.5" />
            {formatPercentage(city.yoyChange)}
          </span>
        </div>

        {/* Rent Data */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="text-center p-2.5 bg-[#faf9f7] rounded-xl">
            <div className="text-xs text-[#a8a29e] mb-1">Studio</div>
            <div className="text-sm font-bold text-[#1c1917]">
              {formatCurrency(city.avgRentStudio)}
            </div>
          </div>
          <div className="text-center p-2.5 bg-[#c2410c]/5 rounded-xl border border-[#c2410c]/10">
            <div className="text-xs text-[#57534e] mb-1">1-Bed</div>
            <div className="text-sm font-bold text-[#c2410c]">
              {formatCurrency(city.avgRent1Bed)}
            </div>
          </div>
          <div className="text-center p-2.5 bg-[#faf9f7] rounded-xl">
            <div className="text-xs text-[#a8a29e] mb-1">2-Bed</div>
            <div className="text-sm font-bold text-[#1c1917]">
              {formatCurrency(city.avgRent2Bed)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs pt-3.5 border-t border-[#ede8e0]">
          <span className="text-[#a8a29e]">
            {city.renterPercentage}% renters
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#f5f3ef] text-[#57534e] font-medium">
            {city.vacancyRate}% vacancy
          </span>
          <span className="text-[#c2410c] font-medium inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
