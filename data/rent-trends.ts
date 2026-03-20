export interface MonthlyRentData {
  month: string;
  avgRentStudio: number;
  avgRent1Bed: number;
  avgRent2Bed: number;
  avgRent3Bed: number;
  inventory: number;
  daysOnMarket: number;
  newListings: number;
}

export interface SeasonalityData {
  month: number;
  factor: number;
  label: string;
}

export interface CityRentTrends {
  citySlug: string;
  monthly: MonthlyRentData[];
  seasonality: SeasonalityData[];
  yearOverYearChange: number;
  averageDaysOnMarket: number;
  inventoryTrend: "increasing" | "decreasing" | "stable";
}

const standardSeasonality: SeasonalityData[] = [
  { month: 1, factor: 0.96, label: "January" },
  { month: 2, factor: 0.96, label: "February" },
  { month: 3, factor: 0.98, label: "March" },
  { month: 4, factor: 1.00, label: "April" },
  { month: 5, factor: 1.03, label: "May" },
  { month: 6, factor: 1.05, label: "June" },
  { month: 7, factor: 1.06, label: "July" },
  { month: 8, factor: 1.05, label: "August" },
  { month: 9, factor: 1.02, label: "September" },
  { month: 10, factor: 1.00, label: "October" },
  { month: 11, factor: 0.97, label: "November" },
  { month: 12, factor: 0.95, label: "December" },
];

const mildSeasonality: SeasonalityData[] = [
  { month: 1, factor: 0.98, label: "January" },
  { month: 2, factor: 0.98, label: "February" },
  { month: 3, factor: 0.99, label: "March" },
  { month: 4, factor: 1.00, label: "April" },
  { month: 5, factor: 1.02, label: "May" },
  { month: 6, factor: 1.03, label: "June" },
  { month: 7, factor: 1.03, label: "July" },
  { month: 8, factor: 1.02, label: "August" },
  { month: 9, factor: 1.01, label: "September" },
  { month: 10, factor: 1.00, label: "October" },
  { month: 11, factor: 0.99, label: "November" },
  { month: 12, factor: 0.97, label: "December" },
];

const sunbeltSeasonality: SeasonalityData[] = [
  { month: 1, factor: 1.03, label: "January" },
  { month: 2, factor: 1.04, label: "February" },
  { month: 3, factor: 1.03, label: "March" },
  { month: 4, factor: 1.01, label: "April" },
  { month: 5, factor: 0.99, label: "May" },
  { month: 6, factor: 0.97, label: "June" },
  { month: 7, factor: 0.96, label: "July" },
  { month: 8, factor: 0.96, label: "August" },
  { month: 9, factor: 0.97, label: "September" },
  { month: 10, factor: 0.99, label: "October" },
  { month: 11, factor: 1.01, label: "November" },
  { month: 12, factor: 1.02, label: "December" },
];

interface CityConfig {
  slug: string;
  base1Bed: number;
  studioRatio: number;
  twoBedRatio: number;
  threeBedRatio: number;
  monthlyTrendPct: number;
  baseInventory: number;
  baseDom: number;
  baseListings: number;
  seasonality: SeasonalityData[];
  yoyChange: number;
  inventoryTrend: "increasing" | "decreasing" | "stable";
}

const cityConfigs: CityConfig[] = [
  {
    slug: "new-york",
    base1Bed: 3450,
    studioRatio: 0.82,
    twoBedRatio: 1.42,
    threeBedRatio: 1.85,
    monthlyTrendPct: 0.003,
    baseInventory: 12500,
    baseDom: 19,
    baseListings: 3800,
    seasonality: standardSeasonality,
    yoyChange: 3.8,
    inventoryTrend: "stable",
  },
  {
    slug: "los-angeles",
    base1Bed: 2150,
    studioRatio: 0.80,
    twoBedRatio: 1.45,
    threeBedRatio: 1.90,
    monthlyTrendPct: 0.002,
    baseInventory: 9800,
    baseDom: 25,
    baseListings: 3200,
    seasonality: standardSeasonality,
    yoyChange: 2.5,
    inventoryTrend: "stable",
  },
  {
    slug: "chicago",
    base1Bed: 1650,
    studioRatio: 0.78,
    twoBedRatio: 1.40,
    threeBedRatio: 1.82,
    monthlyTrendPct: 0.0015,
    baseInventory: 8200,
    baseDom: 28,
    baseListings: 2600,
    seasonality: standardSeasonality,
    yoyChange: 1.8,
    inventoryTrend: "stable",
  },
  {
    slug: "houston",
    base1Bed: 1250,
    studioRatio: 0.80,
    twoBedRatio: 1.42,
    threeBedRatio: 1.88,
    monthlyTrendPct: 0.001,
    baseInventory: 11200,
    baseDom: 32,
    baseListings: 3500,
    seasonality: sunbeltSeasonality,
    yoyChange: 1.2,
    inventoryTrend: "increasing",
  },
  {
    slug: "phoenix",
    base1Bed: 1180,
    studioRatio: 0.79,
    twoBedRatio: 1.44,
    threeBedRatio: 1.90,
    monthlyTrendPct: -0.002,
    baseInventory: 9500,
    baseDom: 30,
    baseListings: 3100,
    seasonality: sunbeltSeasonality,
    yoyChange: -2.1,
    inventoryTrend: "increasing",
  },
  {
    slug: "san-francisco",
    base1Bed: 2950,
    studioRatio: 0.83,
    twoBedRatio: 1.48,
    threeBedRatio: 1.92,
    monthlyTrendPct: 0.0025,
    baseInventory: 5200,
    baseDom: 22,
    baseListings: 1800,
    seasonality: mildSeasonality,
    yoyChange: 3.2,
    inventoryTrend: "decreasing",
  },
  {
    slug: "seattle",
    base1Bed: 1850,
    studioRatio: 0.81,
    twoBedRatio: 1.43,
    threeBedRatio: 1.87,
    monthlyTrendPct: 0.002,
    baseInventory: 6100,
    baseDom: 24,
    baseListings: 2100,
    seasonality: standardSeasonality,
    yoyChange: 2.4,
    inventoryTrend: "stable",
  },
  {
    slug: "austin",
    base1Bed: 1550,
    studioRatio: 0.78,
    twoBedRatio: 1.41,
    threeBedRatio: 1.86,
    monthlyTrendPct: -0.0015,
    baseInventory: 8800,
    baseDom: 33,
    baseListings: 3000,
    seasonality: sunbeltSeasonality,
    yoyChange: -1.5,
    inventoryTrend: "increasing",
  },
  {
    slug: "denver",
    base1Bed: 1600,
    studioRatio: 0.79,
    twoBedRatio: 1.42,
    threeBedRatio: 1.85,
    monthlyTrendPct: -0.001,
    baseInventory: 7200,
    baseDom: 27,
    baseListings: 2400,
    seasonality: standardSeasonality,
    yoyChange: -1.0,
    inventoryTrend: "increasing",
  },
  {
    slug: "miami",
    base1Bed: 1950,
    studioRatio: 0.81,
    twoBedRatio: 1.46,
    threeBedRatio: 1.92,
    monthlyTrendPct: 0.0005,
    baseInventory: 7800,
    baseDom: 26,
    baseListings: 2700,
    seasonality: sunbeltSeasonality,
    yoyChange: 0.6,
    inventoryTrend: "stable",
  },
  {
    slug: "boston",
    base1Bed: 2650,
    studioRatio: 0.82,
    twoBedRatio: 1.44,
    threeBedRatio: 1.88,
    monthlyTrendPct: 0.003,
    baseInventory: 4800,
    baseDom: 18,
    baseListings: 1600,
    seasonality: standardSeasonality,
    yoyChange: 3.6,
    inventoryTrend: "decreasing",
  },
  {
    slug: "washington-dc",
    base1Bed: 2100,
    studioRatio: 0.82,
    twoBedRatio: 1.43,
    threeBedRatio: 1.87,
    monthlyTrendPct: 0.002,
    baseInventory: 6500,
    baseDom: 23,
    baseListings: 2200,
    seasonality: standardSeasonality,
    yoyChange: 2.2,
    inventoryTrend: "stable",
  },
  {
    slug: "atlanta",
    base1Bed: 1500,
    studioRatio: 0.79,
    twoBedRatio: 1.42,
    threeBedRatio: 1.86,
    monthlyTrendPct: 0.001,
    baseInventory: 9200,
    baseDom: 29,
    baseListings: 3000,
    seasonality: sunbeltSeasonality,
    yoyChange: 1.3,
    inventoryTrend: "stable",
  },
  {
    slug: "dallas",
    base1Bed: 1350,
    studioRatio: 0.79,
    twoBedRatio: 1.43,
    threeBedRatio: 1.88,
    monthlyTrendPct: 0.0005,
    baseInventory: 10500,
    baseDom: 31,
    baseListings: 3400,
    seasonality: sunbeltSeasonality,
    yoyChange: 0.5,
    inventoryTrend: "increasing",
  },
  {
    slug: "minneapolis",
    base1Bed: 1300,
    studioRatio: 0.78,
    twoBedRatio: 1.40,
    threeBedRatio: 1.83,
    monthlyTrendPct: 0.001,
    baseInventory: 5800,
    baseDom: 26,
    baseListings: 1900,
    seasonality: standardSeasonality,
    yoyChange: 1.2,
    inventoryTrend: "stable",
  },
  {
    slug: "portland",
    base1Bed: 1450,
    studioRatio: 0.80,
    twoBedRatio: 1.41,
    threeBedRatio: 1.84,
    monthlyTrendPct: 0.001,
    baseInventory: 5400,
    baseDom: 27,
    baseListings: 1800,
    seasonality: mildSeasonality,
    yoyChange: 1.0,
    inventoryTrend: "stable",
  },
  {
    slug: "philadelphia",
    base1Bed: 1400,
    studioRatio: 0.79,
    twoBedRatio: 1.41,
    threeBedRatio: 1.84,
    monthlyTrendPct: 0.0015,
    baseInventory: 6200,
    baseDom: 28,
    baseListings: 2000,
    seasonality: standardSeasonality,
    yoyChange: 1.8,
    inventoryTrend: "stable",
  },
  {
    slug: "san-diego",
    base1Bed: 2050,
    studioRatio: 0.81,
    twoBedRatio: 1.45,
    threeBedRatio: 1.90,
    monthlyTrendPct: 0.002,
    baseInventory: 4900,
    baseDom: 23,
    baseListings: 1700,
    seasonality: mildSeasonality,
    yoyChange: 2.5,
    inventoryTrend: "decreasing",
  },
  {
    slug: "nashville",
    base1Bed: 1550,
    studioRatio: 0.78,
    twoBedRatio: 1.42,
    threeBedRatio: 1.86,
    monthlyTrendPct: 0.001,
    baseInventory: 7000,
    baseDom: 28,
    baseListings: 2300,
    seasonality: sunbeltSeasonality,
    yoyChange: 1.0,
    inventoryTrend: "stable",
  },
  {
    slug: "detroit",
    base1Bed: 850,
    studioRatio: 0.76,
    twoBedRatio: 1.38,
    threeBedRatio: 1.80,
    monthlyTrendPct: 0.002,
    baseInventory: 6800,
    baseDom: 48,
    baseListings: 1900,
    seasonality: standardSeasonality,
    yoyChange: 2.8,
    inventoryTrend: "decreasing",
  },
];

function generateMonthlyData(config: CityConfig): MonthlyRentData[] {
  const months: MonthlyRentData[] = [];
  const startYear = 2024;
  const startMonth = 3;

  for (let i = 0; i < 24; i++) {
    const year = startYear + Math.floor((startMonth + i - 1) / 12);
    const monthNum = ((startMonth + i - 1) % 12) + 1;
    const monthStr = `${year}-${String(monthNum).padStart(2, "0")}`;

    const seasonalFactor =
      config.seasonality.find((s) => s.month === monthNum)?.factor ?? 1.0;

    const trendMultiplier = 1 + config.monthlyTrendPct * i;

    const jitter = 1 + (Math.sin(i * 3.7 + config.base1Bed * 0.01) * 0.008);

    const rent1Bed = Math.round(
      config.base1Bed * trendMultiplier * seasonalFactor * jitter
    );
    const rentStudio = Math.round(rent1Bed * config.studioRatio);
    const rent2Bed = Math.round(rent1Bed * config.twoBedRatio);
    const rent3Bed = Math.round(rent1Bed * config.threeBedRatio);

    const inventorySeasonalShift =
      seasonalFactor > 1.0
        ? 1 - (seasonalFactor - 1) * 0.8
        : 1 + (1 - seasonalFactor) * 0.6;
    const inventoryTrendShift =
      config.inventoryTrend === "increasing"
        ? 1 + i * 0.005
        : config.inventoryTrend === "decreasing"
          ? 1 - i * 0.004
          : 1;
    const inventory = Math.round(
      config.baseInventory *
        inventorySeasonalShift *
        inventoryTrendShift *
        (1 + Math.sin(i * 2.3) * 0.03)
    );

    const domSeasonalShift =
      seasonalFactor > 1.0
        ? 1 - (seasonalFactor - 1) * 1.5
        : 1 + (1 - seasonalFactor) * 1.2;
    const dom = Math.round(
      config.baseDom *
        domSeasonalShift *
        (1 + Math.sin(i * 1.9 + 0.5) * 0.06)
    );

    const listingsSeasonalShift =
      seasonalFactor > 1.0
        ? 1 + (seasonalFactor - 1) * 1.2
        : 1 - (1 - seasonalFactor) * 0.7;
    const newListings = Math.round(
      config.baseListings *
        listingsSeasonalShift *
        (1 + Math.sin(i * 2.7 + 1.1) * 0.05)
    );

    months.push({
      month: monthStr,
      avgRentStudio: rentStudio,
      avgRent1Bed: rent1Bed,
      avgRent2Bed: rent2Bed,
      avgRent3Bed: rent3Bed,
      inventory,
      daysOnMarket: Math.max(7, dom),
      newListings: Math.max(100, newListings),
    });
  }

  return months;
}

function computeAverageDom(monthly: MonthlyRentData[]): number {
  const sum = monthly.reduce((acc, m) => acc + m.daysOnMarket, 0);
  return Math.round(sum / monthly.length);
}

export const cityRentTrends: CityRentTrends[] = cityConfigs.map((config) => {
  const monthly = generateMonthlyData(config);
  return {
    citySlug: config.slug,
    monthly,
    seasonality: config.seasonality,
    yearOverYearChange: config.yoyChange,
    averageDaysOnMarket: computeAverageDom(monthly),
    inventoryTrend: config.inventoryTrend,
  };
});

export function getTrendsByCity(
  citySlug: string
): CityRentTrends | undefined {
  return cityRentTrends.find((t) => t.citySlug === citySlug);
}

export function getLatestRentData(
  citySlug: string
): MonthlyRentData | undefined {
  const trends = getTrendsByCity(citySlug);
  return trends?.monthly[trends.monthly.length - 1];
}
