"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToolsLayout from "@/app/components/AiTools/ToolsLayout";
import SummarizerTool from "@/app/components/AiTools/summarizer-tool";
// import ThemeToggle from "@/app/components/AiLandingPage/ThemeToggle";

export default function SummarizerPage() {
  const [flag, setFlag] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token");
    if (!isAuthenticated) {
      router.replace("/sign-in?returnUrl=/tools/summarizer-tool");
    }
  }, [router]);

  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-72" />}>
      {/* <ThemeToggle top="top-12" /> */}
      <ToolsLayout setFlag={setFlag} flag={flag}>
        <SummarizerTool />
      </ToolsLayout>
    </Suspense>
  );
}
