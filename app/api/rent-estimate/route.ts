import { NextRequest, NextResponse } from "next/server";
import { getCityBySlug, getRentFairnessScore } from "@/data/cities";
import { getMarketCondition } from "@/lib/rent-calculator";
import { getSmartRentEstimate } from "@/lib/rentcast-api";
import { getCityDemographics } from "@/lib/census-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const citySlug = searchParams.get("city");
  const bedrooms = searchParams.get("bedrooms") || "1bed";
  const currentRent = searchParams.get("rent");
  const zipCode = searchParams.get("zip") || "";
  const address = searchParams.get("address") || "";

  if (!citySlug) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  const city = getCityBySlug(citySlug);
  if (!city) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }

  // Map bedrooms param to number for API calls
  const bedroomCount =
    bedrooms === "studio"
      ? 0
      : bedrooms === "2bed"
        ? 2
        : bedrooms === "3bed"
          ? 3
          : 1;

  // Try real API for rent estimate (address or zip required)
  let avgRent: number;
  let rentSource: "rentcast" | "mock" = "mock";
  let rentLow: number | undefined;
  let rentHigh: number | undefined;

  if (zipCode || address) {
    const estimate = await getSmartRentEstimate({
      citySlug,
      bedrooms: bedroomCount,
      zipCode: zipCode || undefined,
      address: address || undefined,
    });
    avgRent = estimate.estimate;
    rentSource = estimate.source;
    rentLow = estimate.low;
    rentHigh = estimate.high;
  } else {
    // Fallback to static city averages
    switch (bedrooms) {
      case "studio":
        avgRent = city.avgRentStudio;
        break;
      case "2bed":
        avgRent = city.avgRent2Bed;
        break;
      case "3bed":
        avgRent = city.avgRent3Bed;
        break;
      default:
        avgRent = city.avgRent1Bed;
    }
    rentLow = Math.round(avgRent * 0.85);
    rentHigh = Math.round(avgRent * 1.15);
  }

  // Try Census API for demographics
  const demographics = await getCityDemographics(citySlug);

  const market = getMarketCondition(city.yoyChange, city.vacancyRate);

  const response: Record<string, unknown> = {
    city: city.name,
    state: city.stateCode,
    bedrooms,
    averageRent: avgRent,
    rentRangeLow: rentLow,
    rentRangeHigh: rentHigh,
    yoyChange: city.yoyChange,
    vacancyRate: demographics?.vacancyRate ?? city.vacancyRate,
    medianIncome: demographics?.medianIncome ?? city.medianIncome,
    renterPercentage: demographics?.renterPercentage ?? city.renterPercentage,
    rentToIncomeRatio: currentRent
      ? Math.round(
          (Number(currentRent) /
            ((demographics?.medianIncome ?? city.medianIncome) / 12)) *
            100
        ) / 100
      : city.rentToIncomeRatio,
    marketCondition: market.condition,
    dataSources: {
      rent: rentSource,
      demographics: demographics?.source ?? "mock",
    },
    neighborhoods: city.neighborhoods.map((n) => ({
      name: n.name,
      avgRent1Bed: n.avgRent1Bed,
      avgRent2Bed: n.avgRent2Bed,
      walkScore: n.walkScore,
      safetyRating: n.safetyRating,
    })),
  };

  if (currentRent) {
    response.fairnessScore = getRentFairnessScore(Number(currentRent), avgRent);
    response.difference = Number(currentRent) - avgRent;
  }

  return NextResponse.json(response);
}
