import { Star } from "lucide-react";

interface RatingDisplayProps {
  overall: number;
  breakdown?: {
    label: string;
    value: number;
  }[];
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= Math.floor(rating)
              ? "text-amber-400 fill-amber-400"
              : star <= Math.ceil(rating) && rating % 1 >= 0.5
                ? "text-amber-400 fill-amber-400/50"
                : "text-[#e2ddd5]"
          }`}
        />
      ))}
    </div>
  );
}

export default function RatingDisplay({
  overall,
  breakdown,
  reviewCount,
  size = "md",
}: RatingDisplayProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`font-bold ${size === "lg" ? "text-3xl" : "text-xl"} text-[#1c1917]`}>
          {overall.toFixed(1)}
        </span>
        <div>
          <StarRating rating={overall} size={size} />
          {reviewCount !== undefined && (
            <p className="text-xs text-[#a8a29e] mt-0.5">{reviewCount} reviews</p>
          )}
        </div>
      </div>

      {breakdown && breakdown.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-[#a8a29e] w-28 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-2 bg-[#faf9f7] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c2410c] to-[#c2410c] transition-all duration-500"
                  style={{ width: `${(item.value / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-[#1c1917] w-7 text-right">
                {item.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { StarRating };
