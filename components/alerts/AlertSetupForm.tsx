"use client";

import { useState } from "react";
import { cities } from "@/data/cities";
import { Bell, CheckCircle, Loader2 } from "lucide-react";
import type { AlertData } from "@/components/alerts/AlertCard";

interface AlertSetupFormProps {
  onAlertCreated?: () => void;
}

const STORAGE_KEY = "fairrent_alerts";

const alertTypeOptions = ["Price Drop", "New Listing", "Market Report"];

const bedroomOptions = [
  { value: 0, label: "Studio" },
  { value: 1, label: "1 BR" },
  { value: 2, label: "2 BR" },
  { value: 3, label: "3 BR" },
];

export default function AlertSetupForm({ onAlertCreated }: AlertSetupFormProps) {
  const [citySlug, setCitySlug] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Price Drop"]);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ city?: string; email?: string }>({});

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const validate = (): boolean => {
    const newErrors: { city?: string; email?: string } = {};

    if (!citySlug) {
      newErrors.city = "Please select a city.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    // Brief delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 400));

    const city = cities.find((c) => c.slug === citySlug);
    if (!city) {
      setSubmitting(false);
      return;
    }

    const newAlert: AlertData = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      citySlug: city.slug,
      cityName: `${city.name}, ${city.stateCode}`,
      maxRent: maxRent ? Number(maxRent) : 0,
      bedrooms,
      alertTypes: selectedTypes.length > 0 ? selectedTypes : ["Price Drop"],
      email,
      createdAt: new Date().toISOString(),
      active: true,
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const alerts: AlertData[] = existing ? JSON.parse(existing) : [];
      alerts.unshift(newAlert);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch {
      // Gracefully handle localStorage errors
    }

    setSubmitting(false);
    setSuccess(true);

    // Reset form after a moment
    setTimeout(() => {
      setCitySlug("");
      setMaxRent("");
      setBedrooms(1);
      setSelectedTypes(["Price Drop"]);
      setEmail("");
      setSuccess(false);
      setErrors({});
      onAlertCreated?.();
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] flex items-center justify-center">
          <Bell className="w-5 h-5 text-[#c2410c]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#1c1917]">Create New Alert</h2>
          <p className="text-xs text-[#a8a29e]">
            Choose your criteria and we will notify you when conditions are met.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-[#16a34a]/20 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#16a34a]">Alert created successfully!</p>
            <p className="text-xs text-[#16a34a]/70">
              You will receive notifications at your email when conditions match.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* City + Bedrooms */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">
              City <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={citySlug}
              onChange={(e) => {
                setCitySlug(e.target.value);
                setErrors((prev) => ({ ...prev, city: undefined }));
              }}
              className={`bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-orange-100 w-full px-4 py-3 text-sm ${
                errors.city ? "border-[#dc2626]/50" : ""
              }`}
            >
              <option value="">Select a city...</option>
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}, {c.stateCode}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-xs text-[#dc2626] mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">
              Bedrooms
            </label>
            <div className="flex gap-2">
              {bedroomOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setBedrooms(value)}
                  className={`flex-1 py-3 text-sm font-medium rounded-xl border transition-all ${
                    bedrooms === value
                      ? "bg-[#c2410c] text-white border-[#c2410c] shadow-lg shadow-[#c2410c]/20"
                      : "bg-white text-[#57534e] border-[#e2ddd5] hover:border-[#c2410c]/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Max Rent */}
        <div>
          <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">
            Max Rent (per month)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] text-sm">
              $
            </span>
            <input
              type="number"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              placeholder="e.g., 2500"
              min={0}
              className="bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-orange-100 w-full pl-7 pr-4 py-3 text-sm"
            />
          </div>
          <p className="text-xs text-[#a8a29e] mt-1">
            Leave blank for no rent limit.
          </p>
        </div>

        {/* Alert Types */}
        <div>
          <label className="block text-xs font-medium text-[#a8a29e] mb-2">
            Alert Types
          </label>
          <div className="flex flex-wrap gap-2">
            {alertTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                  selectedTypes.includes(type)
                    ? type === "Price Drop"
                      ? "bg-green-50 text-[#16a34a] border-[#16a34a]/40"
                      : type === "New Listing"
                        ? "bg-[#f5f3ef] text-[#c2410c] border-[#c2410c]/40"
                        : "bg-amber-50 text-amber-400 border-amber-500/40"
                    : "bg-white text-[#a8a29e] border-[#e2ddd5] hover:border-[#c2410c]/30"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">
            Email Address <span className="text-[#dc2626]">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="you@example.com"
            className={`bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-orange-100 w-full px-4 py-3 text-sm ${
              errors.email ? "border-[#dc2626]/50" : ""
            }`}
          />
          {errors.email && (
            <p className="text-xs text-[#dc2626] mt-1">{errors.email}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || success}
          className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] shadow-sm w-full py-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Alert...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Alert Created!
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              Create Alert
            </>
          )}
        </button>
      </form>
    </div>
  );
}
