import type { Metadata } from "next";

const SITE_URL = "https://farerent.com";
const SITE_NAME = "FairRent";
const DEFAULT_DESCRIPTION = "FairRent is a free tool built for renters. Compare rent prices, check your tenant rights, and find out if your rent is truly fair. No sign-up needed.";

export function generateMetadata({
  title,
  description,
  path = "",
  ogImage,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const desc = description || DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${path}`;
  const image = ogImage || `${SITE_URL}/og-image.png`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function generateArticleMetadata({
  title,
  description,
  path,
  publishDate,
  author,
}: {
  title: string;
  description: string;
  path: string;
  publishDate: string;
  author: string;
}): Metadata {
  const base = generateMetadata({ title, description, path });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: publishDate,
      authors: [author],
    },
  };
}

export { SITE_URL, SITE_NAME };
