import { formatCurrency } from "@/lib/rent-calculator";

// ============================================================
// Move Calculator: Move vs. Stay financial analysis
// ============================================================

export interface MoveInput {
  currentRent: number;
  newRent: number;
  movingCosts?: number;
  securityDeposit?: number;
  brokerFee?: number;
  currentLeaseEnd?: string;
  earlyTerminationFee?: number;
}

export interface MoveAnalysis {
  totalMovingCost: number;
  monthlySavings: number;
  breakEvenMonths: number;
  fiveYearSavings: number;
  recommendation: "move" | "stay" | "negotiate";
  breakdown: {
    label: string;
    amount: number;
  }[];
  summary: string;
}

// ---------------------
// Internal helpers
// ---------------------

function estimateMovingCosts(currentRent: number): number {
  // Rough estimate based on rent level (proxy for city cost and apartment size)
  if (currentRent >= 3000) return 2500;
  if (currentRent >= 2000) return 1800;
  if (currentRent >= 1500) return 1200;
  return 800;
}

function calculateEarlyTerminationPenalty(
  currentRent: number,
  leaseEndDate?: string,
  earlyTerminationFee?: number
): number {
  if (earlyTerminationFee !== undefined && earlyTerminationFee > 0) {
    return earlyTerminationFee;
  }

  if (!leaseEndDate) return 0;

  const today = new Date();
  const leaseEnd = new Date(leaseEndDate);
  const monthsRemaining =
    (leaseEnd.getFullYear() - today.getFullYear()) * 12 +
    (leaseEnd.getMonth() - today.getMonth());

  if (monthsRemaining <= 0) return 0;

  // Standard early termination is typically 1 to 2 months rent
  // If more than 6 months remaining, landlord may require 2 months
  if (monthsRemaining > 6) return currentRent * 2;
  if (monthsRemaining > 3) return currentRent * 1.5;
  return currentRent;
}

function generateRecommendation(
  monthlySavings: number,
  breakEvenMonths: number,
  totalMovingCost: number,
  currentRent: number
): "move" | "stay" | "negotiate" {
  // If savings are negative (new place is more expensive), stay
  if (monthlySavings <= 0) return "stay";

  // If break-even is within 6 months, moving is a clear win
  if (breakEvenMonths <= 6 && monthlySavings >= 100) return "move";

  // If break-even is within 12 months, it is still favorable
  if (breakEvenMonths <= 12 && monthlySavings >= 150) return "move";

  // If break-even is beyond 18 months, try negotiating first
  if (breakEvenMonths > 18) return "negotiate";

  // If savings are moderate but break-even is reasonable, negotiate first
  if (monthlySavings < 200 && breakEvenMonths > 12) return "negotiate";

  // Moderate scenario: suggest moving if savings justify the hassle
  if (breakEvenMonths <= 15 && monthlySavings >= 200) return "move";

  return "negotiate";
}

function generateSummary(
  recommendation: "move" | "stay" | "negotiate",
  monthlySavings: number,
  breakEvenMonths: number,
  fiveYearSavings: number,
  totalMovingCost: number
): string {
  if (recommendation === "stay") {
    if (monthlySavings <= 0) {
      return `The new apartment would cost ${formatCurrency(Math.abs(monthlySavings))} more per month. Staying in your current place is the better financial decision.`;
    }
    return `While you could save ${formatCurrency(monthlySavings)}/month, the upfront moving costs of ${formatCurrency(totalMovingCost)} make staying and negotiating a better option.`;
  }

  if (recommendation === "negotiate") {
    return `You could save ${formatCurrency(monthlySavings)}/month by moving, but it would take ${breakEvenMonths} months to recoup ${formatCurrency(totalMovingCost)} in moving costs. Try negotiating your current rent first, and move if your landlord will not adjust.`;
  }

  return `Moving would save you ${formatCurrency(monthlySavings)}/month. After covering ${formatCurrency(totalMovingCost)} in moving costs, you will break even in ${breakEvenMonths} month${breakEvenMonths !== 1 ? "s" : ""} and save ${formatCurrency(fiveYearSavings)} over 5 years.`;
}

// ============================================================
// Main export
// ============================================================

export function analyzeMoveVsStay(input: MoveInput): MoveAnalysis {
  // Calculate monthly savings
  const monthlySavings = input.currentRent - input.newRent;

  // Build cost breakdown
  const breakdown: { label: string; amount: number }[] = [];

  // Moving costs
  const movingCosts =
    input.movingCosts !== undefined
      ? input.movingCosts
      : estimateMovingCosts(input.currentRent);
  if (movingCosts > 0) {
    breakdown.push({ label: "Moving costs (movers, supplies, transport)", amount: movingCosts });
  }

  // Security deposit for new place
  const securityDeposit =
    input.securityDeposit !== undefined ? input.securityDeposit : input.newRent;
  if (securityDeposit > 0) {
    breakdown.push({ label: "Security deposit (new apartment)", amount: securityDeposit });
  }

  // Broker fee
  const brokerFee = input.brokerFee !== undefined ? input.brokerFee : 0;
  if (brokerFee > 0) {
    breakdown.push({ label: "Broker fee", amount: brokerFee });
  }

  // Early termination penalty
  const earlyTermPenalty = calculateEarlyTerminationPenalty(
    input.currentRent,
    input.currentLeaseEnd,
    input.earlyTerminationFee
  );
  if (earlyTermPenalty > 0) {
    breakdown.push({
      label: "Early lease termination fee",
      amount: earlyTermPenalty,
    });
  }

  // Application and miscellaneous fees (estimate)
  const miscFees = 75;
  breakdown.push({ label: "Application and miscellaneous fees", amount: miscFees });

  // Total moving cost
  const totalMovingCost = breakdown.reduce((sum, item) => sum + item.amount, 0);

  // Break-even calculation
  let breakEvenMonths: number;
  if (monthlySavings <= 0) {
    breakEvenMonths = Infinity;
  } else {
    breakEvenMonths = Math.ceil(totalMovingCost / monthlySavings);
  }

  // 5-year savings projection
  // Net savings = (monthly savings * 60 months) - total moving cost
  const fiveYearSavings = monthlySavings * 60 - totalMovingCost;

  // Determine recommendation
  const recommendation = generateRecommendation(
    monthlySavings,
    breakEvenMonths === Infinity ? 999 : breakEvenMonths,
    totalMovingCost,
    input.currentRent
  );

  // Generate summary
  const summary = generateSummary(
    recommendation,
    monthlySavings,
    breakEvenMonths === Infinity ? 0 : breakEvenMonths,
    fiveYearSavings,
    totalMovingCost
  );

  return {
    totalMovingCost,
    monthlySavings,
    breakEvenMonths: breakEvenMonths === Infinity ? -1 : breakEvenMonths,
    fiveYearSavings,
    recommendation,
    breakdown,
    summary,
  };
}
