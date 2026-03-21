import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building Intelligence | Apartment Reviews & Violation History",
  description: "Search apartments and buildings across 20+ US cities. View violation history, resident ratings, amenities, and average rents. Make informed decisions before you sign a lease.",
  alternates: { canonical: "https://farerent.com/buildings" },
};

export default function BuildingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
