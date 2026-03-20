import { apiConfig } from "./api-config";
import { getCityBySlug, type CityData } from "@/data/cities";

// ============================================================
// US Census Bureau API Integration
// Real demographic and economic data
// Docs: https://www.census.gov/data/developers.html
// ============================================================

// FIPS state codes for cities we support
const STATE_FIPS: Record<string, string> = {
  NY: "36",
  CA: "06",
  IL: "17",
  TX: "48",
  AZ: "04",
  WA: "53",
  CO: "08",
  FL: "12",
  MA: "25",
  DC: "11",
  GA: "13",
  MN: "27",
  OR: "41",
  PA: "42",
  TN: "47",
  MI: "26",
};

// Major city place FIPS codes
const CITY_PLACE_FIPS: Record<string, string> = {
  "new-york": "51000",
  "los-angeles": "44000",
  chicago: "14000",
  houston: "35000",
  phoenix: "55000",
  "san-francisco": "67000",
  seattle: "63000",
  austin: "05000",
  denver: "20000",
  miami: "45000",
  boston: "07000",
  "washington-dc": "50000",
  atlanta: "04000",
  dallas: "19000",
  minneapolis: "43000",
  portland: "59000",
  philadelphia: "60000",
  "san-diego": "66000",
  nashville: "52006",
  detroit: "22000",
};

export interface CensusData {
  medianIncome: number;
  medianRent: number;
  totalPopulation: number;
  renterOccupied: number;
  ownerOccupied: number;
  renterPercentage: number;
  vacancyRate: number;
  source: "census" | "mock";
}

// -------------------------------------------------------
// Core API call helper
// -------------------------------------------------------

async function censusFetch(
  dataset: string,
  year: number,
  variables: string[],
  forGeo: string,
  inGeo?: string
): Promise<string[][] | null> {
  if (!apiConfig.census.isAvailable) return null;

  const params = new URLSearchParams({
    get: variables.join(","),
    for: forGeo,
    key: apiConfig.census.apiKey,
  });

  if (inGeo) {
    params.set("in", inGeo);
  }

  const url = `${apiConfig.census.baseUrl}/${year}/${dataset}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 604800 }, // Cache for 7 days (census data is yearly)
    });

    if (!response.ok) {
      console.error(
        `Census API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return (await response.json()) as string[][];
  } catch (error) {
    console.error("Census API fetch failed:", error);
    return null;
  }
}

// -------------------------------------------------------
// API Methods
// -------------------------------------------------------

/**
 * Get key demographic/economic data for a city.
 * Uses American Community Survey (ACS) 5-Year estimates.
 *
 * Variables used:
 * - B19013_001E: Median household income
 * - B25064_001E: Median gross rent
 * - B01003_001E: Total population
 * - B25003_002E: Owner-occupied housing units
 * - B25003_003E: Renter-occupied housing units
 * - B25002_003E: Vacant housing units
 * - B25002_001E: Total housing units
 */
export async function getCityDemographics(
  citySlug: string
): Promise<CensusData | null> {
  const city = getCityBySlug(citySlug);
  if (!city) return null;

  const placeFips = CITY_PLACE_FIPS[citySlug];
  const stateFips = STATE_FIPS[city.stateCode];

  if (!placeFips || !stateFips) {
    return getMockCensusData(city);
  }

  // Try real Census API
  if (apiConfig.census.isAvailable) {
    try {
      const variables = [
        "B19013_001E", // Median household income
        "B25064_001E", // Median gross rent
        "B01003_001E", // Total population
        "B25003_002E", // Owner-occupied
        "B25003_003E", // Renter-occupied
        "B25002_003E", // Vacant units
        "B25002_001E", // Total units
      ];

      const data = await censusFetch(
        "acs/acs5",
        2023, // Latest available ACS 5-year
        variables,
        `place:${placeFips}`,
        `state:${stateFips}`
      );

      if (data && data.length >= 2) {
        // First row is headers, second row is data
        const row = data[1];
        const medianIncome = parseInt(row[0]) || city.medianIncome;
        const medianRent = parseInt(row[1]) || 0;
        const totalPopulation = parseInt(row[2]) || city.population;
        const ownerOccupied = parseInt(row[3]) || 0;
        const renterOccupied = parseInt(row[4]) || 0;
        const vacantUnits = parseInt(row[5]) || 0;
        const totalUnits = parseInt(row[6]) || 1;

        const totalOccupied = ownerOccupied + renterOccupied;
        const renterPercentage =
          totalOccupied > 0
            ? Math.round((renterOccupied / totalOccupied) * 100)
            : city.renterPercentage;
        const vacancyRate =
          totalUnits > 0
            ? Math.round((vacantUnits / totalUnits) * 10) / 10
            : city.vacancyRate;

        return {
          medianIncome,
          medianRent,
          totalPopulation,
          renterOccupied,
          ownerOccupied,
          renterPercentage,
          vacancyRate,
          source: "census",
        };
      }
    } catch (error) {
      console.error("Census API failed, using mock:", error);
    }
  }

  // Fallback to mock
  return getMockCensusData(city);
}

/**
 * Get mock census data from our static city data.
 */
function getMockCensusData(city: CityData): CensusData {
  const renterOccupied = Math.round(
    city.population * 0.38 * (city.renterPercentage / 100)
  );
  const ownerOccupied = Math.round(
    city.population * 0.38 * ((100 - city.renterPercentage) / 100)
  );

  return {
    medianIncome: city.medianIncome,
    medianRent: city.avgRent1Bed,
    totalPopulation: city.population,
    renterOccupied,
    ownerOccupied,
    renterPercentage: city.renterPercentage,
    vacancyRate: city.vacancyRate,
    source: "mock",
  };
}

/**
 * Get median income for rent-to-income calculations.
 * Uses Census if available, falls back to mock.
 */
export async function getMedianIncome(
  citySlug: string
): Promise<{ income: number; source: "census" | "mock" }> {
  const data = await getCityDemographics(citySlug);

  if (data && data.source === "census") {
    return { income: data.medianIncome, source: "census" };
  }

  const city = getCityBySlug(citySlug);
  return {
    income: city?.medianIncome || 60000,
    source: "mock",
  };
}
