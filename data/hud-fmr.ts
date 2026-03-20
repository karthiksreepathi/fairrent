export interface HudFmrData {
  citySlug: string;
  fipsCode: string;
  metroArea: string;
  year: number;
  efficiency: number;
  oneBedroom: number;
  twoBedroom: number;
  threeBedroom: number;
  fourBedroom: number;
  medianRent: number;
  percentile40: number;
  percentile50: number;
}

export const hudFmrData: HudFmrData[] = [
  {
    citySlug: "new-york",
    fipsCode: "35620",
    metroArea: "New York-Newark-Jersey City, NY-NJ-PA",
    year: 2025,
    efficiency: 1865,
    oneBedroom: 2105,
    twoBedroom: 2387,
    threeBedroom: 2982,
    fourBedroom: 3245,
    medianRent: 2650,
    percentile40: 2387,
    percentile50: 2650,
  },
  {
    citySlug: "los-angeles",
    fipsCode: "31080",
    metroArea: "Los Angeles-Long Beach-Anaheim, CA",
    year: 2025,
    efficiency: 1412,
    oneBedroom: 1640,
    twoBedroom: 2048,
    threeBedroom: 2690,
    fourBedroom: 2985,
    medianRent: 2280,
    percentile40: 2048,
    percentile50: 2280,
  },
  {
    citySlug: "chicago",
    fipsCode: "16980",
    metroArea: "Chicago-Naperville-Elgin, IL-IN-WI",
    year: 2025,
    efficiency: 928,
    oneBedroom: 1085,
    twoBedroom: 1278,
    threeBedroom: 1620,
    fourBedroom: 1812,
    medianRent: 1420,
    percentile40: 1278,
    percentile50: 1420,
  },
  {
    citySlug: "houston",
    fipsCode: "26420",
    metroArea: "Houston-The Woodlands-Sugar Land, TX",
    year: 2025,
    efficiency: 825,
    oneBedroom: 968,
    twoBedroom: 1178,
    threeBedroom: 1528,
    fourBedroom: 1745,
    medianRent: 1310,
    percentile40: 1178,
    percentile50: 1310,
  },
  {
    citySlug: "phoenix",
    fipsCode: "38060",
    metroArea: "Phoenix-Mesa-Chandler, AZ",
    year: 2025,
    efficiency: 812,
    oneBedroom: 945,
    twoBedroom: 1165,
    threeBedroom: 1548,
    fourBedroom: 1752,
    medianRent: 1295,
    percentile40: 1165,
    percentile50: 1295,
  },
  {
    citySlug: "san-francisco",
    fipsCode: "41860",
    metroArea: "San Francisco-Oakland-Berkeley, CA",
    year: 2025,
    efficiency: 1925,
    oneBedroom: 2285,
    twoBedroom: 2812,
    threeBedroom: 3590,
    fourBedroom: 3985,
    medianRent: 3125,
    percentile40: 2812,
    percentile50: 3125,
  },
  {
    citySlug: "seattle",
    fipsCode: "42660",
    metroArea: "Seattle-Tacoma-Bellevue, WA",
    year: 2025,
    efficiency: 1245,
    oneBedroom: 1475,
    twoBedroom: 1768,
    threeBedroom: 2310,
    fourBedroom: 2612,
    medianRent: 1965,
    percentile40: 1768,
    percentile50: 1965,
  },
  {
    citySlug: "austin",
    fipsCode: "12420",
    metroArea: "Austin-Round Rock-Georgetown, TX",
    year: 2025,
    efficiency: 1015,
    oneBedroom: 1198,
    twoBedroom: 1425,
    threeBedroom: 1862,
    fourBedroom: 2115,
    medianRent: 1585,
    percentile40: 1425,
    percentile50: 1585,
  },
  {
    citySlug: "denver",
    fipsCode: "19740",
    metroArea: "Denver-Aurora-Lakewood, CO",
    year: 2025,
    efficiency: 1065,
    oneBedroom: 1248,
    twoBedroom: 1495,
    threeBedroom: 1958,
    fourBedroom: 2215,
    medianRent: 1662,
    percentile40: 1495,
    percentile50: 1662,
  },
  {
    citySlug: "miami",
    fipsCode: "33100",
    metroArea: "Miami-Fort Lauderdale-Pompano Beach, FL",
    year: 2025,
    efficiency: 1225,
    oneBedroom: 1445,
    twoBedroom: 1768,
    threeBedroom: 2285,
    fourBedroom: 2545,
    medianRent: 1965,
    percentile40: 1768,
    percentile50: 1965,
  },
  {
    citySlug: "boston",
    fipsCode: "14460",
    metroArea: "Boston-Cambridge-Newton, MA-NH",
    year: 2025,
    efficiency: 1685,
    oneBedroom: 1945,
    twoBedroom: 2345,
    threeBedroom: 2912,
    fourBedroom: 3185,
    medianRent: 2605,
    percentile40: 2345,
    percentile50: 2605,
  },
  {
    citySlug: "washington-dc",
    fipsCode: "47900",
    metroArea: "Washington-Arlington-Alexandria, DC-VA-MD-WV",
    year: 2025,
    efficiency: 1385,
    oneBedroom: 1595,
    twoBedroom: 1878,
    threeBedroom: 2412,
    fourBedroom: 2718,
    medianRent: 2088,
    percentile40: 1878,
    percentile50: 2088,
  },
  {
    citySlug: "atlanta",
    fipsCode: "12060",
    metroArea: "Atlanta-Sandy Springs-Alpharetta, GA",
    year: 2025,
    efficiency: 948,
    oneBedroom: 1115,
    twoBedroom: 1312,
    threeBedroom: 1718,
    fourBedroom: 1945,
    medianRent: 1458,
    percentile40: 1312,
    percentile50: 1458,
  },
  {
    citySlug: "dallas",
    fipsCode: "19100",
    metroArea: "Dallas-Fort Worth-Arlington, TX",
    year: 2025,
    efficiency: 885,
    oneBedroom: 1048,
    twoBedroom: 1278,
    threeBedroom: 1668,
    fourBedroom: 1895,
    medianRent: 1420,
    percentile40: 1278,
    percentile50: 1420,
  },
  {
    citySlug: "minneapolis",
    fipsCode: "33460",
    metroArea: "Minneapolis-St. Paul-Bloomington, MN-WI",
    year: 2025,
    efficiency: 842,
    oneBedroom: 998,
    twoBedroom: 1225,
    threeBedroom: 1598,
    fourBedroom: 1812,
    medianRent: 1362,
    percentile40: 1225,
    percentile50: 1362,
  },
  {
    citySlug: "portland",
    fipsCode: "38900",
    metroArea: "Portland-Vancouver-Hillsboro, OR-WA",
    year: 2025,
    efficiency: 945,
    oneBedroom: 1128,
    twoBedroom: 1368,
    threeBedroom: 1785,
    fourBedroom: 2015,
    medianRent: 1520,
    percentile40: 1368,
    percentile50: 1520,
  },
  {
    citySlug: "philadelphia",
    fipsCode: "37980",
    metroArea: "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD",
    year: 2025,
    efficiency: 895,
    oneBedroom: 1068,
    twoBedroom: 1285,
    threeBedroom: 1652,
    fourBedroom: 1865,
    medianRent: 1428,
    percentile40: 1285,
    percentile50: 1428,
  },
  {
    citySlug: "san-diego",
    fipsCode: "41740",
    metroArea: "San Diego-Chula Vista-Carlsbad, CA",
    year: 2025,
    efficiency: 1345,
    oneBedroom: 1578,
    twoBedroom: 1945,
    threeBedroom: 2518,
    fourBedroom: 2825,
    medianRent: 2162,
    percentile40: 1945,
    percentile50: 2162,
  },
  {
    citySlug: "nashville",
    fipsCode: "34980",
    metroArea: "Nashville-Davidson-Murfreesboro-Franklin, TN",
    year: 2025,
    efficiency: 978,
    oneBedroom: 1148,
    twoBedroom: 1365,
    threeBedroom: 1778,
    fourBedroom: 2025,
    medianRent: 1518,
    percentile40: 1365,
    percentile50: 1518,
  },
  {
    citySlug: "detroit",
    fipsCode: "19820",
    metroArea: "Detroit-Warren-Dearborn, MI",
    year: 2025,
    efficiency: 598,
    oneBedroom: 712,
    twoBedroom: 895,
    threeBedroom: 1148,
    fourBedroom: 1295,
    medianRent: 995,
    percentile40: 895,
    percentile50: 995,
  },
];

export function getHudFmr(citySlug: string): HudFmrData | undefined {
  return hudFmrData.find((d) => d.citySlug === citySlug);
}

export function compareToFmr(
  citySlug: string,
  bedrooms: number,
  currentRent: number
): {
  fmr: number;
  difference: number;
  percentAbove: number;
  assessment: string;
} | null {
  const data = getHudFmr(citySlug);
  if (!data) return null;

  const fmrMap: Record<number, number> = {
    0: data.efficiency,
    1: data.oneBedroom,
    2: data.twoBedroom,
    3: data.threeBedroom,
    4: data.fourBedroom,
  };

  const fmr = fmrMap[bedrooms] ?? data.twoBedroom;
  const difference = currentRent - fmr;
  const percentAbove = (difference / fmr) * 100;

  let assessment = "Your rent is within the fair market range.";
  if (percentAbove > 30) {
    assessment =
      "Your rent is significantly above fair market rate. Strong grounds for negotiation.";
  } else if (percentAbove > 15) {
    assessment =
      "Your rent is moderately above fair market rate. Consider negotiating.";
  } else if (percentAbove > 0) {
    assessment = "Your rent is slightly above fair market rate.";
  } else if (percentAbove < -10) {
    assessment = "Your rent is below fair market rate. Great deal!";
  }

  return { fmr, difference, percentAbove, assessment };
}
