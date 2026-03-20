import { rentalListings, type RentalListing } from "@/data/rental-listings";
import { formatCurrency } from "@/lib/rent-calculator";

// ============================================================
// Comparable Finder: Search and analyze comparable rental units
// ============================================================

export interface ComparableFilters {
  citySlug: string;
  bedrooms: number;
  maxRent?: number;
  minSqft?: number;
  amenities?: string[];
  noFee?: boolean;
}

export interface ComparableResult {
  listings: RentalListing[];
  averageRent: number;
  medianRent: number;
  lowestRent: number;
  highestRent: number;
  count: number;
  summary: string;
}

// ---------------------
// Internal helpers
// ---------------------

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

function matchesAmenityFilter(
  listing: RentalListing,
  requiredAmenities: string[]
): boolean {
  if (requiredAmenities.length === 0) return true;

  const listingAmenities = listing.amenities.map((a) =>
    a.toLowerCase().replace(/\s+/g, "-")
  );

  // Check if the listing has at least some of the required amenities
  // We use a partial match: if the listing has at least half of the requested amenities, include it
  const matchCount = requiredAmenities.filter((req) => {
    const normalized = req.toLowerCase().replace(/\s+/g, "-");
    return listingAmenities.some(
      (la) => la.includes(normalized) || normalized.includes(la)
    );
  }).length;

  return matchCount >= Math.ceil(requiredAmenities.length / 2);
}

function getBedroomLabel(bedrooms: number): string {
  if (bedrooms === 0) return "studio";
  if (bedrooms === 1) return "1-bedroom";
  return `${bedrooms}-bedroom`;
}

function generateSummary(
  listings: RentalListing[],
  averageRent: number,
  medianRent: number,
  lowestRent: number,
  highestRent: number,
  bedrooms: number,
  citySlug: string
): string {
  const bedroomLabel = getBedroomLabel(bedrooms);
  const count = listings.length;

  if (count === 0) {
    return `No comparable ${bedroomLabel} listings were found matching your criteria. Try broadening your search by removing some filters.`;
  }

  if (count === 1) {
    return `Found 1 comparable ${bedroomLabel} listing at ${formatCurrency(listings[0].rent)}/month in ${listings[0].neighborhood}.`;
  }

  const rangeStr =
    lowestRent === highestRent
      ? formatCurrency(lowestRent)
      : `${formatCurrency(lowestRent)} to ${formatCurrency(highestRent)}`;

  return `Found ${count} comparable ${bedroomLabel} listings ranging from ${rangeStr}/month. The average rent is ${formatCurrency(averageRent)} and the median is ${formatCurrency(medianRent)}.`;
}

// ============================================================
// Main export
// ============================================================

export function findComparableUnits(
  filters: ComparableFilters
): ComparableResult {
  let results = rentalListings.filter((listing) => {
    // Must match city
    if (listing.citySlug !== filters.citySlug) return false;

    // Must match bedroom count
    if (listing.bedrooms !== filters.bedrooms) return false;

    // Must be available
    if (!listing.available) return false;

    // Max rent filter
    if (filters.maxRent !== undefined && listing.rent > filters.maxRent) {
      return false;
    }

    // Min sqft filter
    if (filters.minSqft !== undefined && listing.sqft < filters.minSqft) {
      return false;
    }

    // No-fee filter
    if (filters.noFee === true && !listing.noFee) {
      return false;
    }

    // Amenity filter
    if (filters.amenities && filters.amenities.length > 0) {
      if (!matchesAmenityFilter(listing, filters.amenities)) {
        return false;
      }
    }

    return true;
  });

  // Sort by rent (lowest first)
  results.sort((a, b) => a.rent - b.rent);

  // Calculate statistics
  if (results.length === 0) {
    return {
      listings: [],
      averageRent: 0,
      medianRent: 0,
      lowestRent: 0,
      highestRent: 0,
      count: 0,
      summary: generateSummary(
        [],
        0,
        0,
        0,
        0,
        filters.bedrooms,
        filters.citySlug
      ),
    };
  }

  const rents = results.map((l) => l.rent);
  const averageRent = Math.round(
    rents.reduce((sum, r) => sum + r, 0) / rents.length
  );
  const medianRent = calculateMedian(rents);
  const lowestRent = Math.min(...rents);
  const highestRent = Math.max(...rents);

  const summary = generateSummary(
    results,
    averageRent,
    medianRent,
    lowestRent,
    highestRent,
    filters.bedrooms,
    filters.citySlug
  );

  return {
    listings: results,
    averageRent,
    medianRent,
    lowestRent,
    highestRent,
    count: results.length,
    summary,
  };
}
