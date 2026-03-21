import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/structured-data";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "FareRent — Know the Real Fare Before You Sign the Lease",
    template: "%s | FareRent",
  },
  description:
    "Free rent comparison tool for US renters. See what people actually pay in your neighborhood, check your tenant rights, and never overpay again. Powered by government data.",
  metadataBase: new URL("https://farerent.com"),
  keywords: [
    "rent checker",
    "is my rent fair",
    "average rent",
    "rent comparison",
    "tenant rights",
    "rent calculator",
    "apartment rent",
    "rent prices by city",
    "rent negotiation",
    "renter tools",
    "fair rent",
    "building violations",
    "rent fairness score",
    "free rent checker",
  ],
  authors: [{ name: "FareRent" }],
  creator: "FareRent",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://farerent.com",
    siteName: "FareRent",
    title: "FareRent — Know the Real Fare Before You Sign",
    description: "Free rent comparison tool. See what renters actually pay in your neighborhood and never overpay again.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FareRent — Know the Real Fare Before You Sign",
    description: "Free rent comparison tool. See what renters actually pay in your neighborhood and never overpay again.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        {/* Legal Disclaimer */}
        <div className="bg-[#f5f3ef] border-t border-[#ede8e0] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] text-[#a8a29e] text-center leading-relaxed">
              FareRent provides data for informational purposes only and does not constitute financial, legal, or real estate advice.
              Rent estimates are based on available market data and may not reflect your exact situation. Always verify independently before making housing decisions.
            </p>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
