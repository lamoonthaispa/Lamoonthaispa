import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceTypePage from "@/features/service-type/pages/ServiceType";
import { ServiceType } from "@/types/serviceType";
import {
  DEFAULT_DESCRIPTION,
  SERVICE_PAGE_METADATA,
  SITE_URL
} from "@/lib/seo";

type ServiceParams = {
  params: { serviceType: ServiceType };
};

export async function generateMetadata({ params }: ServiceParams): Promise<Metadata> {
  const metadata = SERVICE_PAGE_METADATA[params.serviceType];
  const { serviceType } = await params;
  if (!metadata) {
    return {
      title: "Service Lamoon Thaï Spa",
      description: DEFAULT_DESCRIPTION,
    };
  }

  const pageUrl = `${SITE_URL}/services/${serviceType}`;
  const imageUrl = `${SITE_URL}${metadata.imagePath}`;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: `/services/${serviceType}`,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: pageUrl,
      type: "article",
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [imageUrl],
    },
  };
}

export default async function ServiceDetail({ params }: ServiceParams) {
  if (!SERVICE_PAGE_METADATA[params.serviceType]) {
    notFound();
  }

  const { serviceType } = await params

  return <ServiceTypePage serviceType={serviceType} />;
}