import { Metadata } from "next";
import RentCheckerForm from "@/components/RentCheckerForm";
import { generateSoftwareAppSchema } from "@/lib/structured-data";
import { Shield, Database, BarChart3, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Rent Checker - Deep Fairness Score with HUD Data | FareRent",
  description: "Get your deep rent fairness score powered by HUD Fair Market Rent data. Analyze 6 factors, see your percentile rank, and get negotiation leverage insights. Free for 20+ US cities.",
  alternates: { canonical: "https://farerent.com/rent-checker" },
};

export default function RentCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSoftwareAppSchema()) }}
      />

      <div className="bg-[#faf9f7] min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-12 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#e2ddd5] text-xs font-medium text-[#c2410c] mb-4">
              <BarChart3 className="w-3.5 h-3.5" />
              DEEP RENT ANALYSIS
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-3">
              Is Your Rent <span className="text-[#c2410c] font-bold">Fair?</span>
            </h1>
            <p className="text-[#57534e] max-w-xl mx-auto">
              Get a comprehensive fairness score powered by 6 data-driven factors, HUD Fair Market Rent benchmarks, and local market intelligence. Completely free.
            </p>

            {/* Trust Badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-[#e2ddd5] text-xs text-[#a8a29e]">
              <Shield className="w-3.5 h-3.5 text-[#16a34a]" />
              Powered by HUD Fair Market Rent Data
              <span className="w-1 h-1 rounded-full bg-[#a8a29e]" />
              <Database className="w-3.5 h-3.5 text-[#c2410c]" />
              20 Cities
              <span className="w-1 h-1 rounded-full bg-[#a8a29e]" />
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              6-Factor Analysis
            </div>
          </div>
        </section>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 sm:p-8">
            <RentCheckerForm />
          </div>
        </div>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-[#1c1917] text-center mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Enter Your Details",
                desc: "Select your city, bedroom count, and current rent. Add square footage and amenities for higher accuracy.",
              },
              {
                step: "2",
                title: "Deep Analysis",
                desc: "Our engine compares your rent against market averages, HUD standards, price per sqft, market conditions, and more.",
              },
              {
                step: "3",
                title: "Get Actionable Insights",
                desc: "Receive your fairness score, percentile rank, negotiation leverage rating, and personalized recommendations.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-[#c2410c]">{item.step}</span>
                </div>
                <h3 className="font-semibold text-[#1c1917] mb-2">{item.title}</h3>
                <p className="text-sm text-[#a8a29e] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Scoring Factors */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#1c1917] text-center mb-3">6 Scoring Factors</h2>
            <p className="text-center text-[#a8a29e] text-sm mb-8 max-w-lg mx-auto">
              Each factor is weighted to produce a comprehensive fairness score from 0 to 100.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Market Comparison", weight: "30%", desc: "How your rent compares to the city average for your unit type." },
                { name: "HUD Fair Market Rent", weight: "20%", desc: "Comparison against government-established fair market rent standards." },
                { name: "Price per Sqft", weight: "15%", desc: "Cost efficiency analysis based on your apartment size." },
                { name: "Market Conditions", weight: "15%", desc: "Local vacancy rates and rent trends that affect your leverage." },
                { name: "Rent-to-Income", weight: "10%", desc: "How your rent aligns with the 30% income guideline." },
                { name: "Amenity Value", weight: "10%", desc: "Whether building features justify any premium you are paying." },
              ].map((factor) => (
                <div key={factor.name} className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-[#1c1917]">{factor.name}</h4>
                    <span className="text-xs font-bold text-[#c2410c] bg-[#f5f3ef] px-2 py-0.5 rounded-full">
                      {factor.weight}
                    </span>
                  </div>
                  <p className="text-xs text-[#a8a29e] leading-relaxed">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
