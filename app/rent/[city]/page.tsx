import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cities, getCityBySlug } from "@/data/cities";
import { getBuildingsByCity } from "@/data/buildings";
import { formatCurrency, formatPercentage, getMarketCondition } from "@/lib/rent-calculator";
import { generateCitySchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import { getStaticFmrData } from "@/lib/hud-api";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Shield,
  Building2,
  Star,
  ChevronRight,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export async function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) return { title: "City Not Found" };

  return {
    title: `Average Rent in ${city.name}, ${city.stateCode} (2026) | Prices by Neighborhood`,
    description: city.metaDescription,
    alternates: { canonical: `https://farerent.com/rent/${city.slug}` },
    openGraph: {
      title: `Rent Prices in ${city.name}, ${city.stateCode} | FairRent`,
      description: city.metaDescription,
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const market = getMarketCondition(city.yoyChange, city.vacancyRate);
  const otherCities = cities.filter((c) => c.slug !== city.slug).slice(0, 4);
  const cityBuildings = getBuildingsByCity(city.slug).slice(0, 4);
  const fmrData = getStaticFmrData(city.slug);

  const trendColor = city.yoyChange < 0 ? "text-[#16a34a]" : city.yoyChange < 2 ? "text-amber-400" : "text-[#dc2626]";
  const TrendIcon = city.yoyChange < 0 ? TrendingDown : TrendingUp;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateCitySchema(city)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Rent Checker", url: "/rent-checker" },
              { name: `${city.name}, ${city.stateCode}`, url: `/rent/${city.slug}` },
            ])
          ),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#a8a29e] mb-6">
            <Link href="/" className="hover:text-[#c2410c] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/rent-checker" className="hover:text-[#c2410c] transition-colors">Rent Checker</Link>
            <span>/</span>
            <span className="text-[#1c1917] font-medium">{city.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] mb-2">
                Average Rent in {city.name}, {city.stateCode}
              </h1>
              <p className="text-[#57534e] max-w-2xl">{city.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
              <span className={`text-lg font-bold ${trendColor}`}>
                {formatPercentage(city.yoyChange)}
              </span>
              <span className="text-sm text-[#a8a29e]">YoY</span>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#faf9f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">Studio</div>
              <div className="text-xl font-bold text-[#1c1917]">{formatCurrency(city.avgRentStudio)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#0d9488]/20 p-4 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">1-Bedroom</div>
              <div className="text-xl font-bold text-[#c2410c]">{formatCurrency(city.avgRent1Bed)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">2-Bedroom</div>
              <div className="text-xl font-bold text-[#1c1917]">{formatCurrency(city.avgRent2Bed)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] p-4 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">3-Bedroom</div>
              <div className="text-xl font-bold text-[#1c1917]">{formatCurrency(city.avgRent3Bed)}</div>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h2 className="text-lg font-bold text-[#1c1917] mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#c2410c]" />
                Market Overview
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Year-over-Year Change", value: formatPercentage(city.yoyChange), color: trendColor },
                  { label: "Vacancy Rate", value: `${city.vacancyRate}%`, color: "text-[#1c1917]" },
                  { label: "Renter Population", value: `${city.renterPercentage}%`, color: "text-[#1c1917]" },
                  { label: "Median Income", value: `${formatCurrency(city.medianIncome)}/yr`, color: "text-[#1c1917]" },
                  { label: "Rent-to-Income Ratio", value: `${city.rentToIncomeRatio}%`, color: city.rentToIncomeRatio > 30 ? "text-[#dc2626]" : "text-[#16a34a]" },
                  { label: "Cost of Living Index", value: `${city.costOfLivingIndex} (US avg: 100)`, color: "text-[#1c1917]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#e2ddd5]/50">
                    <span className="text-sm text-[#57534e]">{label}</span>
                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6">
              <h2 className="text-lg font-bold text-[#1c1917] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#c2410c]" />
                Market Condition
              </h2>
              <div className={`p-4 rounded-xl border mb-4 ${market.color === "text-green-600" ? "bg-green-50 border-green-200" : market.color === "text-yellow-600" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                <div className={`text-lg font-bold mb-1 ${market.color === "text-green-600" ? "text-[#16a34a]" : market.color === "text-yellow-600" ? "text-amber-400" : "text-[#dc2626]"}`}>
                  {market.condition}
                </div>
                <p className="text-sm text-[#57534e]">{market.description}</p>
              </div>

              <h3 className="text-sm font-bold text-[#1c1917] mb-3">Tenant Protections</h3>
              <ul className="space-y-2">
                {city.tenantProtections.map((protection, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-[#57534e]">{protection}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* HUD Fair Market Rent */}
          {fmrData && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 mb-10">
              <h2 className="text-lg font-bold text-[#1c1917] mb-1 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#c2410c]" />
                HUD Fair Market Rent ({fmrData.year})
              </h2>
              <p className="text-xs text-[#a8a29e] mb-4">
                Fair Market Rent (FMR) is set by the U.S. Department of Housing and Urban Development for the {fmrData.metroArea} metro area.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Studio", value: fmrData.efficiency },
                  { label: "1-Bed", value: fmrData.oneBedroom },
                  { label: "2-Bed", value: fmrData.twoBedroom },
                  { label: "3-Bed", value: fmrData.threeBedroom },
                  { label: "4-Bed", value: fmrData.fourBedroom },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#f5f3ef] rounded-lg p-3 text-center border border-[#e2ddd5]/50">
                    <div className="text-xs text-[#a8a29e] mb-1">{label}</div>
                    <div className="text-base font-bold text-[#1c1917]">{formatCurrency(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Neighborhoods */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#1c1917] mb-6">
              Rent by Neighborhood in {city.name}
            </h2>
            <div className="space-y-3">
              {city.neighborhoods.map((n) => (
                <div key={n.name} className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 p-5 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1c1917]">{n.name}</h3>
                      <p className="text-sm text-[#57534e] mt-1">{n.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-[#a8a29e]">Walk Score: {n.walkScore}</span>
                        <span className="text-xs text-[#a8a29e]">Safety: {n.safetyRating}/10</span>
                      </div>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="px-3">
                        <div className="text-xs text-[#a8a29e]">1-Bed</div>
                        <div className="text-lg font-bold text-[#c2410c]">{formatCurrency(n.avgRent1Bed)}</div>
                      </div>
                      <div className="px-3">
                        <div className="text-xs text-[#a8a29e]">2-Bed</div>
                        <div className="text-lg font-bold text-[#1c1917]">{formatCurrency(n.avgRent2Bed)}</div>
                      </div>
                      <div className="px-3">
                        <div className="text-xs text-[#a8a29e]">3-Bed</div>
                        <div className="text-lg font-bold text-[#1c1917]">{formatCurrency(n.avgRent3Bed)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buildings in this City */}
          {cityBuildings.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1c1917] flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-[#c2410c]" />
                  Buildings in {city.name}
                </h2>
                <Link href="/buildings" className="text-sm text-[#c2410c] hover:text-[#c2410c] transition-colors flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {cityBuildings.map((b) => {
                  const openV = b.violations.filter((v) => v.status === "open").length;
                  return (
                    <Link key={b.id} href={`/building/${b.id}`} className="group block">
                      <div className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 p-5 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-[#1c1917] group-hover:text-[#c2410c] transition-colors truncate">
                              {b.name}
                            </h4>
                            <div className="flex items-center gap-1 mt-1 text-xs text-[#a8a29e]">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{b.neighborhood}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-medium text-[#1c1917]">{b.ratings.overall.toFixed(1)}</span>
                              </div>
                              <span className="text-xs text-[#a8a29e]">{b.units} units</span>
                              {openV > 0 && (
                                <span className="text-xs text-[#dc2626] font-medium">{openV} violations</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-bold text-[#c2410c]">{formatCurrency(b.avgRent1Bed)}</div>
                            <div className="text-xs text-[#a8a29e]">1-bed avg</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 mb-10 border-l-4 border-l-[#c2410c]">
            <h2 className="text-xl font-bold text-[#1c1917] mb-4">Tips for Renting in {city.name}</h2>
            <ul className="space-y-3">
              {city.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c2410c] text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[#57534e]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center bg-white rounded-2xl shadow-sm border border-[#0d9488]/20 p-8 mb-10">
            <h2 className="text-2xl font-bold text-[#1c1917] mb-3">Check Your Rent in {city.name}</h2>
            <p className="text-[#57534e] mb-6">Enter your current rent to see if you are getting a fair deal.</p>
            <Link href="/rent-checker" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md px-8 py-3 text-sm inline-flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Use Rent Checker
            </Link>
          </div>

          {/* Related Cities */}
          <div>
            <h2 className="text-xl font-bold text-[#1c1917] mb-4">Compare Other Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherCities.map((c) => (
                <Link key={c.slug} href={`/rent/${c.slug}`} className="bg-white rounded-xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 p-4 text-center transition-all">
                  <div className="font-semibold text-sm text-[#1c1917]">{c.name}</div>
                  <div className="text-lg font-bold text-[#c2410c] mt-1">{formatCurrency(c.avgRent1Bed)}</div>
                  <div className="text-xs text-[#a8a29e]">1-bed avg</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
