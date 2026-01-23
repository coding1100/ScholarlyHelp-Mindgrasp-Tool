import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Metadata } from "next";
import ClientScripts from "./components/ClientScripts";

// Optimize font loading - next/font self-hosts fonts (NO CDN calls)
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: true,
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
        {/* Force HTTPS for all resources in production only */}
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        )}

        {/* CRITICAL: Preload LCP image to eliminate resource load delay */}
        <link
          rel="preload"
          as="image"
          href="/images/Hero-Group-195.webp"
          type="image/webp"
          fetchPriority="high"
          imageSrcSet="/_next/image?url=%2Fimages%2FHero-Group-195.webp&w=640&q=75 1x, /_next/image?url=%2Fimages%2FHero-Group-195.webp&w=1080&q=75 2x"
          imageSizes="(max-width: 1025px) 0px, 450px"
        />

        {/* Preconnect to critical third-party origins (max 4 as recommended) */}
        <link rel="preconnect" href="https://pixel-config.reddit.com" />
        <link rel="preconnect" href="https://capig.stape.do" />
        <link rel="preconnect" href="https://www.clickcease.com" />
        <link rel="preconnect" href="https://alb.reddit.com" />

        {/* DNS prefetch for resources loaded later */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="https://cdn.livechatinc.com" />
        <link rel="dns-prefetch" href="https://script.crazyegg.com" />
      </head>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <main id="main-content">{children}</main>

        {/* 
         * PERFORMANCE: All scripts use lazyOnload to minimize main thread work
         * This defers all non-critical scripts until after page is fully interactive
         */}

        {/* Google Sign-In - lazy load */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />

        {/* GTM - use lazyOnload instead of default to reduce main thread work */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5ZHV46X');
            `,
          }}
        />

        {/* Schema.org - lazyOnload since it's not render-blocking */}
        <Script
          id="schema-org-main"
          strategy="lazyOnload"
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
