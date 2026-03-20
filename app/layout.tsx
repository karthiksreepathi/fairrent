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
    default: "FairRent - Is Your Rent Fair? Free Rent Checker for Renters",
    template: "%s | FairRent",
  },
  description:
    "FairRent is a free tool that helps everyday renters check if their rent is fair. Compare rent prices, know your tenant rights, and get a fair deal. Powered by real government data.",
  metadataBase: new URL("https://fairrent.app"),
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
  authors: [{ name: "FairRent" }],
  creator: "FairRent",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fairrent.app",
    siteName: "FairRent",
    title: "FairRent: Is Your Rent Fair? Check for Free",
    description: "Free tool for renters. Compare rent prices, check your rights, and make sure you are paying a fair price. Powered by real data.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FairRent: Is Your Rent Fair? Check for Free",
    description: "Free tool for renters. Compare rent prices and make sure you are paying a fair price.",
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
              FairRent provides data for informational purposes only and does not constitute financial, legal, or real estate advice.
              Rent estimates are based on available market data and may not reflect your exact situation. Always verify independently before making housing decisions.
            </p>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
