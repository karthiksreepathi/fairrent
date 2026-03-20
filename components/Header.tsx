"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronDown, Menu, X, FileText, Calculator, BarChart3, Search, Building2, Shield } from "lucide-react";

const toolsItems = [
  { name: "Negotiation Letter", href: "/tools/negotiation-letter", icon: FileText, desc: "Generate a data-backed letter" },
  { name: "Move vs Stay Calculator", href: "/tools/move-calculator", icon: Calculator, desc: "Compare the true cost of moving" },
  { name: "Lease Renewal Analyzer", href: "/tools/lease-analyzer", icon: BarChart3, desc: "Analyze your renewal offer" },
  { name: "Find Comparables", href: "/tools/comparables", icon: Search, desc: "Find similar units at lower prices" },
  { name: "Building Intelligence", href: "/buildings", icon: Building2, desc: "Check violations and ratings" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f7]/90 backdrop-blur-xl border-b border-[#e2ddd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#c2410c] rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#c2410c]/20 transition-all">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1c1917]">
              Fair<span className="gradient-text">Rent</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/rent-checker"
              className="px-4 py-2 text-sm font-medium text-[#57534e] hover:text-[#1c1917] rounded-lg hover:bg-[#f5f3ef] transition-all"
            >
              Rent Checker
            </Link>

            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#57534e] hover:text-[#1c1917] rounded-lg hover:bg-[#f5f3ef] transition-all">
                Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-[#e2ddd5] rounded-xl shadow-lg shadow-stone-900/5 p-2 animate-fade-in">
                  {toolsItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f5f3ef] transition-colors group"
                    >
                      <item.icon className="w-5 h-5 text-[#c2410c] mt-0.5 group-hover:text-[#ea580c] transition-colors" />
                      <div>
                        <div className="text-sm font-medium text-[#1c1917]">{item.name}</div>
                        <div className="text-xs text-[#a8a29e]">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="px-4 py-2 text-sm font-medium text-[#57534e] hover:text-[#1c1917] rounded-lg hover:bg-[#f5f3ef] transition-all"
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-[#57534e] hover:text-[#1c1917] rounded-lg hover:bg-[#f5f3ef] transition-all"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-[#57534e] hover:text-[#1c1917] rounded-lg hover:bg-[#f5f3ef] transition-all"
            >
              About
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/rent-checker"
              className="btn-premium px-5 py-2.5 text-sm inline-flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Check Your Rent
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#f5f3ef] transition-colors text-[#57534e]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#e2ddd5] mt-2 pt-4 animate-fade-in">
            <div className="space-y-1">
              <Link
                href="/rent-checker"
                className="block px-4 py-3 text-sm font-medium text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f3ef] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rent Checker
              </Link>

              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-[#a8a29e] uppercase tracking-wider mb-2">Tools</div>
                <div className="space-y-1 ml-2">
                  {toolsItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f3ef] rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 text-[#c2410c]" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/blog"
                className="block px-4 py-3 text-sm font-medium text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f3ef] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/pricing"
                className="block px-4 py-3 text-sm font-medium text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f3ef] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 text-sm font-medium text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f3ef] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              <div className="pt-3 px-4">
                <Link
                  href="/rent-checker"
                  className="btn-premium w-full py-3 text-sm text-center inline-flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  Check Your Rent Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
