import { NextRequest, NextResponse } from "next/server";
import { getBuildingById } from "@/data/buildings";
import { getLandlordById } from "@/data/landlords";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Building ID is required" },
        { status: 400 }
      );
    }

    const building = getBuildingById(id);

    if (!building) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    const landlord = getLandlordById(building.landlordId);

    return NextResponse.json({
      building,
      landlord: landlord
        ? {
            id: landlord.id,
            name: landlord.name,
            type: landlord.type,
            avgRentIncrease: landlord.avgRentIncrease,
            ratings: { overall: landlord.ratings.overall },
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve building data" },
      { status: 500 }
    );
  }
}
