import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import FeaturesSection from "@/components/FeaturesSection";
import CityCard from "@/components/CityCard";
import FaqSection from "@/components/FaqSection";
import { faqs } from "@/data/faqs";
import { cities } from "@/data/cities";
import { getRecentBlogPosts } from "@/data/blog-posts";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import Image from "next/image";
import { generateFaqSchema, generateSoftwareAppSchema } from "@/lib/structured-data";
import {
  FileText,
  Calculator,
  BarChart3,
  Search,
  Building2,
  ChevronRight,
  Shield,
  Database,
  Globe,
  Lock,
  ArrowRight,
} from "lucide-react";

const toolsPreview = [
  {
    icon: FileText,
    title: "Negotiation Letter Generator",
    desc: "Create a professional, data-backed letter to negotiate your rent with market comparables and violation history.",
    href: "/tools/negotiation-letter",
    iconColor: "text-[#2563eb]",
    iconBg: "bg-[#2563eb]/8",
  },
  {
    icon: Calculator,
    title: "Move vs Stay Calculator",
    desc: "Compare the total cost of moving to a new apartment versus staying and negotiating. Get a 5 year projection.",
    href: "/tools/move-calculator",
    iconColor: "text-[#16a34a]",
    iconBg: "bg-[#16a34a]/8",
  },
  {
    icon: BarChart3,
    title: "Lease Renewal Analyzer",
    desc: "Analyze your renewal offer against market rates. Know if the proposed increase is fair before you sign.",
    href: "/tools/lease-analyzer",
    iconColor: "text-[#7c3aed]",
    iconBg: "bg-[#7c3aed]/8",
  },
  {
    icon: Search,
    title: "Find Comparable Units",
    desc: "Discover similar apartments at lower prices. Build your case for a rent reduction with real listings.",
    href: "/tools/comparables",
    iconColor: "text-[#d97706]",
    iconBg: "bg-[#d97706]/8",
  },
];

export default function Home() {
  const topCities = cities.slice(0, 8);
  const recentPosts = getRecentBlogPosts(3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSoftwareAppSchema()) }}
      />

      <Hero />
      <StatsBar />

      {/* Problem/Solution Section */}
      <section className="py-20 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-[#c2410c] uppercase tracking-wider mb-3">The Problem</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-6">
                The Rental Market Is Working Against You
              </h2>
              <p className="text-[#57534e] mb-6 leading-relaxed">
                Landlords use enterprise pricing software like RealPage and YieldStar to algorithmically maximize what you pay. These tools analyze market data, competitor pricing, and demand patterns to extract the highest possible rent.
              </p>
              <p className="text-[#57534e] mb-8 leading-relaxed">
                Until now, tenants had no way to fight back. <strong className="text-[#1c1917]">FareRent shows you the real fare</strong> — the same market data landlords use — completely free, so you can negotiate from a position of strength.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#dc2626]/15">
                  <div className="text-sm font-bold text-[#dc2626] mb-2">What Landlords Have</div>
                  <ul className="space-y-1.5 text-xs text-[#57534e]">
                    <li>Algorithmic pricing tools</li>
                    <li>Market comp databases</li>
                    <li>Tenant screening data</li>
                    <li>Demand forecasting</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#16a34a]/15">
                  <div className="text-sm font-bold text-[#16a34a] mb-2">What FareRent Gives You</div>
                  <ul className="space-y-1.5 text-xs text-[#57534e]">
                    <li>Deep rent fairness scoring</li>
                    <li>Neighborhood intelligence</li>
                    <li>Negotiation tools</li>
                    <li>Building violation data</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Stock image of apartment */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#e2ddd5]">
                <div className="relative h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop"
                    alt="Modern apartment interior"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="bg-white p-6 space-y-3">
                  <div className="p-3 rounded-xl bg-[#faf9f7] border border-[#ede8e0]">
                    <div className="text-xs text-[#a8a29e] mb-1">Average 1-Bedroom Rent</div>
                    <div className="text-2xl font-bold text-[#1c1917]">$1,750</div>
                    <div className="text-xs text-[#d97706] font-medium mt-1">Your rent: $1,950 (+$200 above average)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#faf9f7] border border-[#ede8e0]">
                    <div className="text-xs text-[#a8a29e] mb-1">Market Trend</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#16a34a]">-2.5%</span>
                      <span className="text-xs text-[#a8a29e]">Rents dropping in your area</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#c2410c]/5 border border-[#c2410c]/10">
                    <div className="text-xs text-[#a8a29e] mb-1">Rent Fairness Score</div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-extrabold text-[#c2410c]">40</div>
                      <div>
                        <div className="text-sm font-bold text-[#d97706]">Above Average</div>
                        <div className="text-xs text-[#a8a29e]">You could save $2,400/year</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Tools Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0d9488] uppercase tracking-wider mb-3">Free Tools</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-4">
              Tools That Save You Money
            </h2>
            <p className="text-lg text-[#57534e] max-w-2xl mx-auto">
              Go beyond data. Use our free tools to negotiate, analyze, and find better deals backed by real market intelligence.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {toolsPreview.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white rounded-2xl border border-[#e2ddd5] hover:border-[#d4cfc7] hover:shadow-md p-6 flex gap-4 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <tool.icon className={`w-6 h-6 ${tool.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1c1917] mb-1 group-hover:text-[#c2410c] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-[#a8a29e] leading-relaxed">{tool.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#a8a29e] group-hover:text-[#c2410c] group-hover:translate-x-1 transition-all self-center shrink-0" />
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/tools"
              className="btn-outline px-8 py-3 text-sm inline-flex items-center gap-2"
            >
              Explore All Tools
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* City Grid */}
      <section className="py-20 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#c2410c] uppercase tracking-wider mb-3">Coverage</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-4">Explore Rent Data by City</h2>
            <p className="text-lg text-[#57534e] max-w-2xl mx-auto">
              Detailed rent intelligence for 20+ major US cities with neighborhood breakdowns, trends, and tenant protections. All completely free.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/rent-checker"
              className="btn-premium px-8 py-3 text-sm inline-flex items-center gap-2"
            >
              View All Cities
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Building Intelligence Teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#0d9488]/15 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm font-semibold text-[#0d9488] uppercase tracking-wider mb-3">Building Intelligence</p>
                <h2 className="text-3xl font-bold text-[#1c1917] mb-4">
                  Know Your Building Before You Sign
                </h2>
                <p className="text-[#57534e] mb-6 leading-relaxed">
                  Check violation history, landlord ratings, maintenance scores, and rent increase patterns for any building. Make smarter decisions with complete transparency.
                </p>
                <Link
                  href="/buildings"
                  className="btn-gold px-6 py-3 text-sm inline-flex items-center gap-2"
                >
                  Search Buildings
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#faf9f7] p-4 rounded-xl border border-[#ede8e0]">
                  <div className="text-2xl font-bold text-[#1c1917] mb-1">100+</div>
                  <div className="text-xs text-[#a8a29e]">Buildings Tracked</div>
                </div>
                <div className="bg-[#faf9f7] p-4 rounded-xl border border-[#ede8e0]">
                  <div className="text-2xl font-bold text-[#1c1917] mb-1">40+</div>
                  <div className="text-xs text-[#a8a29e]">Landlords Profiled</div>
                </div>
                <div className="bg-[#faf9f7] p-4 rounded-xl border border-[#ede8e0]">
                  <div className="text-2xl font-bold text-[#dc2626] mb-1">500+</div>
                  <div className="text-xs text-[#a8a29e]">Violations Logged</div>
                </div>
                <div className="bg-[#faf9f7] p-4 rounded-xl border border-[#ede8e0]">
                  <div className="text-2xl font-bold text-[#16a34a] mb-1">4.2/5</div>
                  <div className="text-xs text-[#a8a29e]">Avg Rating System</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#c2410c] uppercase tracking-wider mb-3">Resources</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-4">Renter Resources & Guides</h2>
            <p className="text-lg text-[#57534e] max-w-2xl mx-auto">Expert advice on negotiating rent, understanding your rights, and making smarter housing decisions.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/blog" className="text-[#c2410c] font-semibold hover:text-[#9a3412] transition-colors inline-flex items-center gap-1">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* Data Sources Trust Bar */}
      <section className="py-12 bg-white border-y border-[#e2ddd5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-[#a8a29e] uppercase tracking-wider">Powered by Trusted Data Sources</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-[#a8a29e]">
              <Database className="w-5 h-5 text-[#57534e]" />
              <span className="text-sm font-medium">HUD Fair Market Rent</span>
            </div>
            <div className="flex items-center gap-2 text-[#a8a29e]">
              <Globe className="w-5 h-5 text-[#57534e]" />
              <span className="text-sm font-medium">Census Bureau ACS</span>
            </div>
            <div className="flex items-center gap-2 text-[#a8a29e]">
              <Building2 className="w-5 h-5 text-[#57534e]" />
              <span className="text-sm font-medium">Local Housing Authorities</span>
            </div>
            <div className="flex items-center gap-2 text-[#a8a29e]">
              <Shield className="w-5 h-5 text-[#57534e]" />
              <span className="text-sm font-medium">Public Violation Records</span>
            </div>
            <div className="flex items-center gap-2 text-[#a8a29e]">
              <Lock className="w-5 h-5 text-[#57534e]" />
              <span className="text-sm font-medium">Encrypted & Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA with image */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80&auto=format&fit=crop"
            alt="Modern apartment buildings"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f7]/95 via-[#faf9f7]/90 to-[#faf9f7]/95" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-4">
            Ready to Stop Overpaying?
          </h2>
          <p className="text-lg text-[#57534e] mb-8">
            Join thousands of renters who use data to negotiate better deals. Check your rent for free in 30 seconds.
          </p>
          <Link
            href="/rent-checker"
            className="btn-gold px-10 py-4 text-lg inline-flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Check Your Rent Now
          </Link>
        </div>
      </section>
    </>
  );
}
