import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import {
  FileText,
  Calculator,
  BarChart3,
  Search,
  Building2,
  Bell,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Renter Tools",
  description:
    "Free tools for renters: negotiation letter generator, move vs stay calculator, lease renewal analyzer, and comparable unit finder. Save money with data.",
};

const tools = [
  {
    title: "Negotiation Letter Generator",
    description:
      "Create a professional, data-backed letter to negotiate your rent. Includes market comparables, building data, and customizable tone.",
    icon: FileText,
    href: "/tools/negotiation-letter",
    badge: "POPULAR",
    accentColor: "from-blue-500/20 to-blue-600/20",
  },
  {
    title: "Move vs Stay Calculator",
    description:
      "Compare the total cost of moving to a new apartment versus staying and negotiating your current rent. Includes a 5 year projection.",
    icon: Calculator,
    href: "/tools/move-calculator",
    accentColor: "from-green-500/20 to-green-600/20",
  },
  {
    title: "Lease Renewal Analyzer",
    description:
      "Analyze your lease renewal offer against current market rates. Find out if the proposed increase is fair and get negotiation points.",
    icon: BarChart3,
    href: "/tools/lease-analyzer",
    accentColor: "from-purple-500/20 to-purple-600/20",
  },
  {
    title: "Find Comparable Units",
    description:
      "Discover similar apartments at lower prices in your area. Build a strong case for rent reduction with real comparable listings.",
    icon: Search,
    href: "/tools/comparables",
    accentColor: "from-amber-500/20 to-amber-600/20",
  },
  {
    title: "Building Intelligence",
    description:
      "Look up any building to check violation history, landlord ratings, maintenance scores, and rent increase patterns before you sign.",
    icon: Building2,
    href: "/buildings",
    badge: "NEW",
    accentColor: "from-teal-500/20 to-teal-600/20",
  },
  {
    title: "Rent Alerts",
    description:
      "Set up personalized alerts for price drops, new listings, and market changes in your target neighborhoods. Never miss a deal.",
    icon: Bell,
    href: "/alerts",
    accentColor: "from-pink-500/20 to-rose-500/20",
  },
];

export default function ToolsPage() {
  return (
    <div className="bg-[#faf9f7] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#e2ddd5] text-xs font-medium text-[#c2410c] mb-4">
            <Shield className="w-3.5 h-3.5" />
            FREE RENTER TOOLKIT
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1c1917] mb-4">
            Tools That <span className="text-[#c2410c] font-bold">Save You Money</span>
          </h1>
          <p className="text-lg text-[#57534e] max-w-2xl mx-auto">
            Go beyond data. Use our free tools to negotiate, analyze, and find better deals backed by real market intelligence.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-12 border-t border-[#e2ddd5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[#a8a29e] mb-2">
            All tools are free to use with basic features. Premium features require an email signup.
          </p>
          <p className="text-xs text-[#a8a29e]">
            Powered by HUD Fair Market Rent data, Census Bureau ACS, and real-time listing aggregation.
          </p>
        </div>
      </section>
    </div>
  );
}
