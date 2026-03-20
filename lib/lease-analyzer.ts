import { getCityBySlug, type CityData } from "@/data/cities";
import { formatCurrency } from "@/lib/rent-calculator";

// ============================================================
// Lease Analyzer: Lease renewal analysis and guidance
// ============================================================

export interface LeaseInput {
  currentRent: number;
  proposedRent: number;
  citySlug: string;
  bedrooms: number;
  leaseTermMonths?: number;
}

export interface LeaseAnalysis {
  proposedIncrease: number;
  proposedIncreasePercent: number;
  marketAvgIncrease: number;
  fairRangeMin: number;
  fairRangeMax: number;
  isFair: boolean;
  negotiationPoints: string[];
  riskAssessment: "low" | "medium" | "high";
  recommendation: string;
  estimatedNegotiatedRent: number;
}

// ---------------------
// Internal helpers
// ---------------------

function getCityAvgRent(city: CityData, bedrooms: number): number {
  switch (bedrooms) {
    case 0:
      return city.avgRentStudio;
    case 1:
      return city.avgRent1Bed;
    case 2:
      return city.avgRent2Bed;
    case 3:
      return city.avgRent3Bed;
    default:
      return city.avgRent2Bed;
  }
}

function getBedroomLabel(bedrooms: number): string {
  if (bedrooms === 0) return "studio";
  if (bedrooms === 1) return "1-bedroom";
  return `${bedrooms}-bedroom`;
}

/**
 * Estimate the typical annual rent increase for the market.
 * Based on the city's year-over-year change, adjusted slightly.
 */
function estimateMarketAvgIncrease(city: CityData): number {
  // The yoyChange is the citywide average increase.
  // Lease renewals tend to be slightly lower than market-wide increases
  // because landlords want to retain existing tenants.
  const retention_discount = 0.5; // landlords typically offer 0.5% less than market
  return Math.max(0, city.yoyChange - retention_discount);
}

/**
 * Calculate the fair range for a rent increase.
 * Fair range = (market avg increase - 1.5%) to (market avg increase + 1.5%)
 * Adjusted for market conditions (vacancy rate, etc.)
 */
function calculateFairRange(
  currentRent: number,
  city: CityData
): { min: number; max: number } {
  const avgIncrease = estimateMarketAvgIncrease(city);

  // Wider range if the market is volatile; tighter if stable
  let rangeWidth = 1.5;
  if (city.vacancyRate >= 6) {
    rangeWidth = 2.0; // Looser market, more room for landlord flexibility
  } else if (city.vacancyRate < 3) {
    rangeWidth = 1.0; // Tight market, increases tend to cluster
  }

  const minPercent = Math.max(0, avgIncrease - rangeWidth);
  const maxPercent = avgIncrease + rangeWidth;

  const min = Math.round(currentRent * (1 + minPercent / 100));
  const max = Math.round(currentRent * (1 + maxPercent / 100));

  return { min, max };
}

/**
 * Assess the risk of not renewing (i.e., landlord finding a new tenant).
 * Low risk = renter's market, high risk = landlord's market.
 */
function assessRisk(city: CityData, proposedIncreasePercent: number): "low" | "medium" | "high" {
  // If vacancy is high and rents are flat/declining, risk of being replaced is low
  if (city.vacancyRate >= 6 && city.yoyChange <= 1) return "low";
  if (city.vacancyRate >= 4.5 && city.yoyChange <= 3) return "low";

  // Moderate risk: balanced market
  if (city.vacancyRate >= 3.5 && city.yoyChange <= 4) return "medium";

  // High risk: tight market with rising rents
  if (city.vacancyRate < 3.5 || city.yoyChange > 4) return "high";

  return "medium";
}

/**
 * Generate specific, actionable negotiation points.
 */
function generateNegotiationPoints(
  proposedIncrease: number,
  proposedIncreasePercent: number,
  marketAvgIncrease: number,
  currentRent: number,
  proposedRent: number,
  avgRent: number,
  city: CityData,
  bedrooms: number,
  fairRangeMin: number,
  fairRangeMax: number
): string[] {
  const points: string[] = [];
  const bedroomLabel = getBedroomLabel(bedrooms);

  // Point 1: Compare to market average increase
  if (proposedIncreasePercent > marketAvgIncrease + 1) {
    points.push(
      `The proposed increase of ${proposedIncreasePercent.toFixed(1)}% exceeds the market average increase of ${marketAvgIncrease.toFixed(1)}% for ${city.name}. Request that the increase be brought in line with market norms.`
    );
  } else if (proposedIncreasePercent <= marketAvgIncrease) {
    points.push(
      `The proposed increase of ${proposedIncreasePercent.toFixed(1)}% is at or below the market average of ${marketAvgIncrease.toFixed(1)}%, which is reasonable for ${city.name}.`
    );
  }

  // Point 2: Proposed rent vs city average
  if (proposedRent > avgRent * 1.1) {
    points.push(
      `The proposed rent of ${formatCurrency(proposedRent)} would be ${(((proposedRent - avgRent) / avgRent) * 100).toFixed(1)}% above the city average of ${formatCurrency(avgRent)} for a ${bedroomLabel}. Cite this comparison when negotiating.`
    );
  } else if (proposedRent > avgRent) {
    points.push(
      `The proposed rent of ${formatCurrency(proposedRent)} is slightly above the city average of ${formatCurrency(avgRent)} for a ${bedroomLabel}. You have some room to push back.`
    );
  }

  // Point 3: Vacancy rate leverage
  if (city.vacancyRate >= 5) {
    points.push(
      `The ${city.vacancyRate}% vacancy rate in ${city.name} means landlords face real cost when units sit empty. Remind your landlord that retaining a good tenant is less costly than finding a new one.`
    );
  }

  // Point 4: Offer a longer lease
  points.push(
    `Offer to sign a longer lease (18 to 24 months) in exchange for a lower increase. Landlords value the stability of guaranteed occupancy.`
  );

  // Point 5: Fair range reference
  if (proposedRent > fairRangeMax) {
    points.push(
      `A fair renewal rent for your unit falls between ${formatCurrency(fairRangeMin)} and ${formatCurrency(fairRangeMax)} based on current market data. The proposed rent of ${formatCurrency(proposedRent)} exceeds this range.`
    );
  }

  // Point 6: CPI / inflation reference
  points.push(
    `Reference the Consumer Price Index (CPI) inflation rate, which has been approximately 3 to 4% recently. Increases significantly above CPI should require justification.`
  );

  // Point 7: Tenant value
  points.push(
    `Highlight your value as a tenant: on-time payments, no complaints, and good maintenance of the unit. Turnover costs landlords one to three months of lost rent on average.`
  );

  return points.slice(0, 6);
}

/**
 * Generate the main recommendation text.
 */
function generateRecommendation(
  isFair: boolean,
  proposedIncreasePercent: number,
  marketAvgIncrease: number,
  estimatedNegotiatedRent: number,
  proposedRent: number,
  riskAssessment: "low" | "medium" | "high",
  city: CityData
): string {
  if (isFair && proposedIncreasePercent <= marketAvgIncrease + 0.5) {
    return `The proposed increase is within the fair market range for ${city.name}. While you can always try to negotiate, the terms are reasonable. Consider accepting if the landlord will not budge, and focus on locking in favorable lease terms such as duration and maintenance commitments.`;
  }

  if (proposedIncreasePercent > marketAvgIncrease + 3) {
    return `The proposed increase of ${proposedIncreasePercent.toFixed(1)}% is significantly above the market average of ${marketAvgIncrease.toFixed(1)}%. You have a strong case for negotiation. Present comparable data and aim for ${formatCurrency(estimatedNegotiatedRent)}/month. If the landlord is unwilling to negotiate, consider exploring other options in ${city.name}.`;
  }

  if (riskAssessment === "low") {
    return `Market conditions favor tenants in ${city.name} right now. You have good leverage to negotiate from ${formatCurrency(proposedRent)} down to approximately ${formatCurrency(estimatedNegotiatedRent)}/month. Be confident in your negotiation.`;
  }

  if (riskAssessment === "high") {
    return `The rental market in ${city.name} is competitive, which limits your negotiation leverage. However, it still costs landlords money to find new tenants. Aim for ${formatCurrency(estimatedNegotiatedRent)}/month and be prepared to accept a modest increase if the landlord holds firm.`;
  }

  return `The proposed increase is above the fair market range. Negotiate with data: present the market average increase (${marketAvgIncrease.toFixed(1)}%), comparable rents, and your value as a tenant. Target ${formatCurrency(estimatedNegotiatedRent)}/month as a realistic outcome.`;
}

// ============================================================
// Main export
// ============================================================

export function analyzeLeaseRenewal(input: LeaseInput): LeaseAnalysis {
  const city = getCityBySlug(input.citySlug);

  if (!city) {
    // Fallback for unknown city
    const increase = input.proposedRent - input.currentRent;
    const increasePercent =
      input.currentRent > 0 ? (increase / input.currentRent) * 100 : 0;
    return {
      proposedIncrease: increase,
      proposedIncreasePercent: Math.round(increasePercent * 10) / 10,
      marketAvgIncrease: 3.0,
      fairRangeMin: Math.round(input.currentRent * 1.01),
      fairRangeMax: Math.round(input.currentRent * 1.05),
      isFair: increasePercent <= 5,
      negotiationPoints: [
        "Research comparable rents in your area to support your negotiation.",
        "Highlight your track record as a reliable tenant.",
        "Offer a longer lease term in exchange for a smaller increase.",
      ],
      riskAssessment: "medium",
      recommendation:
        "Unable to find specific market data for your city. Research local comparable rents and use them to support your negotiation position.",
      estimatedNegotiatedRent: Math.round(input.currentRent * 1.03),
    };
  }

  const avgRent = getCityAvgRent(city, input.bedrooms);
  const proposedIncrease = input.proposedRent - input.currentRent;
  const proposedIncreasePercent =
    input.currentRent > 0
      ? (proposedIncrease / input.currentRent) * 100
      : 0;
  const marketAvgIncrease = estimateMarketAvgIncrease(city);

  const fairRange = calculateFairRange(input.currentRent, city);
  const isFair =
    input.proposedRent >= fairRange.min && input.proposedRent <= fairRange.max;

  const riskAssessment = assessRisk(city, proposedIncreasePercent);

  const negotiationPoints = generateNegotiationPoints(
    proposedIncrease,
    proposedIncreasePercent,
    marketAvgIncrease,
    input.currentRent,
    input.proposedRent,
    avgRent,
    city,
    input.bedrooms,
    fairRange.min,
    fairRange.max
  );

  // Estimate negotiated rent: blend proposed with fair range max
  let estimatedNegotiatedRent: number;
  if (input.proposedRent <= fairRange.max) {
    // If already in fair range, the negotiated result will be close to proposed
    estimatedNegotiatedRent = Math.round(
      input.proposedRent * 0.7 + fairRange.min * 0.3
    );
  } else {
    // If above fair range, expect to negotiate down toward the range
    estimatedNegotiatedRent = Math.round(
      fairRange.max * 0.6 + input.proposedRent * 0.2 + fairRange.min * 0.2
    );
  }

  // Don't let negotiated rent go below current rent (unlikely a landlord agrees to a decrease on renewal)
  estimatedNegotiatedRent = Math.max(
    estimatedNegotiatedRent,
    input.currentRent
  );

  const recommendation = generateRecommendation(
    isFair,
    proposedIncreasePercent,
    marketAvgIncrease,
    estimatedNegotiatedRent,
    input.proposedRent,
    riskAssessment,
    city
  );

  return {
    proposedIncrease: Math.round(proposedIncrease),
    proposedIncreasePercent: Math.round(proposedIncreasePercent * 10) / 10,
    marketAvgIncrease: Math.round(marketAvgIncrease * 10) / 10,
    fairRangeMin: fairRange.min,
    fairRangeMax: fairRange.max,
    isFair,
    negotiationPoints,
    riskAssessment,
    recommendation,
    estimatedNegotiatedRent,
  };
}
