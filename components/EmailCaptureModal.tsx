"use client";

import { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, Loader2, Mail, User, Sparkles } from "lucide-react";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  onSubmit?: (email: string, name: string) => void;
}

const INTEREST_OPTIONS = [
  "Rent Fairness Score",
  "Negotiation Tools",
  "Market Alerts",
  "Building Intelligence",
] as const;

export default function EmailCaptureModal({
  isOpen,
  onClose,
  featureName,
  onSubmit,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, interests }),
      });

      if (res.ok) {
        localStorage.setItem("fairrent_email", email);
        setStatus("success");
        onSubmit?.(email, name);
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#ede8e0]/30 shadow-2xl animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#f5f3ef]/60 transition-colors text-[#a8a29e] hover:text-[#1c1917]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 border border-[#16a34a]/20 flex items-center justify-center animate-fade-in">
              <CheckCircle className="w-8 h-8 text-[#16a34a]" />
            </div>
            <h3 className="text-xl font-bold text-[#1c1917] mb-2">You are all set!</h3>
            <p className="text-sm text-[#57534e] mb-6 leading-relaxed">
              Welcome to FairRent. You now have full access to all features.
            </p>
            <button
              onClick={onClose}
              className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] shadow-sm px-8 py-3 text-sm"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] border border-[#c2410c]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#c2410c]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1c1917]">
                  {featureName ? `Unlock ${featureName}` : "Get Free Access"}
                </h3>
              </div>
            </div>
            <p className="text-sm text-[#57534e] mb-6 mt-2 leading-relaxed">
              Enter your email to unlock premium features, personalized insights, and market alerts.
            </p>

            {/* Email Field */}
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-orange-100 text-sm"
                />
              </div>

              {/* Name Field */}
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-orange-100 text-sm"
                />
              </div>
            </div>

            {/* Interest Checkboxes */}
            <div className="mt-5">
              <p className="text-xs font-medium text-[#a8a29e] mb-3 uppercase tracking-wider">
                I am interested in
              </p>
              <div className="grid grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <label
                    key={interest}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all text-xs font-medium ${
                      interests.includes(interest)
                        ? "border-[#c2410c]/40 bg-[#f5f3ef] text-[#c2410c]"
                        : "border-[#e2ddd5] bg-white/50 text-[#57534e] hover:border-[#ede8e0]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                      className="sr-only"
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        interests.includes(interest)
                          ? "bg-[#c2410c] border-[#c2410c]"
                          : "border-[#a8a29e]"
                      }`}
                    >
                      {interests.includes(interest) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="leading-tight">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {status === "error" && (
              <div className="mt-4 px-3 py-2 rounded-lg bg-red-50 border border-[#dc2626]/20 animate-fade-in">
                <p className="text-xs text-[#dc2626]">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="w-full bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] shadow-sm py-3.5 text-sm mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Free Access"
              )}
            </button>

            {/* Privacy Note */}
            <p className="text-xs text-[#a8a29e] text-center mt-4 leading-relaxed">
              No spam, ever. Unsubscribe anytime. Your data stays private.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
