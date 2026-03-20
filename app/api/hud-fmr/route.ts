import { NextRequest, NextResponse } from "next/server";
import { fetchFmrData, fetchFmrByZip } from "@/lib/hud-api";
import { getHudFmr } from "@/data/hud-fmr";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const citySlug = params.get("city");
  const zipCode = params.get("zip");

  if (!citySlug && !zipCode) {
    return NextResponse.json(
      { error: "Missing required query parameter: city or zip" },
      { status: 400 }
    );
  }

  try {
    // ZIP code lookup (HUD API only, more granular)
    if (zipCode) {
      const zipData = await fetchFmrByZip(zipCode);
      if (zipData) {
        return NextResponse.json({
          ...formatFmrResponse(zipData),
          source: "hud-api",
          lookupType: "zip",
        });
      }
      // If no HUD API key, fall through to city lookup
    }

    // City slug lookup (real API with mock fallback)
    if (citySlug) {
      const fmrData = await fetchFmrData(citySlug);

      if (!fmrData) {
        return NextResponse.json(
          { error: "HUD FMR data not found for the specified location" },
          { status: 404 }
        );
      }

      // Check if we used real API or mock data
      const staticData = getHudFmr(citySlug);
      const isRealData =
        staticData &&
        (fmrData.efficiency !== staticData.efficiency ||
          fmrData.year !== staticData.year);

      return NextResponse.json({
        ...formatFmrResponse(fmrData),
        source: isRealData ? "hud-api" : "static",
      });
    }

    return NextResponse.json(
      { error: "Could not retrieve FMR data" },
      { status: 404 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve HUD FMR data" },
      { status: 500 }
    );
  }
}

function formatFmrResponse(fmrData: {
  citySlug: string;
  fipsCode: string;
  metroArea: string;
  year: number;
  efficiency: number;
  oneBedroom: number;
  twoBedroom: number;
  threeBedroom: number;
  fourBedroom: number;
  medianRent: number;
  percentile40: number;
  percentile50: number;
}) {
  return {
    citySlug: fmrData.citySlug,
    fipsCode: fmrData.fipsCode,
    metroArea: fmrData.metroArea,
    year: fmrData.year,
    fairMarketRents: {
      efficiency: fmrData.efficiency,
      oneBedroom: fmrData.oneBedroom,
      twoBedroom: fmrData.twoBedroom,
      threeBedroom: fmrData.threeBedroom,
      fourBedroom: fmrData.fourBedroom,
    },
    medianRent: fmrData.medianRent,
    percentile40: fmrData.percentile40,
    percentile50: fmrData.percentile50,
  };
}
