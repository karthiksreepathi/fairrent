import { getCityBySlug, type CityData } from "@/data/cities";
import { getHudFmr, type HudFmrData } from "@/data/hud-fmr";
import { formatCurrency } from "@/lib/rent-calculator";

// ============================================================
// Fairness Engine: Deep multi-factor rent fairness scoring
// ============================================================

export interface FairnessInput {
  citySlug: string;
  currentRent: number;
  bedrooms: number;
  sqft?: number;
  floorLevel?: string; // "low" | "mid" | "high" | "penthouse"
  hasAmenities?: string[];
  buildingAge?: number;
  neighborhood?: string;
}

export interface FairnessFactor {
  name: string;
  score: number; // 0-100
  weight: number;
  description: string;
  impact: "positive" | "negative" | "neutral";
}

export interface FairnessResult {
  overallScore: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  percentileRank: number;
  negotiationLeverage: "strong" | "moderate" | "weak" | "none";
  factors: FairnessFactor[];
  estimatedFairRent: number;
  potentialSavings: number;
  potentialSavingsAnnual: number;
  confidence: "high" | "medium" | "low";
  summary: string;
  recommendations: string[];
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

function getFmrForBedrooms(data: HudFmrData, bedrooms: number): number {
  switch (bedrooms) {
    case 0:
      return data.efficiency;
    case 1:
      return data.oneBedroom;
    case 2:
      return data.twoBedroom;
    case 3:
      return data.threeBedroom;
    case 4:
      return data.fourBedroom;
    default:
      return data.twoBedroom;
  }
}

function getBedroomLabel(bedrooms: number): string {
  if (bedrooms === 0) return "studio";
  if (bedrooms === 1) return "1-bedroom";
  return `${bedrooms}-bedroom`;
}

/**
 * Factor 1: Market Comparison
 * Compare current rent to the city average for the given bedroom count.
 */
function scoreMarketComparison(
  currentRent: number,
  avgRent: number
): FairnessFactor {
  const ratio = currentRent / avgRent;

  let score: number;
  if (ratio <= 0.75) score = 100;
  else if (ratio <= 0.85) score = 90;
  else if (ratio <= 0.95) score = 78;
  else if (ratio <= 1.0) score = 68;
  else if (ratio <= 1.05) score = 55;
  else if (ratio <= 1.15) score = 40;
  else if (ratio <= 1.25) score = 25;
  else score = 10;

  let impact: "positive" | "negative" | "neutral";
  if (ratio <= 0.95) impact = "positive";
  else if (ratio <= 1.05) impact = "neutral";
  else impact = "negative";

  let description: string;
  if (ratio <= 0.85) {
    description = `Your rent is ${Math.round((1 - ratio) * 100)}% below the city average. This is an excellent deal.`;
  } else if (ratio <= 0.95) {
    description = `Your rent is ${Math.round((1 - ratio) * 100)}% below the city average. A good value for the area.`;
  } else if (ratio <= 1.05) {
    description = `Your rent is within 5% of the city average. This is fairly priced for the market.`;
  } else if (ratio <= 1.15) {
    description = `Your rent is ${Math.round((ratio - 1) * 100)}% above the city average. Slightly higher than typical.`;
  } else {
    description = `Your rent is ${Math.round((ratio - 1) * 100)}% above the city average, which is significantly above market rate.`;
  }

  return {
    name: "Market Comparison",
    score,
    weight: 0.3,
    description,
    impact,
  };
}

/**
 * Factor 2: HUD FMR Comparison
 * Compare current rent to the HUD Fair Market Rent for the area.
 */
function scoreFmrComparison(
  currentRent: number,
  citySlug: string,
  bedrooms: number
): FairnessFactor {
  const fmr = getHudFmr(citySlug);

  if (!fmr) {
    return {
      name: "HUD Fair Market Rent",
      score: 50,
      weight: 0.2,
      description:
        "HUD FMR data is not available for this area. This factor uses a neutral score.",
      impact: "neutral",
    };
  }

  const fmrRent = getFmrForBedrooms(fmr, bedrooms);
  const ratio = currentRent / fmrRent;

  let score: number;
  if (ratio <= 0.8) score = 100;
  else if (ratio <= 0.9) score = 88;
  else if (ratio <= 1.0) score = 75;
  else if (ratio <= 1.1) score = 60;
  else if (ratio <= 1.2) score = 45;
  else if (ratio <= 1.4) score = 30;
  else score = 12;

  let impact: "positive" | "negative" | "neutral";
  if (ratio <= 1.0) impact = "positive";
  else if (ratio <= 1.15) impact = "neutral";
  else impact = "negative";

  let description: string;
  if (ratio <= 0.9) {
    description = `Your rent is ${Math.round((1 - ratio) * 100)}% below the HUD Fair Market Rent of ${formatCurrency(fmrRent)}. Well within affordable guidelines.`;
  } else if (ratio <= 1.1) {
    description = `Your rent is near the HUD Fair Market Rent of ${formatCurrency(fmrRent)}. Within the expected range.`;
  } else {
    description = `Your rent is ${Math.round((ratio - 1) * 100)}% above the HUD Fair Market Rent of ${formatCurrency(fmrRent)}, which exceeds government fair market standards.`;
  }

  return {
    name: "HUD Fair Market Rent",
    score,
    weight: 0.2,
    description,
    impact,
  };
}

/**
 * Factor 3: Price per Square Foot
 * Evaluate the cost efficiency if sqft is provided.
 */
function scorePricePerSqft(
  currentRent: number,
  sqft: number | undefined,
  city: CityData,
  bedrooms: number
): FairnessFactor {
  if (!sqft || sqft <= 0) {
    return {
      name: "Price per Square Foot",
      score: 50,
      weight: 0.15,
      description:
        "Square footage was not provided. This factor uses a neutral score. Enter your apartment size for a more accurate analysis.",
      impact: "neutral",
    };
  }

  const ppsf = currentRent / sqft;
  const avgRent = getCityAvgRent(city, bedrooms);

  // Estimate a reasonable sqft for the bedroom count
  const typicalSqft =
    bedrooms === 0
      ? 450
      : bedrooms === 1
        ? 650
        : bedrooms === 2
          ? 900
          : 1150;
  const avgPpsf = avgRent / typicalSqft;
  const ratio = ppsf / avgPpsf;

  let score: number;
  if (ratio <= 0.75) score = 98;
  else if (ratio <= 0.85) score = 85;
  else if (ratio <= 0.95) score = 72;
  else if (ratio <= 1.05) score = 60;
  else if (ratio <= 1.15) score = 45;
  else if (ratio <= 1.3) score = 30;
  else score = 15;

  let impact: "positive" | "negative" | "neutral";
  if (ratio <= 0.9) impact = "positive";
  else if (ratio <= 1.1) impact = "neutral";
  else impact = "negative";

  const description =
    ratio <= 0.95
      ? `At ${formatCurrency(ppsf)}/sqft, you are paying below the estimated area average of ${formatCurrency(avgPpsf)}/sqft. Good value per square foot.`
      : ratio <= 1.1
        ? `At ${formatCurrency(ppsf)}/sqft, you are near the estimated area average of ${formatCurrency(avgPpsf)}/sqft.`
        : `At ${formatCurrency(ppsf)}/sqft, you are paying ${Math.round((ratio - 1) * 100)}% above the estimated area average of ${formatCurrency(avgPpsf)}/sqft.`;

  return {
    name: "Price per Square Foot",
    score,
    weight: 0.15,
    description,
    impact,
  };
}

/**
 * Factor 4: Market Conditions
 * Evaluate vacancy rate and year-over-year rent change.
 * Higher vacancy + declining rents = renter's market = higher score.
 */
function scoreMarketConditions(city: CityData): FairnessFactor {
  let score = 50; // start neutral

  // Vacancy rate component (higher = better for renters)
  if (city.vacancyRate >= 8) score += 25;
  else if (city.vacancyRate >= 6) score += 18;
  else if (city.vacancyRate >= 5) score += 10;
  else if (city.vacancyRate >= 4) score += 0;
  else if (city.vacancyRate >= 3) score -= 10;
  else score -= 20;

  // YoY change component (negative = better for renters)
  if (city.yoyChange <= -3) score += 25;
  else if (city.yoyChange <= -1) score += 18;
  else if (city.yoyChange <= 1) score += 8;
  else if (city.yoyChange <= 3) score -= 5;
  else if (city.yoyChange <= 5) score -= 12;
  else score -= 20;

  score = Math.max(0, Math.min(100, score));

  let impact: "positive" | "negative" | "neutral";
  if (score >= 60) impact = "positive";
  else if (score >= 40) impact = "neutral";
  else impact = "negative";

  let condition: string;
  if (city.yoyChange <= -1 && city.vacancyRate >= 6) {
    condition = `Strong renter's market. Rents declined ${Math.abs(city.yoyChange).toFixed(1)}% year-over-year with a ${city.vacancyRate}% vacancy rate. You have significant negotiation power.`;
  } else if (city.yoyChange <= 2 && city.vacancyRate >= 4.5) {
    condition = `Balanced market with ${city.yoyChange > 0 ? "+" : ""}${city.yoyChange.toFixed(1)}% rent growth and ${city.vacancyRate}% vacancy. Some room to negotiate.`;
  } else {
    condition = `Competitive landlord's market with ${city.yoyChange > 0 ? "+" : ""}${city.yoyChange.toFixed(1)}% rent growth and only ${city.vacancyRate}% vacancy. Negotiation leverage is limited.`;
  }

  return {
    name: "Market Conditions",
    score,
    weight: 0.15,
    description: condition,
    impact,
  };
}

/**
 * Factor 5: Rent-to-Income Ratio
 * Using city median income, evaluate affordability.
 */
function scoreRentToIncome(
  currentRent: number,
  city: CityData
): FairnessFactor {
  const monthlyIncome = city.medianIncome / 12;
  const ratio = (currentRent / monthlyIncome) * 100;

  let score: number;
  if (ratio <= 20) score = 100;
  else if (ratio <= 25) score = 85;
  else if (ratio <= 30) score = 70;
  else if (ratio <= 35) score = 55;
  else if (ratio <= 40) score = 38;
  else if (ratio <= 50) score = 22;
  else score = 8;

  let impact: "positive" | "negative" | "neutral";
  if (ratio <= 30) impact = "positive";
  else if (ratio <= 40) impact = "neutral";
  else impact = "negative";

  let description: string;
  if (ratio <= 30) {
    description = `Based on the area median income (${formatCurrency(city.medianIncome)}/year), your rent represents ${ratio.toFixed(1)}% of income. Within the recommended 30% guideline.`;
  } else if (ratio <= 40) {
    description = `Based on the area median income (${formatCurrency(city.medianIncome)}/year), your rent represents ${ratio.toFixed(1)}% of income. Above the 30% guideline, indicating cost burden.`;
  } else {
    description = `Based on the area median income (${formatCurrency(city.medianIncome)}/year), your rent represents ${ratio.toFixed(1)}% of income, which is considered severely cost-burdened.`;
  }

  return {
    name: "Rent-to-Income Ratio",
    score,
    weight: 0.1,
    description,
    impact,
  };
}

/**
 * Factor 6: Amenity Value
 * Adjust score based on amenities present (or missing).
 */
function scoreAmenityValue(
  currentRent: number,
  avgRent: number,
  amenities: string[] | undefined,
  floorLevel: string | undefined,
  buildingAge: number | undefined
): FairnessFactor {
  if (!amenities || amenities.length === 0) {
    // No amenity info provided
    const ratio = currentRent / avgRent;
    const isAboveAvg = ratio > 1.05;
    return {
      name: "Amenity Value",
      score: isAboveAvg ? 40 : 55,
      weight: 0.1,
      description: isAboveAvg
        ? "No amenity details provided. Your rent is above average, so any missing amenities could mean you are overpaying."
        : "No amenity details provided. Enter your building amenities for a more accurate assessment.",
      impact: isAboveAvg ? "negative" : "neutral",
    };
  }

  // Calculate amenity premium
  let amenityValue = 0;

  const amenityPremiums: Record<string, number> = {
    doorman: 150,
    concierge: 120,
    gym: 80,
    pool: 70,
    rooftop: 60,
    elevator: 40,
    parking: 100,
    laundry: 50,
    "in-unit-laundry": 120,
    garden: 30,
    storage: 25,
    "bike-room": 20,
    "pet-friendly": 30,
    dishwasher: 35,
    "central-air": 45,
    balcony: 60,
    "hardwood-floors": 25,
    "stainless-appliances": 30,
  };

  for (const amenity of amenities) {
    const key = amenity.toLowerCase().replace(/\s+/g, "-");
    amenityValue += amenityPremiums[key] || 25;
  }

  // Floor level premium
  if (floorLevel === "high" || floorLevel === "penthouse") {
    amenityValue += floorLevel === "penthouse" ? 200 : 100;
  }

  // Building age discount (older buildings should be cheaper)
  if (buildingAge !== undefined && buildingAge > 50) {
    amenityValue -= Math.min(100, (buildingAge - 50) * 2);
  }

  // How much are you paying over the average, and how much does amenity value justify?
  const premium = currentRent - avgRent;
  const justifiedPremium = amenityValue;

  let score: number;
  if (premium <= 0) {
    // Paying at or below average, amenities are a bonus
    score = 85 + Math.min(15, amenities.length * 3);
  } else if (premium <= justifiedPremium * 0.8) {
    score = 75;
  } else if (premium <= justifiedPremium * 1.2) {
    score = 60;
  } else if (premium <= justifiedPremium * 1.5) {
    score = 42;
  } else {
    score = 22;
  }

  score = Math.max(0, Math.min(100, score));

  let impact: "positive" | "negative" | "neutral";
  if (score >= 65) impact = "positive";
  else if (score >= 40) impact = "neutral";
  else impact = "negative";

  const amenityList = amenities.slice(0, 4).join(", ");
  const description =
    score >= 65
      ? `Your amenities (${amenityList}) justify a premium of approximately ${formatCurrency(justifiedPremium)}/month. Your rent reflects good value given these features.`
      : score >= 40
        ? `Your amenities (${amenityList}) justify roughly ${formatCurrency(justifiedPremium)}/month in added value. Your premium above average is close to what these features warrant.`
        : `Your amenities (${amenityList}) justify approximately ${formatCurrency(justifiedPremium)}/month in added value, but you are paying significantly more than that premium above the average.`;

  return {
    name: "Amenity Value",
    score,
    weight: 0.1,
    description,
    impact,
  };
}

/**
 * Determine negotiation leverage from overall score and market conditions.
 */
function getNegotiationLeverage(
  overallScore: number,
  marketScore: number
): "strong" | "moderate" | "weak" | "none" {
  if (overallScore <= 30 && marketScore >= 55) return "strong";
  if (overallScore <= 45 && marketScore >= 45) return "moderate";
  if (overallScore <= 60) return "weak";
  return "none";
}

/**
 * Generate grade from score.
 */
function scoreToGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}

/**
 * Estimate a percentile rank from score.
 * A score of 50 means roughly 50th percentile (median deal).
 */
function scoreToPercentile(score: number): number {
  // Slight nonlinear mapping
  if (score >= 90) return 95;
  if (score >= 80) return 85;
  if (score >= 70) return 72;
  if (score >= 60) return 58;
  if (score >= 50) return 45;
  if (score >= 40) return 32;
  if (score >= 30) return 22;
  if (score >= 20) return 12;
  return 5;
}

/**
 * Generate actionable recommendations based on factors and results.
 */
function generateRecommendations(
  factors: FairnessFactor[],
  overallScore: number,
  potentialSavings: number,
  city: CityData,
  input: FairnessInput
): string[] {
  const recommendations: string[] = [];
  const marketFactor = factors.find((f) => f.name === "Market Comparison");
  const fmrFactor = factors.find((f) => f.name === "HUD Fair Market Rent");
  const marketConditions = factors.find((f) => f.name === "Market Conditions");
  const rentToIncome = factors.find((f) => f.name === "Rent-to-Income Ratio");
  const avgRent = getCityAvgRent(city, input.bedrooms);

  // Core recommendation based on overall score
  if (overallScore >= 80) {
    recommendations.push(
      `Your rent is a strong value for ${city.name}. Consider locking in a longer lease term to protect against future increases.`
    );
  } else if (overallScore >= 60) {
    recommendations.push(
      `Your rent is fairly priced. You may have some room to negotiate ${formatCurrency(potentialSavings)}/month if comparable units are available at lower rates.`
    );
  } else if (overallScore >= 40) {
    recommendations.push(
      `Your rent is above market average. Research comparable listings in ${city.name} and present them to your landlord when negotiating a reduction of up to ${formatCurrency(potentialSavings)}/month.`
    );
  } else {
    recommendations.push(
      `Your rent is significantly above market rate. You could save approximately ${formatCurrency(potentialSavings)}/month by negotiating or exploring other options in ${city.name}.`
    );
  }

  // Market conditions recommendation
  if (marketConditions && marketConditions.score >= 60) {
    recommendations.push(
      `Current market conditions favor renters in ${city.name} with a ${city.vacancyRate}% vacancy rate. This gives you leverage to negotiate lower rent.`
    );
  } else if (marketConditions && marketConditions.score < 40) {
    recommendations.push(
      `The rental market in ${city.name} is competitive right now. Focus on tenant improvements and longer lease commitment as negotiation tools instead of comparable pricing.`
    );
  }

  // FMR-specific recommendation
  if (fmrFactor && fmrFactor.impact === "negative") {
    recommendations.push(
      `Your rent exceeds the HUD Fair Market Rent for this area. This is relevant if you are applying for housing assistance or want to cite government standards in negotiations.`
    );
  }

  // Rent-to-income recommendation
  if (rentToIncome && rentToIncome.score < 40) {
    recommendations.push(
      `Your rent-to-income ratio is above the recommended 30% guideline. Consider whether a more affordable unit would improve your overall financial health.`
    );
  }

  // Neighborhood-specific
  if (input.neighborhood) {
    const neighborhood = city.neighborhoods.find(
      (n) => n.name.toLowerCase().includes(input.neighborhood!.toLowerCase())
    );
    if (neighborhood) {
      const neighborhoodAvg =
        input.bedrooms === 1
          ? neighborhood.avgRent1Bed
          : input.bedrooms === 2
            ? neighborhood.avgRent2Bed
            : neighborhood.avgRent3Bed;
      if (input.currentRent > neighborhoodAvg * 1.1) {
        recommendations.push(
          `Your rent is above the average for ${neighborhood.name} specifically. The neighborhood average for a ${getBedroomLabel(input.bedrooms)} is ${formatCurrency(neighborhoodAvg)}.`
        );
      }
    }
  }

  // Amenity recommendation
  if (!input.hasAmenities || input.hasAmenities.length === 0) {
    if (marketFactor && marketFactor.impact === "negative") {
      recommendations.push(
        `If your building lacks premium amenities (doorman, gym, laundry), you have an even stronger case for a rent reduction since you are paying above average without those extras.`
      );
    }
  }

  // Cap recommendations at 5
  return recommendations.slice(0, 5);
}

/**
 * Generate a 1-2 sentence summary.
 */
function generateSummary(
  grade: string,
  overallScore: number,
  currentRent: number,
  estimatedFairRent: number,
  city: CityData,
  bedrooms: number
): string {
  const bedroomLabel = getBedroomLabel(bedrooms);
  if (grade === "A") {
    return `Your ${bedroomLabel} rent of ${formatCurrency(currentRent)} is an excellent deal for ${city.name}. You are paying well below the estimated fair rent of ${formatCurrency(estimatedFairRent)}.`;
  }
  if (grade === "B") {
    return `Your ${bedroomLabel} rent of ${formatCurrency(currentRent)} is fairly priced for ${city.name}. The estimated fair rent for your unit is ${formatCurrency(estimatedFairRent)}.`;
  }
  if (grade === "C") {
    return `Your ${bedroomLabel} rent of ${formatCurrency(currentRent)} is somewhat above the market average in ${city.name}. You may be able to negotiate closer to the estimated fair rent of ${formatCurrency(estimatedFairRent)}.`;
  }
  if (grade === "D") {
    return `Your ${bedroomLabel} rent of ${formatCurrency(currentRent)} appears overpriced for ${city.name}. The estimated fair rent is ${formatCurrency(estimatedFairRent)}, suggesting significant room for negotiation.`;
  }
  return `Your ${bedroomLabel} rent of ${formatCurrency(currentRent)} is significantly above market rate in ${city.name}. The estimated fair rent of ${formatCurrency(estimatedFairRent)} suggests you could save substantially by negotiating or relocating.`;
}

// ============================================================
// Main scoring function
// ============================================================

export function calculateDeepFairnessScore(
  input: FairnessInput
): FairnessResult {
  const city = getCityBySlug(input.citySlug);

  if (!city) {
    // Return a default/error result for unknown cities
    return {
      overallScore: 50,
      grade: "C",
      percentileRank: 50,
      negotiationLeverage: "weak",
      factors: [],
      estimatedFairRent: input.currentRent,
      potentialSavings: 0,
      potentialSavingsAnnual: 0,
      confidence: "low",
      summary:
        "Unable to find city data for this location. Results may not be accurate.",
      recommendations: [
        "Verify your city selection and try again for an accurate analysis.",
      ],
    };
  }

  const avgRent = getCityAvgRent(city, input.bedrooms);

  // Calculate all factors
  const factors: FairnessFactor[] = [
    scoreMarketComparison(input.currentRent, avgRent),
    scoreFmrComparison(input.currentRent, input.citySlug, input.bedrooms),
    scorePricePerSqft(input.currentRent, input.sqft, city, input.bedrooms),
    scoreMarketConditions(city),
    scoreRentToIncome(input.currentRent, city),
    scoreAmenityValue(
      input.currentRent,
      avgRent,
      input.hasAmenities,
      input.floorLevel,
      input.buildingAge
    ),
  ];

  // Calculate weighted overall score
  const overallScore = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  const grade = scoreToGrade(overallScore);
  const percentileRank = scoreToPercentile(overallScore);

  // Estimate fair rent: blend of city average, FMR, and adjustments
  const fmr = getHudFmr(input.citySlug);
  const fmrRent = fmr ? getFmrForBedrooms(fmr, input.bedrooms) : avgRent;
  let estimatedFairRent = avgRent * 0.6 + fmrRent * 0.4;

  // Adjust for amenities and floor level
  if (input.hasAmenities && input.hasAmenities.length > 0) {
    const amenityBonus = Math.min(input.hasAmenities.length * 35, 250);
    estimatedFairRent += amenityBonus;
  }
  if (input.floorLevel === "high") estimatedFairRent += 75;
  if (input.floorLevel === "penthouse") estimatedFairRent += 200;
  if (input.buildingAge !== undefined && input.buildingAge > 50) {
    estimatedFairRent -= Math.min(100, (input.buildingAge - 50) * 1.5);
  }

  estimatedFairRent = Math.round(estimatedFairRent);

  const potentialSavings = Math.max(
    0,
    Math.round(input.currentRent - estimatedFairRent)
  );
  const potentialSavingsAnnual = potentialSavings * 12;

  // Determine market conditions factor score for leverage calculation
  const marketConditionsFactor = factors.find(
    (f) => f.name === "Market Conditions"
  );
  const marketScore = marketConditionsFactor?.score ?? 50;

  const negotiationLeverage = getNegotiationLeverage(overallScore, marketScore);

  // Determine confidence based on amount of data provided
  let dataPoints = 2; // city + rent always provided
  if (input.sqft) dataPoints++;
  if (input.floorLevel) dataPoints++;
  if (input.hasAmenities && input.hasAmenities.length > 0) dataPoints++;
  if (input.buildingAge !== undefined) dataPoints++;
  if (input.neighborhood) dataPoints++;

  const confidence: "high" | "medium" | "low" =
    dataPoints >= 5 ? "high" : dataPoints >= 3 ? "medium" : "low";

  const summary = generateSummary(
    grade,
    overallScore,
    input.currentRent,
    estimatedFairRent,
    city,
    input.bedrooms
  );

  const recommendations = generateRecommendations(
    factors,
    overallScore,
    potentialSavings,
    city,
    input
  );

  return {
    overallScore,
    grade,
    percentileRank,
    negotiationLeverage,
    factors,
    estimatedFairRent,
    potentialSavings,
    potentialSavingsAnnual,
    confidence,
    summary,
    recommendations,
  };
}
