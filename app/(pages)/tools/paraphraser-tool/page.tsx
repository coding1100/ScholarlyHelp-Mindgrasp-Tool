"use client";

import { Suspense, useState } from "react";
// import dynamic from "next/dynamic";
import ToolsLayout from "@/app/components/AiTools/ToolsLayout";
import AIParaphraser from "@/app/components/AiTools/AIParaphraser-tool";
import ThemeToggle from "@/app/components/AiLandingPage/ThemeToggle";

// const ToolsLayout = dynamic(
//   () => import("@/app/components/ToolLayout/ToolsLayout"),
//   {
//     loading: () => <div className="animate-pulse bg-gray-200 h-72" />,
//   }
// );
// const AIParaphraser = dynamic(
//   () => import("@/app/components/WritelyAi/AIParaphraser-tool"),
//   {
//     loading: () => <div className="animate-pulse bg-gray-200 h-72" />,
//   }
// );

export default function ParaphraserPage() {
  // const token = localStorage.getItem("access_token");
  const [flag, setFlag] = useState<boolean>(false);
  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-72" />
      }
    >
      <ThemeToggle />
      <ToolsLayout setFlag={setFlag} flag={flag}>
        <AIParaphraser setFlag={setFlag} />
      </ToolsLayout>
    </Suspense>
  );
}
