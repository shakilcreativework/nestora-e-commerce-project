import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * Senior Developer Standard:
 * Authoritative Next.js Metadata Route for robots.txt.
 * 
 * Rules:
 * - Allows indexing of all public customer storefront routes (Home, Shop, Categories, Products).
 * - Disallows private sensitive areas: Admin portal, customer accounts, checkout session, internal API routes.
 * - Points directly to the dynamic sitemap XML.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/category/", "/product/"],
        disallow: ["/admin/", "/account/", "/checkout/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
