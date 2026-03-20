import { NextRequest, NextResponse } from "next/server";
import { calculateDeepFairnessScore } from "@/lib/fairness-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      citySlug,
      currentRent,
      bedrooms,
      sqft,
      floorLevel,
      amenities,
      buildingAge,
      neighborhood,
    } = body;

    if (!citySlug || !currentRent || bedrooms === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: citySlug, currentRent, bedrooms" },
        { status: 400 }
      );
    }

    const result = calculateDeepFairnessScore({
      citySlug,
      currentRent: Number(currentRent),
      bedrooms: Number(bedrooms),
      sqft: sqft ? Number(sqft) : undefined,
      floorLevel,
      hasAmenities: amenities,
      buildingAge: buildingAge ? Number(buildingAge) : undefined,
      neighborhood,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate fairness score" },
      { status: 500 }
    );
  }
}
