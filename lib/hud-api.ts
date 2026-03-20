import { apiConfig } from "./api-config";
import {
  getHudFmr,
  compareToFmr,
  hudFmrData,
  type HudFmrData,
} from "@/data/hud-fmr";

// ============================================================
// HUD API: Fair Market Rent data access layer
// Real API docs: https://www.huduser.gov/portal/dataset/fmr-api.html
// ============================================================

/**
 * Transform HUD API response to our HudFmrData format.
 */
function transformHudApiResponse(
  apiData: Record<string, unknown>,
  citySlug: string,
  fipsCode: string
): HudFmrData {
  // HUD API returns data in basicdata or data object
  const data =
    (apiData.data as Record<string, unknown>) ||
    (apiData.basicdata as Record<string, unknown>) ||
    apiData;

  // The API field names vary by endpoint, handle common patterns
  const efficiency =
    (data.Efficiency as number) ||
    (data.fmr_0 as number) ||
    (data.efficiency as number) ||
    0;
  const oneBedroom =
    (data["One-Bedroom"] as number) ||
    (data.fmr_1 as number) ||
    (data.one_bedroom as number) ||
    0;
  const twoBedroom =
    (data["Two-Bedroom"] as number) ||
    (data.fmr_2 as number) ||
    (data.two_bedroom as number) ||
    0;
  const threeBedroom =
    (data["Three-Bedroom"] as number) ||
    (data.fmr_3 as number) ||
    (data.three_bedroom as number) ||
    0;
  const fourBedroom =
    (data["Four-Bedroom"] as number) ||
    (data.fmr_4 as number) ||
    (data.four_bedroom as number) ||
    0;

  const medianRent = Math.round(twoBedroom * 1.12); // Estimate median from 2-bed FMR
  const percentile40 = twoBedroom;
  const percentile50 = medianRent;

  return {
    citySlug,
    fipsCode,
    metroArea:
      (data.metro_name as string) ||
      (data.areaname as string) ||
      `Metro area ${fipsCode}`,
    year: (data.year as number) || new Date().getFullYear(),
    efficiency,
    oneBedroom,
    twoBedroom,
    threeBedroom,
    fourBedroom,
    medianRent,
    percentile40,
    percentile50,
  };
}

/**
 * Fetch FMR data for a given city.
 * Makes a real HUD API call if HUD_API_KEY is set, otherwise uses static data.
 */
export async function fetchFmrData(
  citySlug: string
): Promise<HudFmrData | null> {
  // Get static data first (we need the FIPS code for the API call)
  const staticData = getStaticFmrData(citySlug);

  // If HUD API key is available, try real API
  if (apiConfig.hud.isAvailable && staticData) {
    try {
      // HUD API uses entity IDs (CBSA FIPS codes for metro areas)
      const response = await fetch(
        `${apiConfig.hud.baseUrl}/fmr/data/${staticData.fipsCode}`,
        {
          headers: {
            Authorization: `Bearer ${apiConfig.hud.apiKey}`,
          },
          next: { revalidate: 86400 * 30 }, // Cache for 30 days (FMR updates yearly)
        }
      );

      if (response.ok) {
        const apiData = await response.json();
        return transformHudApiResponse(apiData, citySlug, staticData.fipsCode);
      }

      console.error(`HUD API error: ${response.status} - falling back to static data`);
    } catch (error) {
      console.error("HUD API fetch failed, using static data:", error);
    }
  }

  // Fallback to static data
  return staticData;
}

/**
 * Fetch FMR data by ZIP code (HUD API only).
 * Returns null if HUD API key is not set.
 */
export async function fetchFmrByZip(
  zipCode: string
): Promise<HudFmrData | null> {
  if (!apiConfig.hud.isAvailable) return null;

  try {
    const response = await fetch(
      `${apiConfig.hud.baseUrl}/fmr/data/${zipCode}`,
      {
        headers: {
          Authorization: `Bearer ${apiConfig.hud.apiKey}`,
        },
        next: { revalidate: 86400 * 30 },
      }
    );

    if (response.ok) {
      const apiData = await response.json();
      return transformHudApiResponse(apiData, `zip-${zipCode}`, zipCode);
    }
  } catch (error) {
    console.error("HUD API ZIP lookup failed:", error);
  }

  return null;
}

/**
 * Get static FMR data for a city from the local dataset.
 */
export function getStaticFmrData(citySlug: string): HudFmrData | null {
  return getHudFmr(citySlug) ?? null;
}

/**
 * Compare a tenant's rent against the HUD Fair Market Rent.
 * Returns detailed comparison including the FMR value, difference,
 * percentage above/below, and an assessment string.
 */
export function compareTenantRentToFmr(
  citySlug: string,
  bedrooms: number,
  currentRent: number
): {
  fmr: number;
  difference: number;
  percentAbove: number;
  assessment: string;
} | null {
  return compareToFmr(citySlug, bedrooms, currentRent);
}

/**
 * Get the FMR value for a specific bedroom count in a city.
 */
export function getFmrRent(
  citySlug: string,
  bedrooms: number
): number | null {
  const data = getHudFmr(citySlug);
  if (!data) return null;

  const fmrMap: Record<number, number> = {
    0: data.efficiency,
    1: data.oneBedroom,
    2: data.twoBedroom,
    3: data.threeBedroom,
    4: data.fourBedroom,
  };

  return fmrMap[bedrooms] ?? data.twoBedroom;
}

/**
 * Check if a rent is within a reasonable range of the FMR.
 * "Reasonable" is defined as within 120% of the FMR.
 */
export function isRentWithinFmrRange(
  citySlug: string,
  bedrooms: number,
  rent: number,
  threshold: number = 1.2
): boolean {
  const fmr = getFmrRent(citySlug, bedrooms);
  if (fmr === null) return true; // No data available, assume within range

  return rent <= fmr * threshold;
}

/**
 * Get all available FMR data entries.
 * Useful for listing supported cities.
 */
export function getAllFmrCities(): { citySlug: string; metroArea: string }[] {
  return hudFmrData.map((d) => ({
    citySlug: d.citySlug,
    metroArea: d.metroArea,
  }));
}
