import Link from "next/link";
import { Check } from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular: boolean;
}

export default function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={`relative p-8 rounded-2xl transition-all duration-300 ${
        tier.popular
          ? "bg-white rounded-2xl shadow-sm border border-[#0d9488]/20 scale-105 shadow-[0_8px_40px_rgba(13,148,136,0.1)]"
          : "bg-white rounded-2xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 transition-all"
      }`}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-5 py-1.5 bg-[#0d9488] text-white text-xs font-bold rounded-full shadow-lg">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        {/* Tier Name */}
        <h3 className="text-xl font-bold text-[#1c1917] mb-3">{tier.name}</h3>

        {/* Price */}
        <div className="flex items-baseline justify-center gap-1">
          <span
            className={`text-4xl font-extrabold ${
              tier.popular ? "text-[#c2410c] font-bold" : "text-[#1c1917]"
            }`}
          >
            {tier.price}
          </span>
          {tier.period && (
            <span className="text-[#a8a29e] text-sm">/{tier.period}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-[#57534e] mt-3">{tier.description}</p>
      </div>

      {/* Features List */}
      <ul className="space-y-3.5 mb-8">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" />
            <span className="text-sm text-[#57534e]">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        href={tier.ctaHref}
        className={`block w-full py-3.5 text-center text-sm font-semibold rounded-xl transition-all ${
          tier.popular ? "bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] shadow-sm" : "btn-outline"
        }`}
      >
        {tier.cta}
      </Link>
    </div>
  );
}

export type { PricingTier };
