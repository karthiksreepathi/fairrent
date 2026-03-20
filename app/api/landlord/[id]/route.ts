import { NextRequest, NextResponse } from "next/server";
import { getLandlordById } from "@/data/landlords";
import { getBuildingsByLandlord } from "@/data/buildings";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Landlord ID is required" },
        { status: 400 }
      );
    }

    const landlord = getLandlordById(id);

    if (!landlord) {
      return NextResponse.json(
        { error: "Landlord not found" },
        { status: 404 }
      );
    }

    const buildings = getBuildingsByLandlord(id);

    return NextResponse.json({
      landlord,
      buildings: buildings.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        citySlug: b.citySlug,
        neighborhood: b.neighborhood,
        units: b.units,
        ratings: { overall: b.ratings.overall },
        avgRent1Bed: b.avgRent1Bed,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve landlord data" },
      { status: 500 }
    );
  }
}
