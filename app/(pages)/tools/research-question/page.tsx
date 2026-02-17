"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToolsLayout from "@/app/components/AiTools/ToolsLayout";
import ResearchQuestion from "@/app/components/AiTools/ResearchQuestion/ResearchQuestion";
// import ThemeToggle from "@/app/components/AiLandingPage/ThemeToggle";

export default function ResearchQuestionPage() {
  const [flag, setFlag] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token");
    if (!isAuthenticated) {
      router.replace("/sign-in?returnUrl=/tools/research-question");
    }
  }, [router]);

  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-72" />
      }
    >
      {/* <ThemeToggle top="top-12" /> */}
      <ToolsLayout setFlag={setFlag} flag={flag}>
        <ResearchQuestion setFlag={setFlag} />
      </ToolsLayout>
    </Suspense>
  );
}
