import { NextRequest, NextResponse } from "next/server";
import { analyzeLeaseRenewal } from "@/lib/lease-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentRent, proposedRent, citySlug, bedrooms, leaseTermMonths } =
      body;

    if (
      !currentRent ||
      !proposedRent ||
      !citySlug ||
      bedrooms === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: currentRent, proposedRent, citySlug, bedrooms",
        },
        { status: 400 }
      );
    }

    if (Number(currentRent) <= 0 || Number(proposedRent) <= 0) {
      return NextResponse.json(
        { error: "currentRent and proposedRent must be positive numbers" },
        { status: 400 }
      );
    }

    const result = analyzeLeaseRenewal({
      currentRent: Number(currentRent),
      proposedRent: Number(proposedRent),
      citySlug,
      bedrooms: Number(bedrooms),
      leaseTermMonths: leaseTermMonths ? Number(leaseTermMonths) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze lease renewal" },
      { status: 500 }
    );
  }
}
