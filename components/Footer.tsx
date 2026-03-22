import Link from "next/link";
import { Home } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const cityLinks = [
    { name: "New York", href: "/rent/new-york" },
    { name: "Los Angeles", href: "/rent/los-angeles" },
    { name: "Chicago", href: "/rent/chicago" },
    { name: "Houston", href: "/rent/houston" },
    { name: "Phoenix", href: "/rent/phoenix" },
    { name: "San Francisco", href: "/rent/san-francisco" },
    { name: "Seattle", href: "/rent/seattle" },
    { name: "Austin", href: "/rent/austin" },
    { name: "Denver", href: "/rent/denver" },
    { name: "Miami", href: "/rent/miami" },
  ];

  return (
    <footer className="bg-[#f5f3ef] border-t border-[#e2ddd5]">
      {/* Newsletter Section */}
      <div className="border-b border-[#e2ddd5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-[#1c1917] mb-2">Stay Ahead of Rent Trends</h3>
            <p className="text-[#a8a29e] mb-6">
              Get monthly rent market insights, negotiation tips, and tenant rights updates delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-[#1c1917] mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/rent-checker" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Rent Checker</Link></li>
              <li><Link href="/buildings" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Building Search</Link></li>
              <li><Link href="/pricing" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Blog</Link></li>
              <li><Link href="/about" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-[#1c1917] mb-4 uppercase tracking-wider">Tools</h4>
            <ul className="space-y-3">
              <li><Link href="/tools/negotiation-letter" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Negotiation Letter</Link></li>
              <li><Link href="/tools/move-calculator" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Move Calculator</Link></li>
              <li><Link href="/tools/lease-analyzer" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Lease Analyzer</Link></li>
              <li><Link href="/tools/comparables" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Find Comparables</Link></li>
              <li><Link href="/alerts" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Rent Alerts</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="text-sm font-semibold text-[#1c1917] mb-4 uppercase tracking-wider">Top Cities</h4>
            <ul className="space-y-3">
              {cityLinks.slice(0, 5).map((city) => (
                <li key={city.href}>
                  <Link href={city.href} className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Cities */}
          <div>
            <h4 className="text-sm font-semibold text-[#1c1917] mb-4 uppercase tracking-wider">More Cities</h4>
            <ul className="space-y-3">
              {cityLinks.slice(5).map((city) => (
                <li key={city.href}>
                  <Link href={city.href} className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-[#1c1917] mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/blog/is-my-rent-fair-how-to-check" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Is My Rent Fair?</Link></li>
              <li><Link href="/blog/tenant-rights-what-landlord-doesnt-want-you-to-know" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Tenant Rights Guide</Link></li>
              <li><Link href="/blog/how-to-negotiate-your-rent" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Negotiate Your Rent</Link></li>
              <li><Link href="/blog/best-cities-for-renters-2026" className="text-sm text-[#57534e] hover:text-[#1c1917] transition-colors">Best Cities 2026</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#e2ddd5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#c2410c] rounded flex items-center justify-center">
                <Home className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#1c1917]">
                Fare<span className="gradient-text">Rent</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-[#a8a29e]">
                &copy; {new Date().getFullYear()} FareRent. Know the real fare.
              </p>
              <span className="text-[#e2ddd5]">|</span>
              <Link href="/privacy" className="text-xs text-[#a8a29e] hover:text-[#57534e] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-[#a8a29e] hover:text-[#57534e] transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
