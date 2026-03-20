export function calculateRentToIncome(monthlyRent: number, annualIncome: number): number {
  return Math.round((monthlyRent / (annualIncome / 12)) * 100 * 10) / 10;
}

export function getRentBurdenLevel(ratio: number): {
  level: string;
  color: string;
  description: string;
} {
  if (ratio < 25) {
    return {
      level: "Comfortable",
      color: "text-green-600",
      description: "You're in great shape! You have plenty of room in your budget for savings and other expenses.",
    };
  }
  if (ratio < 30) {
    return {
      level: "Manageable",
      color: "text-green-500",
      description: "You're within the recommended 30% guideline. Good financial position.",
    };
  }
  if (ratio < 40) {
    return {
      level: "Cost-Burdened",
      color: "text-orange-500",
      description: "You're spending more than the recommended 30%. Consider negotiating rent or exploring more affordable options.",
    };
  }
  return {
    level: "Severely Cost-Burdened",
    color: "text-red-500",
    description: "You're spending a significant portion of income on rent. This may affect your ability to save and cover other expenses.",
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function getMarketCondition(yoyChange: number, vacancyRate: number): {
  condition: string;
  description: string;
  icon: string;
  color: string;
} {
  if (yoyChange < -1 && vacancyRate > 7) {
    return {
      condition: "Strong Renter's Market",
      description: "Rents are dropping and vacancy is high. Negotiate aggressively!",
      icon: "trending_down",
      color: "text-green-600",
    };
  }
  if (yoyChange < 1 && vacancyRate > 5) {
    return {
      condition: "Renter-Friendly",
      description: "Market conditions favor renters. Good time to negotiate.",
      icon: "thumb_up",
      color: "text-green-500",
    };
  }
  if (yoyChange < 3 && vacancyRate > 4) {
    return {
      condition: "Balanced Market",
      description: "Market is relatively balanced between landlords and tenants.",
      icon: "balance",
      color: "text-yellow-500",
    };
  }
  if (yoyChange < 5) {
    return {
      condition: "Landlord-Leaning",
      description: "Rents are rising faster than average. Limited negotiation power.",
      icon: "trending_up",
      color: "text-orange-500",
    };
  }
  return {
    condition: "Strong Landlord's Market",
    description: "High demand and low supply. Expect competition for apartments.",
    icon: "warning",
    color: "text-red-500",
  };
}
