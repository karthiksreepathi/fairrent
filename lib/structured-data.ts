import { SITE_URL, SITE_NAME } from "./seo";
import type { CityData } from "@/data/cities";
import type { BlogPost } from "@/data/blog-posts";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "FairRent helps everyday renters find out if their rent is truly fair, with free tools powered by real government data.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@fairrent.app",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/rent-checker?city={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateCitySchema(city: CityData) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${city.name}, ${city.stateCode}`,
    description: city.description,
    geo: {
      "@type": "GeoCoordinates",
      addressRegion: city.stateCode,
      addressCountry: "US",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Average 1-Bedroom Rent",
        value: `$${city.avgRent1Bed.toLocaleString()}/month`,
      },
      {
        "@type": "PropertyValue",
        name: "Average 2-Bedroom Rent",
        value: `$${city.avgRent2Bed.toLocaleString()}/month`,
      },
      {
        "@type": "PropertyValue",
        name: "Renter Percentage",
        value: `${city.renterPercentage}%`,
      },
      {
        "@type": "PropertyValue",
        name: "Year-over-Year Rent Change",
        value: `${city.yoyChange > 0 ? "+" : ""}${city.yoyChange}%`,
      },
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.publishDate,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export function generateSoftwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FairRent Rent Checker",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "A free, friendly rent comparison tool that shows you average rent prices by city and neighborhood so you can make sure your rent is fair.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2450",
    },
  };
}

export function generateToolSchema(tool: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}${tool.url}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function generateBuildingSchema(building: {
  id: string;
  name: string;
  address: string;
  units: number;
  yearBuilt: number;
  avgRent1Bed: number;
  avgRent2Bed: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: building.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: building.address,
      addressCountry: "US",
    },
    numberOfAvailableAccommodation: building.units,
    yearBuilt: building.yearBuilt,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Average 1-Bedroom Rent",
        value: `$${building.avgRent1Bed.toLocaleString()}/month`,
      },
      {
        "@type": "PropertyValue",
        name: "Average 2-Bedroom Rent",
        value: `$${building.avgRent2Bed.toLocaleString()}/month`,
      },
    ],
    url: `${SITE_URL}/building/${building.id}`,
  };
}

export function generateProductSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "FairRent Premium",
    description: "Advanced rent analysis tools, negotiation letter generator, building intelligence, and market alerts to help you rent with confidence.",
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "USD",
        description: "Basic rent checking and city data access",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "9.99",
        priceCurrency: "USD",
        description: "Deep fairness scoring, negotiation tools, and building intelligence",
      },
    ],
  };
}
