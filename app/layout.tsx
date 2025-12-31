"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { hideTalktoModule } from "./components/HideLinks/HideLinks";
import Schemas from "./faqSchemaContent.json";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

declare global {
  interface Window {
    LiveChatWidget?: {
      call: (method: string, ...args: any[]) => void;
    };
    __lc?: {
      license: number;
      integration_name: string;
      product_name: string;
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPage = usePathname();
  const hideTalkTo = hideTalktoModule.includes(currentPage);
  const isThankYouPage = currentPage === "/thank-you" || currentPage === "/thank-you/";

  // Hide/show LiveChat widget based on current page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hideLiveChatWidget = () => {
      // Hide using API if available
      if (window.LiveChatWidget) {
        try {
          window.LiveChatWidget.call("hide");
        } catch (error) {
          // Silently fail if widget not ready
        }
      }
      
      // Hide all LiveChat DOM elements
      const selectors = [
        '#livechat-container',
        '[id*="livechat"]',
        '[class*="livechat"]',
        '[id*="LiveChat"]',
        '[class*="LiveChat"]',
        'iframe[src*="livechatinc.com"]',
        'iframe[src*="livechat"]'
      ];
      
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.display = "none";
              el.style.visibility = "hidden";
            }
          });
        } catch (e) {
          // Ignore selector errors
        }
      });
    };

    const showLiveChatWidget = () => {
      // Show using API if available
      if (window.LiveChatWidget) {
        try {
          // Widget will show automatically when on thank-you page
          // We don't need to explicitly show it unless user clicks
        } catch (error) {
          // Silently fail if widget not ready
        }
      }
      
      // Show LiveChat DOM elements
      const selectors = [
        '#livechat-container',
        '[id*="livechat"]',
        '[class*="livechat"]',
        '[id*="LiveChat"]',
        '[class*="LiveChat"]'
      ];
      
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.display = "";
              el.style.visibility = "";
            }
          });
        } catch (e) {
          // Ignore selector errors
        }
      });
    };

    if (!isThankYouPage) {
      // Hide widget when not on thank-you page
      hideLiveChatWidget();
      // Also set up an interval to catch any late-loading elements
      const interval = setInterval(() => {
        hideLiveChatWidget();
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      // Show widget when on thank-you page
      showLiveChatWidget();
    }
  }, [currentPage, isThankYouPage]);

  function faqSchemaJsonLd(url: string) {
    const schema = Schemas[url as keyof typeof Schemas] || {};
    return {
      __html: JSON.stringify(schema),
    };
  }

  return (
    <html lang="en">
      <body className={poppins.className} suppressHydrationWarning={true}>
        {children}
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
        <GoogleTagManager gtmId="GTM-5ZHV46X" />
        <Script
          id="schema-org-main"
          strategy="beforeInteractive"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "http://schema.org/",
              "@type": "product",
              "name": "scholarlyhelp",
              "image": "./img/logonew.svg",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "15395"
              }
            }
            `,
          }}
          key="product-jsonld"
        />

        {/* Start of LiveChat (www.livechat.com) code - only on /thank-you/ route */}
        {isThankYouPage && (
          <>
            <Script
              id="livechat-script"
              strategy="afterInteractive"
            >
              {`
            window.__lc = window.__lc || {};
            window.__lc.license = 19303287;
            window.__lc.integration_name = "manual_onboarding";
            window.__lc.product_name = "livechat";
            ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
          `}
            </Script>

            <noscript>
              <a href="https://www.livechat.com/chat-with/19303287/" rel="nofollow">
                Chat with us
              </a>
              , powered by{" "}
              <a
                href="https://www.livechat.com/?welcome"
                rel="noopener nofollow"
                target="_blank"
              >
                LiveChat
              </a>
            </noscript>
          </>
        )}
        {/* End of LiveChat code  */}

        {/* HelpCrunch scripts - only on /about-us/ page */}
        {currentPage === "/about-us" && (
          <>
            <Script id="helpcrunch-settings" strategy="beforeInteractive">
              {`
                window.helpcrunchSettings = {
                  organization: 'scholarlyhelp',
                  appId: 'c8e064ed-a989-4a62-ac3a-e4b2fbe4c1ce',
                };
              `}
            </Script>
            <Script id="helpcrunch-sdk" strategy="afterInteractive">
              {`
                (function(w,d){
                  var hS=w.helpcrunchSettings;
                  if(!hS||!hS.organization){return;}
                  var widgetSrc='https://embed.helpcrunch.com/sdk.js';
                  w.HelpCrunch=function(){w.HelpCrunch.q.push(arguments)};
                  w.HelpCrunch.q=[];
                  function r(){
                    if (d.querySelector('script[src="' + widgetSrc + '"]')) { return; }
                    var s=d.createElement('script');
                    s.async=1;
                    s.type='text/javascript';
                    s.src=widgetSrc;
                    (d.body||d.head).appendChild(s);
                  }
                  if(d.readyState === 'complete'||hS.loadImmediately){r();}
                  else if(w.attachEvent){w.attachEvent('onload',r);}
                  else{w.addEventListener('load',r,false);}
                })(window, document);
              `}
            </Script>
          </>
        )}

        {/* {!hideTalkTo && (
          <>
            <Script
              id="tawk"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                  (function(){
                    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                    s1.async=true;
                    s1.src='https://embed.tawk.to/6229a486a34c2456412a5836/1ftpalbms';
                    s1.charset='UTF-8';
                    s1.setAttribute('crossorigin','*');
                    s0.parentNode.insertBefore(s1,s0);
                  })();
                `,
              }}
            ></Script>
            <Script
              id="tawk-conversion"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  var Tawk_API = Tawk_API || {};
                  Tawk_API.onChatMessageVisitor = function() {
                    gtag('event', 'conversion', {
                      'send_to': 'AW-10966577873'
                    });
                  };
                `,
              }}
            ></Script>
            <Script
              id="tawk-chat-started"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
          var Tawk_API = Tawk_API || {};
          Tawk_API.onChatStarted = function() {
            dataLayer.push({
              event: 'chat_started'
            });
          };
        `,
              }}
            ></Script>
          </>
        )} */}
      </body>
    </html>
  );
}
