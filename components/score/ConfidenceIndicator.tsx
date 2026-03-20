interface ConfidenceIndicatorProps {
  confidence: "high" | "medium" | "low";
}

const confidenceConfig = {
  high: {
    label: "High Confidence",
    description: "Multiple data points validate this assessment",
    color: "text-[#16a34a]",
    ringColor: "border-[#16a34a]",
    bgColor: "bg-green-50",
    segments: 3,
  },
  medium: {
    label: "Medium Confidence",
    description: "Some data points may be estimated",
    color: "text-[#c2410c]",
    ringColor: "border-[#c2410c]",
    bgColor: "bg-[#f5f3ef]",
    segments: 2,
  },
  low: {
    label: "Low Confidence",
    description: "Limited data available for this area",
    color: "text-warning",
    ringColor: "border-warning",
    bgColor: "bg-warning/10",
    segments: 1,
  },
};

export default function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  const config = confidenceConfig[confidence];

  return (
    <div className="flex items-center gap-3">
      {/* Ring indicator */}
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={`w-2.5 h-8 rounded-full ${
              segment <= config.segments
                ? config.bgColor + " border " + config.ringColor
                : "bg-white border border-[#e2ddd5]"
            }`}
          />
        ))}
      </div>
      <div>
        <div className={`text-sm font-semibold ${config.color}`}>{config.label}</div>
        <div className="text-xs text-[#a8a29e]">{config.description}</div>
      </div>
    </div>
  );
}
