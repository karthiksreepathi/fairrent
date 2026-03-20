"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2, Send } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2.5 py-3.5 px-5 bg-green-50 border border-[#16a34a]/20 rounded-xl animate-fade-in">
        <CheckCircle className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
        <span className="text-[#16a34a] text-sm font-medium">
          You&apos;re in! Check your inbox for a welcome email.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3.5 bg-white border border-[#e2ddd5] rounded-xl focus:border-[#c2410c] focus:ring-2 focus:ring-orange-100 text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] shadow-sm px-6 py-3.5 text-sm flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Get Updates
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <div className="flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-[#dc2626] flex-shrink-0" />
          <p className="text-[#dc2626] text-xs">
            Something went wrong. Please try again.
          </p>
        </div>
      )}
    </form>
  );
}
