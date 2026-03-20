import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "FairRent privacy policy. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-[#1c1917] mb-8">Privacy Policy</h1>
      <p className="text-sm text-[#a8a29e] mb-8">Last updated: March 19, 2026</p>

      <div className="prose prose-stone max-w-none space-y-6 text-[#57534e] text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">1. Information We Collect</h2>
          <p>FairRent collects minimal information to provide our services:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Email address</strong> - When you subscribe to our newsletter or set up rent alerts. This is voluntary.</li>
            <li><strong>Usage data</strong> - Anonymous analytics about how you use the site (pages visited, features used). We use Google Analytics.</li>
            <li><strong>Search inputs</strong> - City selections, rent amounts, and other form inputs you provide when using our tools. These are processed in real-time and not permanently stored with your identity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide rent analysis, fairness scores, and market data</li>
            <li>To send newsletter updates and rent alerts (only if you opt in)</li>
            <li>To improve our services through anonymous usage analytics</li>
          </ul>
          <p className="mt-2">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">3. Data Sources</h2>
          <p>FairRent uses data from publicly available government sources including:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>U.S. Census Bureau American Community Survey (ACS)</li>
            <li>HUD Fair Market Rent data</li>
            <li>RentCast API for rental listings and estimates</li>
            <li>Public building violation records</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">4. Cookies and Local Storage</h2>
          <p>We use browser local storage to remember your email preference (so you do not have to re-enter it) and your alert settings. We use cookies for analytics (Google Analytics). You can clear these at any time through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">5. Email Communications</h2>
          <p>If you subscribe to our newsletter or rent alerts, you can unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us. We comply with the CAN-SPAM Act.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">6. Data Security</h2>
          <p>We use industry-standard security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Access the personal information we hold about you</li>
            <li>Request deletion of your email from our systems</li>
            <li>Opt out of communications at any time</li>
            <li>Clear local storage data through your browser</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">8. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">9. Contact</h2>
          <p>For questions about this privacy policy, contact us at privacy@fairrent.app.</p>
        </section>
      </div>
    </div>
  );
}
