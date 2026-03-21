// ============================================================
// API Configuration: Detects which APIs are available
// ============================================================
// If API keys are set in .env.local, real APIs are used.
// Otherwise, the app falls back to mock data gracefully.
// ============================================================

export const apiConfig = {
  /** HUD Fair Market Rent API - Free, get key at huduser.gov */
  hud: {
    get isAvailable() {
      return !!process.env.HUD_API_KEY;
    },
    get apiKey() {
      return process.env.HUD_API_KEY || "";
    },
    baseUrl: "https://www.huduser.gov/hudapi/public",
  },

  /** RentCast API - Paid ($40/mo), get key at rentcast.io */
  rentcast: {
    get isAvailable() {
      return !!process.env.RENTCAST_API_KEY;
    },
    get apiKey() {
      return process.env.RENTCAST_API_KEY || "";
    },
    baseUrl: "https://api.rentcast.io/v1",
  },

  /** US Census Bureau API - Free, get key at census.gov */
  census: {
    get isAvailable() {
      return !!process.env.CENSUS_API_KEY;
    },
    get apiKey() {
      return process.env.CENSUS_API_KEY || "";
    },
    baseUrl: "https://api.census.gov/data",
  },

  /** Stripe - Free until you earn */
  stripe: {
    get isAvailable() {
      return !!process.env.STRIPE_SECRET_KEY;
    },
    get publicKey() {
      return process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";
    },
    get secretKey() {
      return process.env.STRIPE_SECRET_KEY || "";
    },
  },
};

/**
 * Log which APIs are configured (call during server startup).
 */
export function logApiStatus(): void {
  console.log("\n--- FareRent API Status ---");
  console.log(
    `  HUD FMR API:    ${apiConfig.hud.isAvailable ? "CONNECTED" : "using mock data (set HUD_API_KEY)"}`
  );
  console.log(
    `  RentCast API:   ${apiConfig.rentcast.isAvailable ? "CONNECTED" : "using mock data (set RENTCAST_API_KEY)"}`
  );
  console.log(
    `  Census API:     ${apiConfig.census.isAvailable ? "CONNECTED" : "using mock data (set CENSUS_API_KEY)"}`
  );
  console.log(
    `  Stripe:         ${apiConfig.stripe.isAvailable ? "CONNECTED" : "not configured (set STRIPE_SECRET_KEY)"}`
  );
  console.log("------------------------\n");
}
