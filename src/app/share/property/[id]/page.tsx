import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { isUuidV4Token } from "@/features/clientInviteLinks/tokenValidation";
import { getPublicProperty } from "@/features/propertyShare/publicPropertyApi";
import { formatPublicPropertyTitle } from "@/features/propertyShare/formatPublicPropertyTitle";
import { PublicPropertyRequestError } from "@/features/propertyShare/publicPropertyRequestError";
import { getPublicPropertyShareUrl } from "@/features/propertyShare/propertyWhatsAppShare";
import { resolveApiMediaUrl } from "@/features/properties/resolveApiMediaUrl";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { ApiError } from "@/shared/lib/apiError";
import {
  PublicPropertyErrorState,
  PublicPropertyNotFoundState,
  PublicPropertyRateLimitedState,
  PublicPropertyView,
} from "@/widgets/PublicProperty/PublicPropertyView";

const loadPublicProperty = cache(getPublicProperty);

type SharePropertyPageProps = {
  params: Promise<{ id: string }>;
};

async function getRequestOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) {
    return "";
  }
  const forwardedProtocol = headerList.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function generateMetadata(
  props: SharePropertyPageProps,
): Promise<Metadata> {
  const { id } = await props.params;
  const trimmedId = id.trim();
  if (!isUuidV4Token(trimmedId)) {
    return { title: "განცხადება ვერ მოიძებნა" };
  }

  try {
    const property = await loadPublicProperty(trimmedId);
    const title = formatPublicPropertyTitle(property);
    const description = property.publicComment?.trim() || title;
    const origin = await getRequestOrigin();
    const canonicalUrl = origin
      ? getPublicPropertyShareUrl(property.id, origin)
      : undefined;
    const coverImage = property.images[0];
    const coverUrl = coverImage
      ? resolveApiMediaUrl(coverImage.url, getApiBaseUrl())
      : "";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "website",
        images: coverUrl ? [{ url: coverUrl }] : undefined,
      },
      twitter: {
        card: coverUrl ? "summary_large_image" : "summary",
        title,
        description,
        images: coverUrl ? [coverUrl] : undefined,
      },
    };
  } catch (error) {
    if (error instanceof PublicPropertyRequestError && error.statusCode === 404) {
      return { title: "განცხადება ვერ მოიძებნა" };
    }
    return { title: "განცხადება" };
  }
}

export default async function SharePropertyPage(props: SharePropertyPageProps) {
  const { id } = await props.params;
  const trimmedId = id.trim();

  if (!isUuidV4Token(trimmedId)) {
    return <PublicPropertyNotFoundState />;
  }

  try {
    const property = await loadPublicProperty(trimmedId);
    return <PublicPropertyView property={property} />;
  } catch (error) {
    if (error instanceof PublicPropertyRequestError) {
      if (error.statusCode === 404) {
        return <PublicPropertyNotFoundState />;
      }
      if (error.statusCode === 429) {
        return <PublicPropertyRateLimitedState />;
      }
      return <PublicPropertyErrorState message={error.message} />;
    }
    if (error instanceof ApiError) {
      if (error.statusCode === 404) {
        return <PublicPropertyNotFoundState />;
      }
      if (error.statusCode === 429) {
        return <PublicPropertyRateLimitedState />;
      }
      return <PublicPropertyErrorState message={error.message} />;
    }
    return (
      <PublicPropertyErrorState message="განცხადების ჩატვირთვა ვერ მოხერხდა." />
    );
  }
}
