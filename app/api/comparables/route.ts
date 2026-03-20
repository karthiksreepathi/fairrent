import { NextRequest, NextResponse } from "next/server";
import { findComparableUnits } from "@/lib/comparable-finder";
import { getComparables } from "@/lib/rentcast-api";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const citySlug = params.get("city") || "";
  const bedrooms = Number(params.get("bedrooms") || "1");
  const maxRent = params.get("maxRent")
    ? Number(params.get("maxRent"))
    : undefined;
  const noFee = params.get("noFee") === "true";
  const zipCode = params.get("zip") || "";

  if (!citySlug) {
    return NextResponse.json(
      { error: "Missing required query parameter: city" },
      { status: 400 }
    );
  }

  if (isNaN(bedrooms) || bedrooms < 0 || bedrooms > 5) {
    return NextResponse.json(
      { error: "Invalid bedrooms value. Must be a number between 0 and 5." },
      { status: 400 }
    );
  }

  try {
    // Try RentCast API first for real listing data
    const rentcastResult = await getComparables({
      citySlug,
      bedrooms,
      maxRent,
      noFee: noFee || undefined,
    });

    if (rentcastResult.source === "rentcast" && rentcastResult.listings.length > 0) {
      const rents = rentcastResult.listings.map((l) => l.rent);
      const avg = Math.round(rents.reduce((s, r) => s + r, 0) / rents.length);
      const sorted = [...rents].sort((a, b) => a - b);
      const median =
        sorted.length % 2 === 0
          ? Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2)
          : sorted[Math.floor(sorted.length / 2)];

      return NextResponse.json({
        listings: rentcastResult.listings.map((l) => ({
          id: l.id,
          address: l.address,
          neighborhood: l.neighborhood,
          bedrooms: l.bedrooms,
          bathrooms: l.bathrooms,
          sqft: l.sqft,
          rent: l.rent,
          amenities: l.amenities,
          available: l.available,
          noFee: l.noFee,
          renovated: l.buildingAge < 5,
          floorLevel: l.floorLevel,
        })),
        stats: {
          avg,
          median,
          lowest: Math.min(...rents),
          count: rentcastResult.listings.length,
        },
        source: "rentcast",
      });
    }

    // Fallback to mock data via comparable-finder
    const result = findComparableUnits({
      citySlug,
      bedrooms,
      maxRent,
      noFee: noFee || undefined,
    });

    return NextResponse.json({
      listings: result.listings.map((l) => ({
        id: l.id,
        address: l.address,
        neighborhood: l.neighborhood,
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms,
        sqft: l.sqft,
        rent: l.rent,
        amenities: l.amenities,
        available: l.available,
        noFee: l.noFee,
        renovated: l.buildingAge < 5,
        floorLevel: l.floorLevel,
      })),
      stats: {
        avg: result.averageRent,
        median: result.medianRent,
        lowest: result.lowestRent,
        count: result.count,
      },
      source: "static",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to find comparable units" },
      { status: 500 }
    );
  }
}
