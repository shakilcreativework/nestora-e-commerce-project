import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "NESTORA — Home & Lifestyle Atelier",
    template: "%s | NESTORA",
  },
  description:
    "Thoughtful essentials for a more comfortable, organized everyday life. Japanese oak desk architecture, warm ambient lighting, and artisan stoneware.",
  keywords: [
    "desk accessories",
    "home decor",
    "lifestyle essentials",
    "japanese oak",
    "minimalist workspace",
    "ceramics",
    "NESTORA",
  ],
  authors: [{ name: "NESTORA Atelier", url: baseUrl }],
  creator: "NESTORA",
  publisher: "NESTORA",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "NESTORA",
    title: "NESTORA — Home & Lifestyle Atelier",
    description:
      "Thoughtful essentials for a more comfortable, organized everyday life. Japanese oak desk architecture, warm ambient lighting, and artisan stoneware.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&h=630&q=85",
        width: 1200,
        height: 630,
        alt: "NESTORA Home & Lifestyle Curated Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NESTORA — Home & Lifestyle Atelier",
    description:
      "Thoughtful essentials for a more comfortable, organized everyday life. Japanese oak desk architecture, warm ambient lighting, and artisan stoneware.",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&h=630&q=85",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "NESTORA",
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    description:
      "Single-vendor online atelier for Japanese oak desk architecture, warm ambient lighting, and handcrafted ceramics.",
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Credit Card, Debit Card, Sandbox",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            {children}
            <CartDrawer />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
