import { NextRequest, NextResponse } from "next/server";
import { generateNegotiationLetter } from "@/lib/negotiation-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantName,
      landlordName,
      propertyAddress,
      currentRent,
      proposedRent,
      leaseEndDate,
      citySlug,
      bedrooms,
      yearsAsTenant,
      marketAvgRent,
      comparableRents,
      buildingViolations,
      tone,
      letterType,
    } = body;

    if (
      !tenantName ||
      !landlordName ||
      !propertyAddress ||
      !currentRent ||
      !citySlug ||
      bedrooms === undefined ||
      !marketAvgRent ||
      !tone ||
      !letterType
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: tenantName, landlordName, propertyAddress, currentRent, citySlug, bedrooms, marketAvgRent, tone, letterType",
        },
        { status: 400 }
      );
    }

    const validTones = ["professional", "firm", "friendly"];
    if (!validTones.includes(tone)) {
      return NextResponse.json(
        { error: "Invalid tone. Must be one of: professional, firm, friendly" },
        { status: 400 }
      );
    }

    const validLetterTypes = ["reduction", "renewal", "initial"];
    if (!validLetterTypes.includes(letterType)) {
      return NextResponse.json(
        {
          error:
            "Invalid letterType. Must be one of: reduction, renewal, initial",
        },
        { status: 400 }
      );
    }

    const result = generateNegotiationLetter({
      tenantName,
      landlordName,
      propertyAddress,
      currentRent: Number(currentRent),
      proposedRent: proposedRent ? Number(proposedRent) : undefined,
      leaseEndDate,
      citySlug,
      bedrooms: Number(bedrooms),
      yearsAsTenant: yearsAsTenant ? Number(yearsAsTenant) : undefined,
      marketAvgRent: Number(marketAvgRent),
      comparableRents: comparableRents
        ? comparableRents.map(Number)
        : undefined,
      buildingViolations: buildingViolations
        ? Number(buildingViolations)
        : undefined,
      tone,
      letterType,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate negotiation letter" },
      { status: 500 }
    );
  }
}
