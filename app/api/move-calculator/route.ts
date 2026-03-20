import { NextRequest, NextResponse } from "next/server";
import { analyzeMoveVsStay } from "@/lib/move-calculator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      currentRent,
      newRent,
      movingCosts,
      securityDeposit,
      brokerFee,
      currentLeaseEnd,
      earlyTerminationFee,
    } = body;

    if (!currentRent || !newRent) {
      return NextResponse.json(
        { error: "Missing required fields: currentRent, newRent" },
        { status: 400 }
      );
    }

    if (Number(currentRent) <= 0 || Number(newRent) <= 0) {
      return NextResponse.json(
        { error: "currentRent and newRent must be positive numbers" },
        { status: 400 }
      );
    }

    const result = analyzeMoveVsStay({
      currentRent: Number(currentRent),
      newRent: Number(newRent),
      movingCosts: movingCosts !== undefined ? Number(movingCosts) : undefined,
      securityDeposit:
        securityDeposit !== undefined ? Number(securityDeposit) : undefined,
      brokerFee: brokerFee !== undefined ? Number(brokerFee) : undefined,
      currentLeaseEnd: currentLeaseEnd || undefined,
      earlyTerminationFee:
        earlyTerminationFee !== undefined
          ? Number(earlyTerminationFee)
          : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate move analysis" },
      { status: 500 }
    );
  }
}
