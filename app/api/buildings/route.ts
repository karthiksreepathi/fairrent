import { NextRequest, NextResponse } from "next/server";
import { buildings, getBuildingsByCity } from "@/data/buildings";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "";
    const type = searchParams.get("type") || "";
    const sort = searchParams.get("sort") || "rating";

    let results = city ? getBuildingsByCity(city) : [...buildings];

    // Filter by type
    if (type) {
      results = results.filter((b) => b.type === type);
    }

    // Sort
    switch (sort) {
      case "rating":
        results.sort((a, b) => b.ratings.overall - a.ratings.overall);
        break;
      case "rent-low":
        results.sort((a, b) => a.avgRent1Bed - b.avgRent1Bed);
        break;
      case "rent-high":
        results.sort((a, b) => b.avgRent1Bed - a.avgRent1Bed);
        break;
      case "newest":
        results.sort((a, b) => b.yearBuilt - a.yearBuilt);
        break;
    }

    return NextResponse.json({
      buildings: results.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        citySlug: b.citySlug,
        neighborhood: b.neighborhood,
        type: b.type,
        ratings: { overall: b.ratings.overall, reviewCount: b.ratings.reviewCount },
        violations: b.violations.map((v) => ({ status: v.status })),
        avgRent1Bed: b.avgRent1Bed,
        amenities: b.amenities,
        units: b.units,
        stories: b.stories,
        yearBuilt: b.yearBuilt,
      })),
      total: results.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve buildings" },
      { status: 500 }
    );
  }
}
