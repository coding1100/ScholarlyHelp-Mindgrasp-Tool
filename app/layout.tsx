import { GoogleTagManager } from "@next/third-parties/google";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Metadata } from "next";
import ClientScripts from "./components/ClientScripts";

// Optimize font loading - next/font self-hosts fonts (NO CDN calls)
// This downloads fonts at build time and serves them from your domain
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap", // Shows fallback immediately, swaps when font loads
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"], // Only load weights you actually use
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: true, // Automatically adjusts fallback metrics to reduce CLS
});

export const metadata: Metadata = {
  title: "Scholarly Help - Academic Writing Services For You",
  description: "Professional academic writing services tailored to your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Force HTTPS for all resources */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
        {/* CRITICAL: Preload LCP image to eliminate 4.6s resource load delay */}
        <link
          rel="preload"
          as="image"
          href="/images/Hero-Group-195.png"
          type="image/png"
          fetchPriority="high"
        />
        
        {/* Preconnect only to non-font third-party domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS prefetch for resources loaded later */}
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="https://cdn.livechatinc.com" />
        <link rel="dns-prefetch" href="https://script.crazyegg.com" />
      </head>
      <body className={poppins.className} suppressHydrationWarning={true}>
        {children}
        
        {/* Defer Google Sign-In script - load after page */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />
        
        {/* GTM - already optimized by Next.js */}
        <GoogleTagManager gtmId="GTM-5ZHV46X" />
        
        {/* Schema.org - use afterInteractive instead of beforeInteractive */}
        <Script
          id="schema-org-main"
          strategy="afterInteractive"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Scholarly Help",
              "image": "./img/logonew.svg",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "15395"
              }
            }`,
          }}
          key="product-jsonld"
        />
        
        {/* Client-side scripts that need pathname */}
        <ClientScripts />
      </body>
    </html>
  );
}
