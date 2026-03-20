"use client";

import { useState, useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";
import EmailCaptureModal from "./EmailCaptureModal";

interface PremiumGateProps {
  children: React.ReactNode;
  featureName: string;
  previewMode?: "blur" | "fade";
  className?: string;
}

export default function PremiumGate({
  children,
  featureName,
  previewMode = "blur",
  className = "",
}: PremiumGateProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedEmail = localStorage.getItem("fairrent_email");
    if (storedEmail) {
      setHasAccess(true);
    }
  }, []);

  const handleEmailSubmitted = () => {
    setHasAccess(true);
    setIsModalOpen(false);
  };

  // Avoid hydration mismatch by not rendering gate until mounted
  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Preview Content with Blur or Fade */}
        <div
          className={`pointer-events-none select-none ${
            previewMode === "blur"
              ? "filter blur-[6px]"
              : "opacity-30"
          }`}
          aria-hidden="true"
        >
          {children}
        </div>

        {/* Overlay CTA Card */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#ede8e0]/30 p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in">
            {/* Lock Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f5f3ef] border border-[#c2410c]/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#c2410c]" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-[#1c1917] mb-2">
              Unlock {featureName}
            </h3>

            {/* Description */}
            <p className="text-sm text-[#57534e] mb-6 leading-relaxed">
              Get free access to {featureName} and all premium features with just your email. No credit card needed.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] shadow-sm px-6 py-3 text-sm inline-flex items-center gap-2 animate-pulse-glow"
            >
              <Sparkles className="w-4 h-4" />
              Get Free Access
            </button>

            {/* Social Proof */}
            <p className="text-xs text-[#a8a29e] mt-4">
              Trusted by 50,000+ renters
            </p>
          </div>
        </div>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        featureName={featureName}
        onSubmit={handleEmailSubmitted}
      />
    </>
  );
}
