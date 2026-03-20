import {
  BarChart3,
  Target,
  FileText,
  Building2,
  Shield,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Rent Price Intelligence",
    description:
      "Compare your rent against neighborhood averages. See studio, 1-bed, and 2-bed prices for every major US city and neighborhood.",
    iconColor: "text-[#0d9488]",
    iconBg: "bg-[#0d9488]/8",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Deep Fairness Score",
    description:
      "Multi-factor analysis with percentile ranking shows exactly where your rent falls compared to similar units in your area.",
    iconColor: "text-[#c2410c]",
    iconBg: "bg-[#c2410c]/8",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Negotiation Tools",
    description:
      "Generate data-backed negotiation letters to your landlord. Use real market data to support your case for fair rent.",
    iconColor: "text-[#2563eb]",
    iconBg: "bg-[#2563eb]/8",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Building Intelligence",
    description:
      "Check building violations, safety ratings, and landlord history before signing a lease. Know what you are moving into.",
    iconColor: "text-[#7c3aed]",
    iconBg: "bg-[#7c3aed]/8",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Tenant Rights Database",
    description:
      "Know your legal protections in every city. Rent control laws, security deposit rules, and eviction protections at your fingertips.",
    iconColor: "text-[#16a34a]",
    iconBg: "bg-[#16a34a]/8",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Market Trend Analysis",
    description:
      "Track rent changes over time and predict future pricing. Know when you have negotiating power and when to lock in a lease.",
    iconColor: "text-[#d97706]",
    iconBg: "bg-[#d97706]/8",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-[#faf9f7]" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#c2410c] uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-4">
            Everything You Need to Fight Unfair Rent
          </h2>
          <p className="text-lg text-[#57534e] max-w-2xl mx-auto">
            FairRent combines government data, market intelligence, and friendly
            tools to help you take control of your rent.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-7 bg-white rounded-2xl border border-[#e2ddd5] hover:border-[#d4cfc7] hover:shadow-md transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center ${feature.iconColor} mb-5 group-hover:scale-105 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1c1917] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#57534e] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
