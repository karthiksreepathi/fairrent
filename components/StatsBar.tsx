"use client";

import { useEffect, useRef, useState } from "react";
import { Users, TrendingDown, DollarSign, MapPin } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  target: number;
  prefix: string;
  suffix: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: <Users className="w-5 h-5" />,
    target: 44,
    prefix: "",
    suffix: "M+",
    label: "Renter Households",
    color: "text-[#0d9488]",
  },
  {
    icon: <TrendingDown className="w-5 h-5" />,
    target: 46,
    prefix: "",
    suffix: "%",
    label: "Cost-Burdened",
    color: "text-[#dc2626]",
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    target: 2400,
    prefix: "$",
    suffix: "",
    label: "Avg. Savings",
    color: "text-[#16a34a]",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    target: 20,
    prefix: "",
    suffix: "+",
    label: "Cities Covered",
    color: "text-[#c2410c]",
  },
];

function AnimatedCounter({
  target,
  prefix,
  suffix,
  color,
}: {
  target: number;
  prefix: string;
  suffix: string;
  color: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  const formatted =
    target >= 1000
      ? count.toLocaleString("en-US")
      : count.toString();

  return (
    <span ref={ref} className={`${color} font-bold text-3xl sm:text-4xl font-extrabold tabular-nums`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="relative bg-white py-14 border-y border-[#e2ddd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] flex items-center justify-center text-[#57534e]">
                  {stat.icon}
                </div>
              </div>
              <div className="mb-1">
                <AnimatedCounter
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  color={stat.color}
                />
              </div>
              <div className="text-sm text-[#57534e]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
