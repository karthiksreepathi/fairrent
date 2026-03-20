import { getCityBySlug } from "@/data/cities";
import { formatCurrency } from "@/lib/rent-calculator";

// ============================================================
// Negotiation Engine: Professional letter generation
// ============================================================

export interface NegotiationInput {
  tenantName: string;
  landlordName: string;
  propertyAddress: string;
  currentRent: number;
  proposedRent?: number;
  leaseEndDate?: string;
  citySlug: string;
  bedrooms: number;
  yearsAsTenant?: number;
  marketAvgRent: number;
  comparableRents?: number[];
  buildingViolations?: number;
  tone: "professional" | "firm" | "friendly";
  letterType: "reduction" | "renewal" | "initial";
}

export interface NegotiationLetter {
  subject: string;
  body: string;
  keyPoints: string[];
  suggestedFollowUp: string;
}

// ---------------------
// Internal helpers
// ---------------------

function formatDate(dateStr?: string): string {
  if (!dateStr) {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getBedroomLabel(bedrooms: number): string {
  if (bedrooms === 0) return "studio";
  if (bedrooms === 1) return "one-bedroom";
  if (bedrooms === 2) return "two-bedroom";
  if (bedrooms === 3) return "three-bedroom";
  return `${bedrooms}-bedroom`;
}

function getSalutation(tone: "professional" | "firm" | "friendly", name: string): string {
  if (tone === "friendly") return `Dear ${name},`;
  return `Dear ${name},`;
}

function getClosing(tone: "professional" | "firm" | "friendly", tenantName: string): string {
  if (tone === "friendly") {
    return `Thank you for your time and consideration. I truly enjoy living here and hope we can reach an agreement that works for both of us.\n\nWarm regards,\n${tenantName}`;
  }
  if (tone === "firm") {
    return `I look forward to your prompt response regarding this matter. Please let me know your decision within 14 business days so that I may plan accordingly.\n\nSincerely,\n${tenantName}`;
  }
  return `Thank you for your consideration. I am happy to discuss this further at your convenience and hope we can reach a mutually beneficial agreement.\n\nSincerely,\n${tenantName}`;
}

function buildComparablesSection(comparableRents: number[], bedrooms: number): string {
  if (comparableRents.length === 0) return "";

  const avgComparable = Math.round(
    comparableRents.reduce((s, r) => s + r, 0) / comparableRents.length
  );
  const lowestComparable = Math.min(...comparableRents);
  const bedroomLabel = getBedroomLabel(bedrooms);

  let section = `\nI have researched comparable ${bedroomLabel} apartments in the area and found the following rental rates:\n\n`;

  comparableRents.forEach((rent, i) => {
    section += `  - Comparable Unit ${i + 1}: ${formatCurrency(rent)}/month\n`;
  });

  section += `\nThe average rent among these comparable units is ${formatCurrency(avgComparable)}/month, with the lowest being ${formatCurrency(lowestComparable)}/month.\n`;

  return section;
}

function buildViolationsSection(violations: number, tone: "professional" | "firm" | "friendly"): string {
  if (violations <= 0) return "";

  if (tone === "firm") {
    return `\nI would also like to note that the building currently has ${violations} outstanding violation${violations > 1 ? "s" : ""} on record. These unresolved issues directly affect the habitability and value of the unit. I expect these concerns to be addressed alongside any rent discussion.\n`;
  }

  return `\nAdditionally, I am aware that the building has ${violations} outstanding violation${violations > 1 ? "s" : ""} on record. I would appreciate your attention to these matters, as they affect the quality of the living environment.\n`;
}

function buildTenantHistorySection(years: number, tone: "professional" | "firm" | "friendly"): string {
  if (years <= 0) return "";

  const reliability = years >= 5
    ? "long-standing and reliable"
    : years >= 3
      ? "reliable and consistent"
      : "responsible";

  if (tone === "friendly") {
    return `As a ${reliability} tenant for ${years > 1 ? `the past ${years} years` : "over a year"}, I have always paid rent on time and maintained the apartment in excellent condition. I value our rental relationship and would love to continue living here.\n`;
  }

  return `As a ${reliability} tenant for ${years > 1 ? `the past ${years} years` : "over a year"}, I have consistently paid rent on time and maintained the apartment in excellent condition. Retaining a dependable tenant avoids the costs associated with vacancy, turnover, and finding new renters.\n`;
}

// ============================================================
// Letter generators by type
// ============================================================

function generateReductionLetter(input: NegotiationInput): NegotiationLetter {
  const city = getCityBySlug(input.citySlug);
  const cityName = city?.name ?? "this area";
  const bedroomLabel = getBedroomLabel(input.bedrooms);
  const proposed = input.proposedRent ?? Math.round(input.marketAvgRent * 0.97);
  const savings = input.currentRent - proposed;
  const today = getTodayFormatted();

  let subject: string;
  if (input.tone === "firm") {
    subject = `Formal Request for Rent Reduction at ${input.propertyAddress}`;
  } else if (input.tone === "friendly") {
    subject = `Rent Discussion for ${input.propertyAddress}`;
  } else {
    subject = `Request for Rent Adjustment at ${input.propertyAddress}`;
  }

  // Build the body
  let body = `${today}\n\n`;
  body += `${input.tenantName}\n${input.propertyAddress}\n\n`;
  body += `${input.landlordName}\nRe: ${input.propertyAddress}\n\n`;
  body += getSalutation(input.tone, input.landlordName) + "\n\n";

  // Opening paragraph
  if (input.tone === "friendly") {
    body += `I hope this message finds you well. I am writing to discuss the current rent for my ${bedroomLabel} apartment at ${input.propertyAddress}. I have thoroughly enjoyed living here and would like to continue doing so. However, after reviewing current market conditions in ${cityName}, I believe there is an opportunity to adjust the rent to better reflect the market.\n`;
  } else if (input.tone === "firm") {
    body += `I am writing to formally request a reduction in rent for my ${bedroomLabel} apartment at ${input.propertyAddress}. After conducting a thorough analysis of current rental market conditions in ${cityName}, I have determined that my current rent of ${formatCurrency(input.currentRent)}/month is above the prevailing market rate.\n`;
  } else {
    body += `I am writing to respectfully request a rent adjustment for my ${bedroomLabel} apartment at ${input.propertyAddress}. After researching current market conditions in ${cityName}, I believe the current rent of ${formatCurrency(input.currentRent)}/month exceeds the fair market value for this unit.\n`;
  }

  // Market data paragraph
  body += `\nAccording to my research, the average rent for a ${bedroomLabel} apartment in ${cityName} is currently ${formatCurrency(input.marketAvgRent)}/month. My current rent of ${formatCurrency(input.currentRent)} is ${formatCurrency(input.currentRent - input.marketAvgRent)} above this average, representing a ${(((input.currentRent - input.marketAvgRent) / input.marketAvgRent) * 100).toFixed(1)}% premium over typical market pricing.\n`;

  // Comparables
  if (input.comparableRents && input.comparableRents.length > 0) {
    body += buildComparablesSection(input.comparableRents, input.bedrooms);
  }

  // Tenant history
  if (input.yearsAsTenant && input.yearsAsTenant > 0) {
    body += "\n" + buildTenantHistorySection(input.yearsAsTenant, input.tone);
  }

  // Violations
  if (input.buildingViolations && input.buildingViolations > 0) {
    body += buildViolationsSection(input.buildingViolations, input.tone);
  }

  // Proposal paragraph
  body += `\nBased on this analysis, I am requesting a rent adjustment to ${formatCurrency(proposed)}/month, which represents a reduction of ${formatCurrency(savings)}/month. This rate is in line with current market conditions and reflects the true value of the unit.\n`;

  // Closing
  body += "\n" + getClosing(input.tone, input.tenantName);

  // Key points
  const keyPoints = [
    `Current rent (${formatCurrency(input.currentRent)}) exceeds the market average (${formatCurrency(input.marketAvgRent)}) by ${(((input.currentRent - input.marketAvgRent) / input.marketAvgRent) * 100).toFixed(1)}%`,
    `Proposed rent: ${formatCurrency(proposed)}/month (saving ${formatCurrency(savings)}/month)`,
  ];

  if (input.comparableRents && input.comparableRents.length > 0) {
    const avgComp = Math.round(
      input.comparableRents.reduce((s, r) => s + r, 0) / input.comparableRents.length
    );
    keyPoints.push(
      `${input.comparableRents.length} comparable units found with an average rent of ${formatCurrency(avgComp)}`
    );
  }
  if (input.yearsAsTenant && input.yearsAsTenant >= 2) {
    keyPoints.push(
      `Strong tenant history: ${input.yearsAsTenant} years of reliable tenancy`
    );
  }
  if (input.buildingViolations && input.buildingViolations > 0) {
    keyPoints.push(
      `${input.buildingViolations} outstanding building violation${input.buildingViolations > 1 ? "s" : ""} on record`
    );
  }

  const suggestedFollowUp =
    input.tone === "firm"
      ? "Follow up within 7 days if no response is received. Consider sending a certified copy for documentation."
      : "Follow up within 10 to 14 days if you have not received a response. A polite phone call or in-person conversation can be effective.";

  return { subject, body, keyPoints, suggestedFollowUp };
}

function generateRenewalLetter(input: NegotiationInput): NegotiationLetter {
  const city = getCityBySlug(input.citySlug);
  const cityName = city?.name ?? "this area";
  const bedroomLabel = getBedroomLabel(input.bedrooms);
  const proposed = input.proposedRent ?? Math.round(input.currentRent * 1.02);
  const increase = proposed - input.currentRent;
  const increasePercent = ((increase / input.currentRent) * 100).toFixed(1);
  const today = getTodayFormatted();
  const leaseEnd = input.leaseEndDate ? formatDate(input.leaseEndDate) : "the end of the current lease term";

  let subject: string;
  if (input.tone === "firm") {
    subject = `Response to Proposed Lease Renewal Terms at ${input.propertyAddress}`;
  } else {
    subject = `Lease Renewal Discussion for ${input.propertyAddress}`;
  }

  let body = `${today}\n\n`;
  body += `${input.tenantName}\n${input.propertyAddress}\n\n`;
  body += `${input.landlordName}\nRe: Lease Renewal at ${input.propertyAddress}\n\n`;
  body += getSalutation(input.tone, input.landlordName) + "\n\n";

  // Opening
  if (input.tone === "friendly") {
    body += `Thank you for the lease renewal offer for my ${bedroomLabel} apartment at ${input.propertyAddress}. I appreciate you reaching out ahead of the lease expiration on ${leaseEnd}. I would like to discuss the proposed terms.\n`;
  } else if (input.tone === "firm") {
    body += `I am writing in response to the proposed lease renewal for my ${bedroomLabel} apartment at ${input.propertyAddress}, with the current lease expiring on ${leaseEnd}. While I intend to continue my tenancy, I have concerns regarding the proposed rent increase.\n`;
  } else {
    body += `I am writing regarding the upcoming lease renewal for my ${bedroomLabel} apartment at ${input.propertyAddress}. My current lease expires on ${leaseEnd}, and I would like to discuss the proposed renewal terms.\n`;
  }

  // Analysis of the proposed increase
  if (increase > 0) {
    body += `\nThe proposed new rent of ${formatCurrency(proposed)}/month represents an increase of ${formatCurrency(increase)} (${increasePercent}%) from my current rent of ${formatCurrency(input.currentRent)}. The current market average for a comparable ${bedroomLabel} in ${cityName} is ${formatCurrency(input.marketAvgRent)}/month.\n`;

    if (proposed > input.marketAvgRent) {
      body += `\nThe proposed rent would place my rent ${formatCurrency(proposed - input.marketAvgRent)} above the current market average for the area. I believe a more modest increase would be more appropriate given market conditions.\n`;
    }
  } else {
    body += `\nI appreciate that the proposed rent of ${formatCurrency(proposed)}/month reflects a reasonable renewal rate. For context, the current market average for a comparable ${bedroomLabel} in ${cityName} is ${formatCurrency(input.marketAvgRent)}/month.\n`;
  }

  // Comparables
  if (input.comparableRents && input.comparableRents.length > 0) {
    body += buildComparablesSection(input.comparableRents, input.bedrooms);
  }

  // Tenant history
  if (input.yearsAsTenant && input.yearsAsTenant > 0) {
    body += "\n" + buildTenantHistorySection(input.yearsAsTenant, input.tone);
  }

  // Violations
  if (input.buildingViolations && input.buildingViolations > 0) {
    body += buildViolationsSection(input.buildingViolations, input.tone);
  }

  // Counter-proposal
  const counterProposal = Math.round(
    Math.min(proposed, input.currentRent + (input.marketAvgRent - input.currentRent) * 0.3)
  );
  if (increase > 0 && proposed > input.marketAvgRent * 0.95) {
    body += `\nI would like to propose a renewal rent of ${formatCurrency(counterProposal)}/month. This figure accounts for reasonable increases while remaining aligned with current market conditions in ${cityName}.\n`;
  }

  // Closing
  body += "\n" + getClosing(input.tone, input.tenantName);

  const keyPoints = [
    `Proposed increase: ${formatCurrency(increase)}/month (${increasePercent}%)`,
    `Market average for a ${bedroomLabel}: ${formatCurrency(input.marketAvgRent)}/month`,
  ];
  if (increase > 0 && proposed > input.marketAvgRent * 0.95) {
    keyPoints.push(`Counter-proposal: ${formatCurrency(counterProposal)}/month`);
  }
  if (input.yearsAsTenant && input.yearsAsTenant >= 2) {
    keyPoints.push(`${input.yearsAsTenant} years of reliable tenancy to leverage`);
  }

  const suggestedFollowUp =
    "Respond before the renewal deadline. If your landlord does not engage within 10 days, follow up in writing and keep a copy for your records.";

  return { subject, body, keyPoints, suggestedFollowUp };
}

function generateInitialLetter(input: NegotiationInput): NegotiationLetter {
  const city = getCityBySlug(input.citySlug);
  const cityName = city?.name ?? "this area";
  const bedroomLabel = getBedroomLabel(input.bedrooms);
  const proposed = input.proposedRent ?? Math.round(input.marketAvgRent * 0.95);
  const today = getTodayFormatted();

  const subject = `Rental Application and Rate Discussion for ${input.propertyAddress}`;

  let body = `${today}\n\n`;
  body += `${input.tenantName}\n\n`;
  body += `${input.landlordName}\nRe: ${input.propertyAddress}\n\n`;
  body += getSalutation(input.tone, input.landlordName) + "\n\n";

  // Opening
  body += `I am writing to express my strong interest in renting the ${bedroomLabel} apartment at ${input.propertyAddress}. After viewing the unit, I believe it would be an excellent fit for my needs. I would like to discuss the listed rent before moving forward.\n`;

  // Market context
  body += `\nBased on my research into the ${cityName} rental market, the average rent for a comparable ${bedroomLabel} apartment in this area is ${formatCurrency(input.marketAvgRent)}/month. The listed rent of ${formatCurrency(input.currentRent)}/month is ${input.currentRent > input.marketAvgRent ? `${formatCurrency(input.currentRent - input.marketAvgRent)} above` : `in line with`} the current market average.\n`;

  // Comparables
  if (input.comparableRents && input.comparableRents.length > 0) {
    body += buildComparablesSection(input.comparableRents, input.bedrooms);
  }

  // What you bring as a tenant
  body += `\nI am a responsible and reliable prospective tenant. I can provide strong references, proof of income, and a solid rental history. I am prepared to sign a 12-month lease and commit to maintaining the apartment in excellent condition.\n`;

  // Proposal
  body += `\nI would like to propose a monthly rent of ${formatCurrency(proposed)}, which reflects both the market conditions in ${cityName} and the value I bring as a dependable, long-term tenant. I am open to discussing terms that work well for both of us.\n`;

  // Closing
  body += "\n" + getClosing(input.tone, input.tenantName);

  const keyPoints = [
    `Listed rent: ${formatCurrency(input.currentRent)}/month`,
    `Market average: ${formatCurrency(input.marketAvgRent)}/month`,
    `Proposed rent: ${formatCurrency(proposed)}/month`,
    "Strong tenant profile with references and proof of income",
  ];

  const suggestedFollowUp =
    "Follow up within 3 to 5 days, especially if other applicants may be competing for the unit. Express continued interest and willingness to finalize terms.";

  return { subject, body, keyPoints, suggestedFollowUp };
}

// ============================================================
// Main export
// ============================================================

export function generateNegotiationLetter(
  input: NegotiationInput
): NegotiationLetter {
  switch (input.letterType) {
    case "reduction":
      return generateReductionLetter(input);
    case "renewal":
      return generateRenewalLetter(input);
    case "initial":
      return generateInitialLetter(input);
    default:
      return generateReductionLetter(input);
  }
}
