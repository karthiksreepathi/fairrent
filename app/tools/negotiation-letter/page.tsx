"use client";

import { useState } from "react";
import { cities } from "@/data/cities";
import { FileText, Copy, CheckCircle, ChevronRight, ChevronLeft, Shield } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import Link from "next/link";

type Tone = "professional" | "firm" | "friendly";
type LetterType = "reduction" | "renewal" | "initial";

interface FormData {
  tenantName: string;
  landlordName: string;
  propertyAddress: string;
  currentRent: string;
  proposedRent: string;
  citySlug: string;
  bedrooms: string;
  yearsAsTenant: string;
  tone: Tone;
  letterType: LetterType;
}

export default function NegotiationLetterPage() {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tenantName: "",
    landlordName: "",
    propertyAddress: "",
    currentRent: "",
    proposedRent: "",
    citySlug: "",
    bedrooms: "1",
    yearsAsTenant: "1",
    tone: "professional",
    letterType: "reduction",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedCity = cities.find((c) => c.slug === formData.citySlug);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/negotiation-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          currentRent: Number(formData.currentRent),
          proposedRent: formData.proposedRent ? Number(formData.proposedRent) : undefined,
          bedrooms: Number(formData.bedrooms),
          yearsAsTenant: Number(formData.yearsAsTenant),
          marketAvgRent: selectedCity?.avgRent1Bed || 1500,
        }),
      });
      const data = await res.json();
      setGeneratedLetter(data.body || data.letter || "Unable to generate letter. Please try again.");
      setStep(4);
    } catch {
      setGeneratedLetter("Unable to generate letter. Please check your inputs and try again.");
      setStep(4);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#e2ddd5] text-xs font-medium text-[#c2410c] mb-4">
            <FileText className="w-3.5 h-3.5" />
            NEGOTIATION TOOL
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-3">
            Negotiation Letter <span className="text-[#c2410c] font-bold">Generator</span>
          </h1>
          <p className="text-[#57534e]">
            Create a professional, data-backed letter to negotiate your rent in minutes. Free to use.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? "bg-[#c2410c] text-white"
                    : "bg-[#f5f3ef] text-[#a8a29e] border border-[#e2ddd5]"
                }`}
              >
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-12 h-0.5 ${step > s ? "bg-[#c2410c]" : "bg-[#e2ddd5]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Your Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#1c1917] mb-6">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  className="input-dark w-full px-4 py-3"
                  placeholder="John Smith"
                  value={formData.tenantName}
                  onChange={(e) => updateField("tenantName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Landlord / Management Company Name</label>
                <input
                  type="text"
                  className="input-dark w-full px-4 py-3"
                  placeholder="Property Management LLC"
                  value={formData.landlordName}
                  onChange={(e) => updateField("landlordName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">Property Address</label>
                <input
                  type="text"
                  className="input-dark w-full px-4 py-3"
                  placeholder="123 Main St, Apt 4B"
                  value={formData.propertyAddress}
                  onChange={(e) => updateField("propertyAddress", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#57534e] mb-1.5">Current Monthly Rent</label>
                  <input
                    type="number"
                    className="input-dark w-full px-4 py-3"
                    placeholder="2000"
                    value={formData.currentRent}
                    onChange={(e) => updateField("currentRent", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#57534e] mb-1.5">Years as Tenant</label>
                  <CustomSelect
                    value={formData.yearsAsTenant}
                    onChange={(val) => updateField("yearsAsTenant", val)}
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => ({
                      value: String(y),
                      label: `${y} ${y === 1 ? "year" : "years"}`,
                    }))}
                    placeholder="Select years..."
                  />
                </div>
              </div>
              <button
                className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md w-full py-3 text-sm flex items-center justify-center gap-2 mt-4"
                onClick={() => setStep(2)}
                disabled={!formData.tenantName || !formData.currentRent}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Market Context */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#1c1917] mb-6">Market Context</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1.5">City</label>
                <CustomSelect
                  value={formData.citySlug}
                  onChange={(val) => updateField("citySlug", val)}
                  options={cities.map((city) => ({ value: city.slug, label: `${city.name}, ${city.stateCode}` }))}
                  placeholder="Select your city"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#57534e] mb-1.5">Bedrooms</label>
                  <CustomSelect
                    value={formData.bedrooms}
                    onChange={(val) => updateField("bedrooms", val)}
                    options={[
                      { value: "0", label: "Studio" },
                      { value: "1", label: "1 Bedroom" },
                      { value: "2", label: "2 Bedrooms" },
                      { value: "3", label: "3 Bedrooms" },
                    ]}
                    placeholder="Select bedrooms..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#57534e] mb-1.5">Desired Rent (Optional)</label>
                  <input
                    type="number"
                    className="input-dark w-full px-4 py-3"
                    placeholder="1800"
                    value={formData.proposedRent}
                    onChange={(e) => updateField("proposedRent", e.target.value)}
                  />
                </div>
              </div>
              {selectedCity && (
                <div className="bg-[#f5f3ef] rounded-xl p-4 border border-[#e2ddd5]">
                  <div className="text-xs text-[#a8a29e] mb-2">Market Data for {selectedCity.name}</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-lg font-bold text-[#c2410c]">
                        ${selectedCity.avgRent1Bed.toLocaleString()}
                      </div>
                      <div className="text-xs text-[#a8a29e]">Avg 1-Bed Rent</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${selectedCity.yoyChange > 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
                        {selectedCity.yoyChange > 0 ? "+" : ""}{selectedCity.yoyChange}%
                      </div>
                      <div className="text-xs text-[#a8a29e]">Year over Year</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#1c1917]">{selectedCity.vacancyRate}%</div>
                      <div className="text-xs text-[#a8a29e]">Vacancy Rate</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <button className="btn-outline flex-1 py-3 text-sm flex items-center justify-center gap-2" onClick={() => setStep(1)}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md flex-1 py-3 text-sm flex items-center justify-center gap-2"
                  onClick={() => setStep(3)}
                  disabled={!formData.citySlug}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Customize */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#1c1917] mb-6">Customize Your Letter</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-3">Letter Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["reduction", "renewal", "initial"] as LetterType[]).map((type) => (
                    <button
                      key={type}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        formData.letterType === type
                          ? "border-[#c2410c] bg-[#f5f3ef] text-[#c2410c]"
                          : "border-[#e2ddd5] bg-white text-[#a8a29e] hover:border-[#ede8e0]"
                      }`}
                      onClick={() => updateField("letterType", type)}
                    >
                      {type === "reduction" ? "Rent Reduction" : type === "renewal" ? "Lease Renewal" : "New Negotiation"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-3">Tone</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["professional", "firm", "friendly"] as Tone[]).map((tone) => (
                    <button
                      key={tone}
                      className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                        formData.tone === tone
                          ? "border-[#c2410c] bg-[#f5f3ef] text-[#c2410c]"
                          : "border-[#e2ddd5] bg-white text-[#a8a29e] hover:border-[#ede8e0]"
                      }`}
                      onClick={() => updateField("tone", tone)}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-outline flex-1 py-3 text-sm flex items-center justify-center gap-2" onClick={() => setStep(2)}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  className="bg-[#0d9488] text-white font-semibold rounded-xl hover:bg-[#0f766e] transition-all flex-1 py-3 text-sm flex items-center justify-center gap-2"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {loading ? "Generating..." : "Generate Letter"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && generatedLetter && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#1c1917]">Your Negotiation Letter</h2>
                <button
                  className="btn-outline px-4 py-2 text-sm flex items-center gap-2"
                  onClick={handleCopy}
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-[#16a34a]" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-[#f5f3ef] rounded-xl p-6 border border-[#e2ddd5]">
                <pre className="whitespace-pre-wrap text-sm text-[#57534e] font-sans leading-relaxed">
                  {generatedLetter}
                </pre>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-outline flex-1 py-3 text-sm" onClick={() => setStep(3)}>
                Edit & Regenerate
              </button>
              <Link href="/tools" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md flex-1 py-3 text-sm text-center inline-flex items-center justify-center gap-2">
                Explore More Tools
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
