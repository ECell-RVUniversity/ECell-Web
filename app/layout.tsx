import type { Metadata, Viewport } from "next";
import { Archivo, Bebas_Neue, Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://ecell-rvu.vercel.app";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "ECell RV University | Entrepreneurship Cell & Startup Community",
    template: "%s | ECell RV University",
  },
  description:
    "ECell RV University is the official entrepreneurship cell at RV University, Bengaluru. We build a thriving campus community for founders, innovators, and future entrepreneurs through events, mentorship, and startup resources.",
  applicationName: "ECell RV University",
  keywords: [
    "ECell RV University",
    "ECell RVU",
    "E-Cell RVU",
    "ECell RV",
    "entrepreneurship cell",
    "RV University",
    "RV University entrepreneurship",
    "startup community Bengaluru",
    "student entrepreneurs India",
    "innovation cell",
    "founders",
    "Bengaluru startups",
    "college entrepreneurship",
    "startup events Bengaluru",
    "student startup community",
  ],
  authors: [{ name: "ECell RV University", url: SITE_URL }],
  creator: "ECell RV University",
  publisher: "ECell RV University",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "ECell RV University",
    title: "ECell RV University | Building What's Next",
    description:
      "Building ideas, backing founders, and growing a community of entrepreneurs at RV University, Bengaluru.",
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ECell RV University - Official Entrepreneurship Cell of RV University",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ECell RV University | Building What's Next",
    description:
      "The official entrepreneurship cell at RV University — for founders, innovators, and future entrepreneurs.",
    images: ["/og-image.png"],
    creator: "@ecell_rvu",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon-48x48.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ECell RVU",
    statusBarStyle: "black-translucent",
  },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "ECell RV University",
      alternateName: [
        "ECell RVU",
        "E-Cell RVU",
        "ECell RV",
        "Entrepreneurship Cell RV University",
      ],
      description:
        "The official entrepreneurship cell at RV University, Bengaluru.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ECell RV University",
      alternateName: [
        "ECell RVU",
        "E-Cell RVU",
        "Entrepreneurship Cell RV University",
      ],
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/logo-512.png`,
        contentUrl: `${SITE_URL}/logo-512.png`,
        caption: "ECell RV University Logo",
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/og-image.png`,
      description:
        "The official entrepreneurship cell at RV University, Bengaluru — building a thriving campus community for founders, innovators, and future entrepreneurs.",
      email: "club_ecell@rvu.edu.in",
      foundingDate: "2023",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: "RV University",
        url: "https://www.rvu.edu.in",
      },
      sameAs: [
        "https://www.instagram.com/ecell_rvu/",
        "https://www.linkedin.com/company/ecell-rvu",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${bebasNeue.variable} ${fraunces.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="scroll-restoration"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
                window.addEventListener('beforeunload', function() {
                  window.scrollTo(0, 0);
                });
              }
            `,
          }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
