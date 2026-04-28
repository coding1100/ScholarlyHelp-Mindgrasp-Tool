import { Poppins } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";
import { Metadata } from "next";

const ClientScripts = dynamic(() => import("./components/ClientScripts"), {
  ssr: false,
});

// Optimize font loading - next/font self-hosts fonts (NO CDN calls)
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
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
        {/* Resource Hints for better performance */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Force HTTPS for all resources in production only */}
        {process.env.NODE_ENV === "production" && (
          <meta
            httpEquiv="Content-Security-Policy"
            content="upgrade-insecure-requests"
          />
        )}

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
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
        {/* End Google Tag Manager */}
      </head>
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5ZHV46X"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <main id="main-content">{children}</main>

        {/* Legacy GTM loader (kept for backwards compatibility / perf gating).
            Safe: it won't load GTM again if it's already present. */}
        <Script
          id="gtm-legacy-delayed-loader"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var gtmLoaded = false;

                function hasGtmScript() {
                  try {
                    return !!document.querySelector("script[src*='googletagmanager.com/gtm.js?id=GTM-5ZHV46X']");
                  } catch (e) {
                    return false;
                  }
                }

                function addDNSPrefetch() {
                  try {
                    var existing = document.querySelector("link[rel='dns-prefetch'][href='https://www.googletagmanager.com']");
                    if (existing) return;
                    var link = document.createElement('link');
                    link.rel = 'dns-prefetch';
                    link.href = 'https://www.googletagmanager.com';
                    document.head.appendChild(link);
                  } catch (e) {}
                }

                function initGTM() {
                  if (gtmLoaded) return;
                  if (hasGtmScript() || (window.google_tag_manager && window.google_tag_manager['GTM-5ZHV46X'])) {
                    gtmLoaded = true;
                    return;
                  }
                  gtmLoaded = true;

                  addDNSPrefetch();

                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-5ZHV46X');
                }

                function waitForLoad() {
                  if (document.readyState === 'complete') {
                    loadGTM();
                  } else {
                    window.addEventListener('load', loadGTM, { once: true });
                  }
                }

                function loadGTM() {
                  if (hasGtmScript() || (window.google_tag_manager && window.google_tag_manager['GTM-5ZHV46X'])) {
                    gtmLoaded = true;
                    return;
                  }
                  if ('requestIdleCallback' in window) {
                    requestIdleCallback(function() {
                      setTimeout(initGTM, 5000);
                    }, { timeout: 8000 });
                  } else {
                    setTimeout(initGTM, 8000);
                  }
                }

                var interactionEvents = ['scroll', 'mousedown', 'touchstart', 'keydown'];
                var interactionHandler = function() {
                  if (!gtmLoaded) {
                    setTimeout(initGTM, 3000);
                    interactionEvents.forEach(function(event) {
                      window.removeEventListener(event, interactionHandler);
                    });
                  }
                };

                interactionEvents.forEach(function(event) {
                  window.addEventListener(event, interactionHandler, { once: true, passive: true });
                });

                waitForLoad();
              })();
            `,
          }}
        />

        {/* Client-side scripts that need pathname */}
        <ClientScripts />
      </body>
    </html>
  );
}
