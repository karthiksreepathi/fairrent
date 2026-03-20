"use client";

import { useState, useMemo } from "react";

interface MarketComparisonDataPoint {
  city: string;
  rent: number;
  fairMarketRent?: number;
}

interface MarketComparisonChartProps {
  data: MarketComparisonDataPoint[];
  height?: number;
  className?: string;
}

export default function MarketComparisonChart({
  data,
  height,
  className = "",
}: MarketComparisonChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rowHeight = 44;
  const padding = { top: 12, right: 80, bottom: 12, left: 140 };
  const viewBoxWidth = 600;

  const sorted = useMemo(
    () => [...data].sort((a, b) => b.rent - a.rent),
    [data]
  );

  const viewBoxHeight = height || padding.top + sorted.length * rowHeight + padding.bottom;
  const chartWidth = viewBoxWidth - padding.left - padding.right;

  const maxRent = useMemo(() => {
    const allValues = sorted.flatMap((d) =>
      d.fairMarketRent ? [d.rent, d.fairMarketRent] : [d.rent]
    );
    return Math.max(...allValues, 1);
  }, [sorted]);

  const formatDollar = (v: number) => `$${v.toLocaleString()}`;

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-6 ${className}`}>
        <p className="text-sm text-[#a8a29e] text-center">No comparison data available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-5 ${className}`}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="rentBarGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c2410c" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c2410c" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="fmrBarGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {sorted.map((item, i) => {
          const y = padding.top + i * rowHeight;
          const barY = y + 8;
          const mainBarHeight = 20;
          const fmrBarHeight = 8;
          const mainBarWidth = (item.rent / maxRent) * chartWidth;
          const fmrBarWidth = item.fairMarketRent
            ? (item.fairMarketRent / maxRent) * chartWidth
            : 0;
          const isHovered = hoveredIndex === i;

          return (
            <g
              key={`row-${i}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Row background on hover */}
              {isHovered && (
                <rect
                  x="0"
                  y={y}
                  width={viewBoxWidth}
                  height={rowHeight}
                  fill="rgba(234, 88, 12, 0.04)"
                  rx="4"
                />
              )}

              {/* City name */}
              <text
                x={padding.left - 10}
                y={barY + mainBarHeight / 2 + 4}
                textAnchor="end"
                fill={isHovered ? "#1c1917" : "#57534e"}
                fontSize="12"
                fontWeight={isHovered ? "600" : "400"}
                fontFamily="var(--font-sans)"
                style={{ transition: "fill 0.15s ease" }}
              >
                {item.city}
              </text>

              {/* Main rent bar */}
              <rect
                x={padding.left}
                y={barY}
                width={Math.max(mainBarWidth, 2)}
                height={mainBarHeight}
                rx="4"
                fill="url(#rentBarGradient)"
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: "opacity 0.15s ease" }}
              />

              {/* Fair Market Rent overlay bar (thinner, centered vertically on main bar) */}
              {item.fairMarketRent && (
                <rect
                  x={padding.left}
                  y={barY + (mainBarHeight - fmrBarHeight) / 2}
                  width={Math.max(fmrBarWidth, 2)}
                  height={fmrBarHeight}
                  rx="3"
                  fill="url(#fmrBarGradient)"
                  opacity={isHovered ? 1 : 0.75}
                  style={{ transition: "opacity 0.15s ease" }}
                />
              )}

              {/* Dollar value on the right */}
              <text
                x={padding.left + Math.max(mainBarWidth, fmrBarWidth) + 10}
                y={barY + mainBarHeight / 2 + 4}
                textAnchor="start"
                fill={isHovered ? "#1c1917" : "#57534e"}
                fontSize="12"
                fontWeight="600"
                fontFamily="var(--font-sans)"
                style={{ transition: "fill 0.15s ease" }}
              >
                {formatDollar(item.rent)}
              </text>

              {/* Fair market rent value (shown on hover if it exists) */}
              {isHovered && item.fairMarketRent && (
                <text
                  x={padding.left + fmrBarWidth + 10}
                  y={barY + mainBarHeight + 14}
                  textAnchor="start"
                  fill="#0d9488"
                  fontSize="10"
                  fontFamily="var(--font-sans)"
                >
                  FMR: {formatDollar(item.fairMarketRent)}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        {sorted.some((d) => d.fairMarketRent) && (
          <g transform={`translate(${padding.left}, ${viewBoxHeight - padding.bottom + 2})`}>
            <rect x="0" y="-4" width="12" height="8" rx="2" fill="#c2410c" />
            <text x="16" y="3" fill="#57534e" fontSize="10" fontFamily="var(--font-sans)">
              Actual Rent
            </text>
            <rect x="90" y="-2" width="12" height="4" rx="1.5" fill="#0d9488" />
            <text x="106" y="3" fill="#57534e" fontSize="10" fontFamily="var(--font-sans)">
              Fair Market Rent
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
