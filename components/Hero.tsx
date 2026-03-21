"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cities } from "@/data/cities";
import { Home, Shield, MapPin, ChevronRight } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function Hero() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity) {
      router.push(`/rent/${selectedCity}`);
    }
  };

  const cityOptions = cities.map((city) => ({
    value: city.slug,
    label: `${city.name}, ${city.stateCode}`,
  }));

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80&auto=format&fit=crop"
          alt="Modern apartment living room"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f7]/92 via-[#faf9f7]/88 to-[#faf9f7]/95" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 grid-bg-animated opacity-40" />

      {/* Warm Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c2410c]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#0d9488]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/80 backdrop-blur-sm border border-[#e2ddd5] rounded-full shadow-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-[#16a34a] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#57534e]">
              Free for all US renters
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#1c1917] leading-tight mb-6 animate-slide-up">
            Know the Real{" "}
            <span className="gradient-text">Fare</span>
            <br />
            <span className="text-[#57534e] font-bold text-3xl sm:text-4xl lg:text-5xl">
              Before You Sign the Lease.
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-lg sm:text-xl text-[#57534e] max-w-2xl mx-auto mb-12 animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            Compare what renters actually pay in your neighborhood,
            powered by real government data. No sign-up, no fees, just the truth.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="max-w-xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white/90 backdrop-blur-sm border border-[#e2ddd5] rounded-2xl shadow-lg shadow-stone-900/[0.06]">
              <div className="flex-1">
                <CustomSelect
                  value={selectedCity}
                  onChange={setSelectedCity}
                  options={cityOptions}
                  placeholder="Select your city..."
                  icon={<MapPin className="w-5 h-5" />}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!selectedCity}
                className="btn-premium px-8 py-3.5 text-sm sm:text-base flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check My Rent
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div
            className="flex flex-wrap items-center justify-center gap-8 mt-12 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center gap-2.5 text-[#57534e]">
              <div className="w-8 h-8 rounded-lg bg-[#16a34a]/10 flex items-center justify-center">
                <Home className="w-4 h-4 text-[#16a34a]" />
              </div>
              <span className="text-sm font-medium">100% Free</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#57534e]">
              <div className="w-8 h-8 rounded-lg bg-[#0d9488]/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#0d9488]" />
              </div>
              <span className="text-sm font-medium">No Sign-up Required</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#57534e]">
              <div className="w-8 h-8 rounded-lg bg-[#c2410c]/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#c2410c]" />
              </div>
              <span className="text-sm font-medium">20+ Major Cities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
