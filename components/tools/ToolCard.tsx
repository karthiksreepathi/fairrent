import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  accentColor?: string;
}

export default function ToolCard({
  title,
  description,
  icon: Icon,
  href,
  badge,
  accentColor = "from-[#c2410c]/20 to-[#c2410c]/20",
}: ToolCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 transition-all p-6 h-full duration-300 relative overflow-hidden">
        {badge && (
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#0d9488] text-white">
              {badge}
            </span>
          </div>
        )}

        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accentColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-7 h-7 text-[#c2410c]" />
        </div>

        <h3 className="text-lg font-semibold text-[#1c1917] mb-2 group-hover:text-[#c2410c] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[#a8a29e] leading-relaxed mb-4">{description}</p>

        <div className="flex items-center gap-1 text-sm font-medium text-[#c2410c] group-hover:gap-2 transition-all">
          Try Now
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
