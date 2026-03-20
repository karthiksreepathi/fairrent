"use client";

import { useState, useMemo } from "react";

interface SeasonalityDataPoint {
  month: string;
  factor: number;
}

interface SeasonalityChartProps {
  data: SeasonalityDataPoint[];
  height?: number;
  className?: string;
}

export default function SeasonalityChart({
  data,
  height = 280,
  className = "",
}: SeasonalityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const padding = { top: 28, right: 16, bottom: 36, left: 44 };
  const viewBoxWidth = 600;
  const viewBoxHeight = height;

  const chartWidth = viewBoxWidth - padding.left - padding.right;
  const chartHeight = viewBoxHeight - padding.top - padding.bottom;

  const { bars, baselineY, maxDeviation } = useMemo(() => {
    if (data.length === 0) {
      return { bars: [], baselineY: 0, maxDeviation: 0 };
    }

    const factors = data.map((d) => d.factor);
    const maxAbove = Math.max(...factors.map((f) => f - 1), 0);
    const maxBelow = Math.max(...factors.map((f) => 1 - f), 0);
    const maxDev = Math.max(maxAbove, maxBelow, 0.05); // Minimum deviation to avoid flat chart

    // Baseline (factor = 1.0) sits at the vertical center
    const blY = padding.top + (maxDev / (maxDev * 2)) * chartHeight;

    const barGap = 6;
    const totalBarSpace = chartWidth - barGap * (data.length - 1);
    const barWidth = Math.min(totalBarSpace / data.length, 40);
    const totalUsed = data.length * barWidth + (data.length - 1) * barGap;
    const offsetX = padding.left + (chartWidth - totalUsed) / 2;

    const computed = data.map((d, i) => {
      const x = offsetX + i * (barWidth + barGap);
      const deviation = d.factor - 1;
      const barHeight = (Math.abs(deviation) / maxDev) * (chartHeight / 2);

      // If factor > 1, bar goes upward from baseline; otherwise downward
      const y = deviation >= 0 ? blY - barHeight : blY;

      return {
        x,
        y,
        width: barWidth,
        height: barHeight,
        isPeak: d.factor > 1,
        ...d,
      };
    });

    return { bars: computed, baselineY: blY, maxDeviation: maxDev };
  }, [data, chartWidth, chartHeight]);

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-6 ${className}`}>
        <p className="text-sm text-[#a8a29e] text-center">No seasonality data available</p>
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
          <linearGradient id="barGradientPeak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="barGradientOff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Baseline at factor = 1.0 */}
        <line
          x1={padding.left - 8}
          y1={baselineY}
          x2={viewBoxWidth - padding.right}
          y2={baselineY}
          stroke="#57534e"
          strokeWidth="1"
          strokeDasharray="6 3"
        />
        <text
          x={padding.left - 12}
          y={baselineY + 4}
          textAnchor="end"
          fill="#57534e"
          fontSize="11"
          fontFamily="var(--font-sans)"
        >
          1.0x
        </text>

        {/* Bars */}
        {bars.map((bar, i) => (
          <g
            key={`bar-${i}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Bar rectangle */}
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={Math.max(bar.height, 1)}
              rx="3"
              fill={bar.isPeak ? "url(#barGradientPeak)" : "url(#barGradientOff)"}
              stroke={
                hoveredIndex === i
                  ? bar.isPeak
                    ? "#16a34a"
                    : "#0d9488"
                  : "transparent"
              }
              strokeWidth="1.5"
              style={{ transition: "stroke 0.15s ease" }}
            />

            {/* Factor value label (shown on hover or always for peak/trough) */}
            <text
              x={bar.x + bar.width / 2}
              y={bar.isPeak ? bar.y - 6 : bar.y + bar.height + 14}
              textAnchor="middle"
              fill={
                hoveredIndex === i
                  ? "#1c1917"
                  : bar.isPeak
                    ? "#16a34a"
                    : "#0d9488"
              }
              fontSize="10"
              fontWeight="600"
              fontFamily="var(--font-sans)"
              opacity={hoveredIndex === i || Math.abs(bar.factor - 1) > 0.02 ? 1 : 0}
              style={{ transition: "opacity 0.15s ease" }}
            >
              {bar.factor.toFixed(2)}x
            </text>

            {/* Month label on x-axis */}
            <text
              x={bar.x + bar.width / 2}
              y={viewBoxHeight - padding.bottom + 16}
              textAnchor="middle"
              fill={hoveredIndex === i ? "#1c1917" : "#57534e"}
              fontSize="11"
              fontFamily="var(--font-sans)"
              style={{ transition: "fill 0.15s ease" }}
            >
              {bar.month}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g transform={`translate(${viewBoxWidth - padding.right - 180}, ${padding.top - 16})`}>
          <rect x="0" y="0" width="10" height="10" rx="2" fill="#16a34a" />
          <text x="14" y="9" fill="#57534e" fontSize="10" fontFamily="var(--font-sans)">
            Peak Season (&gt;1.0)
          </text>
          <rect x="100" y="0" width="10" height="10" rx="2" fill="#0d9488" />
          <text x="114" y="9" fill="#57534e" fontSize="10" fontFamily="var(--font-sans)">
            Off Season
          </text>
        </g>
      </svg>
    </div>
  );
}
