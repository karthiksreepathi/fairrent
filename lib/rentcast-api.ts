import { apiConfig } from "./api-config";
import { getCityBySlug } from "@/data/cities";
import { rentalListings, type RentalListing } from "@/data/rental-listings";

// ============================================================
// RentCast API Integration
// Real rent estimates, comparables, and market data
// Docs: https://developers.rentcast.io/reference
// ============================================================

export interface RentEstimate {
  rent: number;
  rentRangeLow: number;
  rentRangeHigh: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  latitude: number;
  longitude: number;
  zipCode: string;
}

export interface RentCastListing {
  id: string;
  formattedAddress: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  price: number;
  propertyType: string;
  listedDate: string;
  lastSeenDate: string;
  daysOnMarket: number;
}

export interface MarketStatistics {
  averageRent: number;
  medianRent: number;
  minRent: number;
  maxRent: number;
  totalListings: number;
  averageSqft: number;
  rentPerSqft: number;
}

// -------------------------------------------------------
// Core API call helper
// -------------------------------------------------------

async function rentcastFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T | null> {
  if (!apiConfig.rentcast.isAvailable) return null;

  const url = new URL(`${apiConfig.rentcast.baseUrl}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "X-Api-Key": apiConfig.rentcast.apiKey,
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      console.error(
        `RentCast API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("RentCast API fetch failed:", error);
    return null;
  }
}

// -------------------------------------------------------
// API Methods
// -------------------------------------------------------

/**
 * Get rent estimate for a specific address.
 * Uses 1 API credit per call.
 */
export async function getRentEstimate(params: {
  address?: string;
  zipCode?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  propertyType?: string;
}): Promise<RentEstimate | null> {
  const result = await rentcastFetch<RentEstimate>("/avm/rent/long-term", {
    address: params.address || "",
    zipCode: params.zipCode || "",
    bedrooms: params.bedrooms?.toString() || "",
    bathrooms: params.bathrooms?.toString() || "",
    squareFootage: params.squareFootage?.toString() || "",
    propertyType: params.propertyType || "Apartment",
  });

  return result;
}

/**
 * Get active rental listings near an address or zip code.
 * Uses 1 API credit per call.
 */
export async function getRentalListings(params: {
  zipCode?: string;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  status?: "Active" | "Inactive";
  limit?: number;
}): Promise<RentCastListing[] | null> {
  const result = await rentcastFetch<RentCastListing[]>("/listings/rental/long-term", {
    zipCode: params.zipCode || "",
    city: params.city || "",
    state: params.state || "",
    bedrooms: params.bedrooms?.toString() || "",
    bathrooms: params.bathrooms?.toString() || "",
    status: params.status || "Active",
    limit: (params.limit || 20).toString(),
  });

  return result;
}

/**
 * Get market statistics for a zip code.
 * Uses 1 API credit per call.
 */
export async function getMarketStatistics(params: {
  zipCode?: string;
  city?: string;
  state?: string;
  bedrooms?: number;
}): Promise<MarketStatistics | null> {
  const result = await rentcastFetch<MarketStatistics>("/markets", {
    zipCode: params.zipCode || "",
    city: params.city || "",
    state: params.state || "",
    bedrooms: params.bedrooms?.toString() || "",
  });

  return result;
}

// -------------------------------------------------------
// Hybrid Functions (Real API with mock fallback)
// -------------------------------------------------------

/**
 * Get rent comparables for a city.
 * Uses RentCast if available, otherwise falls back to mock data.
 */
export async function getComparables(params: {
  citySlug: string;
  bedrooms: number;
  maxRent?: number;
  noFee?: boolean;
}): Promise<{
  listings: RentalListing[];
  source: "rentcast" | "mock";
}> {
  const city = getCityBySlug(params.citySlug);

  // Try RentCast API first
  if (apiConfig.rentcast.isAvailable && city) {
    try {
      const apiListings = await getRentalListings({
        city: city.name,
        state: city.stateCode,
        bedrooms: params.bedrooms,
        limit: 20,
      });

      if (apiListings && apiListings.length > 0) {
        // Transform RentCast listings to our format
        const transformed: RentalListing[] = apiListings.map((l, index) => ({
          id: l.id || `rc-${index}`,
          address: l.formattedAddress,
          citySlug: params.citySlug,
          neighborhood: l.city,
          bedrooms: l.bedrooms || params.bedrooms,
          bathrooms: l.bathrooms || 1,
          sqft: l.squareFootage || 0,
          rent: l.price,
          amenities: [],
          noFee: false,
          buildingAge: 0,
          floorLevel: "mid" as const,
          petFriendly: false,
          laundryType: "in-building" as const,
          postedDate: l.listedDate || new Date().toISOString().split("T")[0],
          available: true,
        }));

        return { listings: transformed, source: "rentcast" };
      }
    } catch (error) {
      console.error("RentCast comparables failed, using mock:", error);
    }
  }

  // Fallback to mock data
  let listings = rentalListings
    .filter((l) => l.citySlug === params.citySlug)
    .filter((l) => l.bedrooms === params.bedrooms);

  if (params.maxRent) {
    listings = listings.filter((l) => l.rent <= params.maxRent!);
  }

  if (params.noFee) {
    listings = listings.filter((l) => l.noFee);
  }

  return { listings, source: "mock" };
}

/**
 * Get rent estimate for a city + bedroom count.
 * Uses RentCast if available, otherwise falls back to mock city data.
 */
export async function getSmartRentEstimate(params: {
  citySlug: string;
  bedrooms: number;
  zipCode?: string;
  address?: string;
}): Promise<{
  estimate: number;
  low: number;
  high: number;
  source: "rentcast" | "mock";
}> {
  // Try RentCast API first
  if (apiConfig.rentcast.isAvailable && (params.zipCode || params.address)) {
    try {
      const estimate = await getRentEstimate({
        address: params.address,
        zipCode: params.zipCode,
        bedrooms: params.bedrooms,
      });

      if (estimate) {
        return {
          estimate: estimate.rent,
          low: estimate.rentRangeLow,
          high: estimate.rentRangeHigh,
          source: "rentcast",
        };
      }
    } catch (error) {
      console.error("RentCast estimate failed, using mock:", error);
    }
  }

  // Fallback to mock city data
  const city = getCityBySlug(params.citySlug);
  if (!city) {
    return { estimate: 1500, low: 1200, high: 1800, source: "mock" };
  }

  const avgRent =
    params.bedrooms === 0
      ? city.avgRentStudio
      : params.bedrooms === 1
        ? city.avgRent1Bed
        : params.bedrooms === 2
          ? city.avgRent2Bed
          : city.avgRent3Bed;

  return {
    estimate: avgRent,
    low: Math.round(avgRent * 0.85),
    high: Math.round(avgRent * 1.15),
    source: "mock",
  };
}
