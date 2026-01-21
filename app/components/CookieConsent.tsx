"use client";

import React, { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { usePathname } from 'next/navigation';

const CookieBanner = () => {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    // Load third-party scripts here
    loadThirdPartyScripts();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  const loadThirdPartyScripts = () => {
    // Load Google Analytics, Facebook Pixel, etc.
    if (typeof window !== 'undefined') {
      // Example: Load GTM or GA
      // (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');
    }
  };

  if (!showBanner) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="cookieConsent"
      style={{ background: "#2B373B", color: "#fff" }}
      buttonStyle={{ color: "#fff", background: "#ff641a", fontSize: "13px" }}
      declineButtonStyle={{ color: "#fff", background: "#6c757d", fontSize: "13px" }}
      expires={365}
      onAccept={handleAccept}
      onDecline={handleDecline}
      enableDeclineButton
    >
      This website uses cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.
    </CookieConsent>
  );
};

export default CookieBanner;