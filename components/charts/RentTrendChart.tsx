"use client";

import { useState, useMemo } from "react";

interface RentTrendDataPoint {
  month: string;
  avgRent: number;
}

interface RentTrendChartProps {
  data: RentTrendDataPoint[];
  height?: number;
  showLabels?: boolean;
  className?: string;
}

export default function RentTrendChart({
  data,
  height = 300,
  showLabels = true,
  className = "",
}: RentTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const padding = { top: 24, right: 20, bottom: 44, left: 64 };
  const viewBoxWidth = 600;
  const viewBoxHeight = height;

  const chartWidth = viewBoxWidth - padding.left - padding.right;
  const chartHeight = viewBoxHeight - padding.top - padding.bottom;

  const { minRent, maxRent, points, linePath, areaPath, yTicks } = useMemo(() => {
    if (data.length === 0) {
      return { minRent: 0, maxRent: 0, points: [], linePath: "", areaPath: "", yTicks: [] };
    }

    const rents = data.map((d) => d.avgRent);
    const rawMin = Math.min(...rents);
    const rawMax = Math.max(...rents);

    // Add 10% padding to the range
    const range = rawMax - rawMin || 100;
    const minR = Math.floor((rawMin - range * 0.1) / 50) * 50;
    const maxR = Math.ceil((rawMax + range * 0.1) / 50) * 50;

    const xStep = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth / 2;

    const pts = data.map((d, i) => {
      const x = padding.left + i * xStep;
      const y =
        padding.top +
        chartHeight -
        ((d.avgRent - minR) / (maxR - minR)) * chartHeight;
      return { x, y, ...d };
    });

    // Build SVG line path
    let line = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      // Smooth curve using cubic bezier
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      line += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Build area path (line path + close to bottom)
    const bottomY = padding.top + chartHeight;
    const area =
      line +
      ` L ${pts[pts.length - 1].x} ${bottomY} L ${pts[0].x} ${bottomY} Z`;

    // Y-axis ticks (5 ticks)
    const tickCount = 5;
    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const value = minR + ((maxR - minR) * i) / (tickCount - 1);
      const y =
        padding.top + chartHeight - ((value - minR) / (maxR - minR)) * chartHeight;
      return { value: Math.round(value), y };
    });

    return { minRent: minR, maxRent: maxR, points: pts, linePath: line, areaPath: area, yTicks: ticks };
  }, [data, chartWidth, chartHeight]);

  const formatDollar = (v: number) => {
    if (v >= 1000) {
      return `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
    }
    return `$${v}`;
  };

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-6 ${className}`}>
        <p className="text-sm text-[#a8a29e] text-center">No trend data available</p>
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
          {/* Gradient fill under the line */}
          <linearGradient id="rentTrendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c2410c" stopOpacity="0.2" />
            <stop offset="80%" stopColor="#c2410c" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick) => (
          <line
            key={`grid-${tick.value}`}
            x1={padding.left}
            y1={tick.y}
            x2={viewBoxWidth - padding.right}
            y2={tick.y}
            stroke="#e2ddd5"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Y-axis labels */}
        {showLabels &&
          yTicks.map((tick) => (
            <text
              key={`ylabel-${tick.value}`}
              x={padding.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              fill="#57534e"
              fontSize="11"
              fontFamily="var(--font-sans)"
            >
              {formatDollar(tick.value)}
            </text>
          ))}

        {/* Gradient area fill */}
        <path d={areaPath} fill="url(#rentTrendGradient)" />

        {/* Main line */}
        <path
          d={linePath}
          fill="none"
          stroke="#c2410c"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, i) => (
          <g key={`point-${i}`}>
            {/* Larger invisible hit area for hover */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="14"
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            />
            {/* Visible dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 5 : 3}
              fill={hoveredIndex === i ? "#c2410c" : "#c2410c"}
              stroke="#ffffff"
              strokeWidth="2"
              style={{ transition: "r 0.15s ease" }}
            />
          </g>
        ))}

        {/* Hover tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <g>
            {/* Vertical guide line */}
            <line
              x1={points[hoveredIndex].x}
              y1={padding.top}
              x2={points[hoveredIndex].x}
              y2={padding.top + chartHeight}
              stroke="#c2410c"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.4"
            />
            {/* Tooltip background */}
            <rect
              x={points[hoveredIndex].x - 44}
              y={points[hoveredIndex].y - 34}
              width="88"
              height="24"
              rx="6"
              fill="#1c1917"
              stroke="#c2410c"
              strokeWidth="1"
              opacity="0.95"
            />
            {/* Tooltip text */}
            <text
              x={points[hoveredIndex].x}
              y={points[hoveredIndex].y - 18}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="600"
              fontFamily="var(--font-sans)"
            >
              ${points[hoveredIndex].avgRent.toLocaleString()}
            </text>
          </g>
        )}

        {/* X-axis labels (show every 3rd to avoid crowding) */}
        {showLabels &&
          points.map((pt, i) => {
            const showEvery = data.length > 6 ? 3 : data.length > 3 ? 2 : 1;
            if (i % showEvery !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={`xlabel-${i}`}
                x={pt.x}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                fill="#57534e"
                fontSize="11"
                fontFamily="var(--font-sans)"
              >
                {pt.month}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
