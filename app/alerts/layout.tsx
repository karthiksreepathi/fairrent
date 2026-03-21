import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent Alerts | Price Drop & New Listing Notifications",
  description: "Set up personalized rent alerts for price drops, new listings, and market changes in your target neighborhoods. Free for all renters.",
  alternates: { canonical: "https://farerent.com/alerts" },
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
