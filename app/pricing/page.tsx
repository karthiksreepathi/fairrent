import { Metadata } from "next";
import PricingCard from "@/components/PricingCard";
import type { PricingTier } from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing | Free Rent Checker & Pro Plans",
  description: "FairRent is free for basic rent checks. Upgrade to Pro for detailed reports, rent alerts, landlord ratings, and negotiation assistance. Starting at $9.99/month.",
  alternates: { canonical: "https://fairrent.app/pricing" },
};

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Everything you need for basic rent research",
    features: [
      "Rent price comparisons (20+ cities)",
      "Neighborhood breakdowns",
      "Basic rent fairness score",
      "Market trend indicators",
      "City-specific tenant rights info",
      "Blog articles and guides",
    ],
    cta: "Start Free",
    ctaHref: "/rent-checker",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "month",
    description: "Advanced intelligence for serious renters",
    features: [
      "Everything in Free",
      "Deep rent fairness scoring",
      "Negotiation letter generator",
      "Move vs Stay calculator",
      "Lease renewal analyzer",
      "Building intelligence and ratings",
      "Rent price alerts",
      "PDF reports",
    ],
    cta: "Start Pro Trial",
    ctaHref: "/rent-checker",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "month",
    description: "For tenant advocacy orgs and legal teams",
    features: [
      "Everything in Pro",
      "API access for bulk data",
      "Custom city/region coverage",
      "White-label reports",
      "Dedicated account manager",
      "Data export (CSV/JSON)",
      "Team accounts (up to 10)",
      "Priority phone support",
    ],
    cta: "Contact Sales",
    ctaHref: "/about",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-[#faf9f7] min-h-screen">
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] mb-4">
              Simple, <span className="text-[#c2410c] font-bold">Transparent</span> Pricing
            </h1>
            <p className="text-lg text-[#57534e] max-w-xl mx-auto">
              Start free. Upgrade when you need more power. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {tiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="py-16 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#1c1917] text-center mb-8">Pricing FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Can I cancel anytime?", a: "Yes. No contracts, no commitments. Cancel your Pro subscription anytime and you keep access until the end of your billing period." },
            { q: "Is the free plan really free?", a: "Yes, 100% free with no credit card required. We make money from Pro subscriptions and affiliate partnerships, not from selling your data." },
            { q: "Do you offer refunds?", a: "Yes, we offer a 30-day money-back guarantee. If you are not satisfied with Pro, we will refund your payment, no questions asked." },
            { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. Enterprise plans can pay via invoice." },
          ].map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-5">
              <h3 className="font-semibold text-[#1c1917] mb-2">{faq.q}</h3>
              <p className="text-sm text-[#57534e]">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
