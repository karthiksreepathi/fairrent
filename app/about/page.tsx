import { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About FairRent | Our Mission to Empower Renters",
  description: "FairRent was built to level the playing field between landlords and tenants. Learn about our mission, our team, and our commitment to helping renters get a fair deal.",
  alternates: { canonical: "https://fairrent.app/about" },
};

export default function AboutPage() {
  return (
    <div className="bg-[#faf9f7] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] mb-4">
            Leveling the Playing Field for <span className="text-[#c2410c] font-bold">44 Million Renters</span>
          </h1>
          <p className="text-lg text-[#57534e] max-w-2xl mx-auto">
            Landlords have billion-dollar pricing algorithms. Tenants have nothing. We are changing that.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold text-[#1c1917]">The Problem We Saw</h2>
          <p className="text-[#57534e] leading-relaxed">
            In 2023, investigations revealed that major landlords were using algorithmic pricing software to coordinate rent increases, effectively acting as a cartel. While lawsuits and legislation are slowly catching up, tenants still face a massive information asymmetry.
          </p>
          <p className="text-[#57534e] leading-relaxed">
            Landlords have access to RealPage, CoStar, Yardi, and dozens of other tools that give them perfect information about what they can charge. Tenants walk into negotiations blind, with nothing but Craigslist listings and gut feelings.
          </p>

          <h2 className="text-2xl font-bold text-[#1c1917] mt-10">Our Mission</h2>
          <p className="text-[#57534e] leading-relaxed">
            FairRent exists to give tenants the same data power that landlords have. We aggregate public data on rent prices, vacancy rates, building violations, and tenant protections to create a comprehensive intelligence platform for renters. And it is free for everyone.
          </p>
          <p className="text-[#57534e] leading-relaxed">
            We believe that when tenants have access to the same information as landlords, the rental market becomes fairer for everyone.
          </p>

          <h2 className="text-2xl font-bold text-[#1c1917] mt-10">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            {[
              { title: "Transparency", desc: "All our basic tools are free. We believe rent data should be accessible to everyone, not locked behind paywalls." },
              { title: "Tenant Advocacy", desc: "We are on the tenant's side. Our tools, content, and data are designed exclusively to empower renters." },
              { title: "Data-Driven Decisions", desc: "Emotions and gut feelings don't win negotiations. Data does. We arm you with the facts." },
              { title: "Privacy First", desc: "We never sell your personal data. Your searches are private. We make money from subscriptions, not your information." },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-5">
                <h3 className="font-bold text-[#1c1917] mb-2">{value.title}</h3>
                <p className="text-sm text-[#57534e]">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#0d9488]/20 rounded-2xl p-10 mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-[#c2410c] font-bold">20+</div>
              <div className="text-sm text-[#a8a29e] mt-1">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#c2410c] font-bold">100+</div>
              <div className="text-sm text-[#a8a29e] mt-1">Neighborhoods</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#c2410c] font-bold">$2.4K</div>
              <div className="text-sm text-[#a8a29e] mt-1">Avg User Savings</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#c2410c] font-bold">50K+</div>
              <div className="text-sm text-[#a8a29e] mt-1">Renters Served</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1c1917] mb-4">Ready to Take Control of Your Rent?</h2>
          <p className="text-[#57534e] mb-6">Join thousands of renters making smarter decisions with data.</p>
          <Link href="/rent-checker" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md px-8 py-3 text-sm inline-flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Check Your Rent Free
          </Link>
        </div>
      </div>
    </div>
  );
}
