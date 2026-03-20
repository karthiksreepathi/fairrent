import {
  Dumbbell,
  Waves,
  Car,
  ShieldCheck,
  Wifi,
  Dog,
  WashingMachine,
  Snowflake,
  Wind,
  Trees,
  Package,
  Bike,
  Gamepad2,
  Coffee,
  Building2,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AmenityGridProps {
  amenities: string[];
}

const amenityIcons: Record<string, LucideIcon> = {
  gym: Dumbbell,
  pool: Waves,
  parking: Car,
  doorman: ShieldCheck,
  wifi: Wifi,
  "pet-friendly": Dog,
  laundry: WashingMachine,
  "in-unit laundry": WashingMachine,
  "central air": Snowflake,
  "central-air": Snowflake,
  rooftop: Wind,
  garden: Trees,
  storage: Package,
  "bike room": Bike,
  "bike-room": Bike,
  "game room": Gamepad2,
  lounge: Coffee,
  elevator: Building2,
  concierge: ShieldCheck,
  dishwasher: Sparkles,
  balcony: Wind,
};

function getIcon(amenity: string): LucideIcon {
  const key = amenity.toLowerCase().replace(/\s+/g, "-");
  return amenityIcons[key] || Sparkles;
}

export default function AmenityGrid({ amenities }: AmenityGridProps) {
  if (amenities.length === 0) {
    return (
      <p className="text-sm text-[#a8a29e]">No amenities listed for this building.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {amenities.map((amenity) => {
        const Icon = getIcon(amenity);
        return (
          <div
            key={amenity}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-[#e2ddd5]"
          >
            <div className="w-8 h-8 rounded-lg bg-[#f5f3ef] flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-[#c2410c]" />
            </div>
            <span className="text-sm text-[#1c1917] capitalize">{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}
