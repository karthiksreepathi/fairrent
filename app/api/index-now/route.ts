import { NextResponse } from "next/server";
import { cities } from "@/data/cities";
import { blogPosts } from "@/data/blog-posts";
import { buildings } from "@/data/buildings";

const INDEXNOW_KEY = "51103cac963348d58dfcef449e8c00ee";
const SITE_URL = "https://farerent.com";

export async function POST() {
  // Collect all URLs to submit
  const urls = [
    SITE_URL,
    `${SITE_URL}/rent-checker`,
    `${SITE_URL}/tools`,
    `${SITE_URL}/tools/negotiation-letter`,
    `${SITE_URL}/tools/move-calculator`,
    `${SITE_URL}/tools/lease-analyzer`,
    `${SITE_URL}/tools/comparables`,
    `${SITE_URL}/buildings`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/about`,
    `${SITE_URL}/pricing`,
    `${SITE_URL}/alerts`,
    `${SITE_URL}/privacy`,
    `${SITE_URL}/terms`,
    ...cities.map((city) => `${SITE_URL}/rent/${city.slug}`),
    ...blogPosts.map((post) => `${SITE_URL}/blog/${post.slug}`),
    ...buildings.map((b) => `${SITE_URL}/building/${b.id}`),
  ];

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "farerent.com",
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.slice(0, 10000), // IndexNow limit
      }),
    });

    return NextResponse.json({
      success: true,
      status: response.status,
      urlsSubmitted: urls.length,
      message: "URLs submitted to IndexNow (Bing, Yandex, DuckDuckGo)",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    info: "POST to this endpoint to submit all site URLs to IndexNow",
    key: INDEXNOW_KEY,
  });
}
