import type { Metadata } from "next";
import InfoPage from "@/features/info/pages/Info";
import {
  INFO_PAGE_DESCRIPTION,
  INFO_PAGE_KEYWORDS,
  INFO_PAGE_TITLE,
  OPEN_GRAPH_IMAGE,
  SITE_URL
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: INFO_PAGE_TITLE,
  description: INFO_PAGE_DESCRIPTION,
  keywords: INFO_PAGE_KEYWORDS,
  alternates: {
    canonical: "/info",
  },
  openGraph: {
    title: INFO_PAGE_TITLE,
    description: INFO_PAGE_DESCRIPTION,
    url: `${SITE_URL}/info`,
    images: [OPEN_GRAPH_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: INFO_PAGE_TITLE,
    description: INFO_PAGE_DESCRIPTION,
    images: [OPEN_GRAPH_IMAGE],
  },
};

export default function Info() {
  return <InfoPage />;
}