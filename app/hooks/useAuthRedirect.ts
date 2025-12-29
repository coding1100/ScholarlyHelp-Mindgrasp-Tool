"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthRedirect = () => {
  const router = useRouter();

  const handleAuthRedirect = (targetUrl: string) => {
    // Immediately redirect to sign-in without any delay
    const signInUrl = `/sign-in?returnUrl=${encodeURIComponent(targetUrl)}`;
    router.replace(signInUrl);
  };

  return { handleAuthRedirect };
};