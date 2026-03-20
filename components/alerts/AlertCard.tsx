"use client";

import { Trash2, MapPin, DollarSign, BedDouble, Mail } from "lucide-react";

export interface AlertData {
  id: string;
  citySlug: string;
  cityName: string;
  maxRent: number;
  bedrooms: number;
  alertTypes: string[];
  email: string;
  createdAt: string;
  active: boolean;
}

interface AlertCardProps {
  alert: AlertData;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AlertCard({ alert, onToggle, onDelete }: AlertCardProps) {
  const bedroomLabel =
    alert.bedrooms === 0
      ? "Studio"
      : alert.bedrooms === 1
        ? "1 BR"
        : alert.bedrooms === 2
          ? "2 BR"
          : "3 BR";

  const formattedDate = new Date(alert.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-2xl p-5 transition-all duration-300 border ${
        alert.active
          ? "border-[#c2410c]/20 hover:border-[#c2410c]/40"
          : "border-[#e2ddd5]/50 opacity-60"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Active indicator dot */}
          <button
            type="button"
            onClick={() => onToggle?.(alert.id)}
            className="group flex-shrink-0"
            title={alert.active ? "Pause alert" : "Activate alert"}
          >
            <span
              className={`block w-3 h-3 rounded-full transition-all ${
                alert.active
                  ? "bg-[#16a34a] shadow-lg shadow-[#16a34a]/40"
                  : "bg-[#a8a29e]/40"
              } group-hover:scale-125`}
            />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c2410c]" />
              <h3 className="font-semibold text-[#1c1917] text-sm">
                {alert.cityName}
              </h3>
            </div>
            <p className="text-xs text-[#a8a29e] mt-0.5">
              Created {formattedDate}
            </p>
          </div>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete?.(alert.id)}
          className="p-1.5 rounded-lg text-[#a8a29e] hover:text-[#dc2626] hover:bg-red-50 transition-all"
          title="Delete alert"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Details row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-[#57534e]">
          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          <span>Max ${alert.maxRent.toLocaleString()}/mo</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#57534e]">
          <BedDouble className="w-3.5 h-3.5 text-[#c2410c]" />
          <span>{bedroomLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#57534e]">
          <Mail className="w-3.5 h-3.5 text-[#a8a29e]" />
          <span className="truncate max-w-[140px]">{alert.email}</span>
        </div>
      </div>

      {/* Alert type badges */}
      <div className="flex flex-wrap gap-1.5">
        {alert.alertTypes.map((type) => (
          <span
            key={type}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
              type === "Price Drop"
                ? "bg-green-50 text-[#16a34a] border-[#16a34a]/20"
                : type === "New Listing"
                  ? "bg-[#f5f3ef] text-[#c2410c] border-[#c2410c]/20"
                  : "bg-amber-50 text-amber-400 border-amber-500/20"
            }`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
