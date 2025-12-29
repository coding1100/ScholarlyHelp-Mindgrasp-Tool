"use client";

import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import ToolsLayout from "@/app/components/AiTools/ToolsLayout";
import ThesisGenerator from "@/app/components/AiTools/ThesisGenerator-tool";
import ThemeToggle from "@/app/components/AiLandingPage/ThemeToggle";

const Page = () => {
  const [flag, setFlag] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token");
    if (!isAuthenticated) {
      router.replace("/sign-in?returnUrl=/tools/thesis-generator-tool");
    }
  }, [router]);

  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-72" />}>
      <ThemeToggle top="top-12" />
      <ToolsLayout setFlag={setFlag} flag={flag}>
        <ThesisGenerator />
      </ToolsLayout>
    </Suspense>
  );
};

export default Page;
