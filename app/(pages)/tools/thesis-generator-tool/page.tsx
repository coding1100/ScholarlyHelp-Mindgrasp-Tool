"use client";
import React, { useState } from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ToolsLayout from "@/app/components/AiTools/ToolsLayout";
import ThesisGenerator from "@/app/components/AiTools/ThesisGenerator-tool";
import ThemeToggle from "@/app/components/AiLandingPage/ThemeToggle";

// const ToolsLayout = dynamic(
//   () => import("@/app/components/ToolLayout/ToolsLayout"),
//   {
//     loading: () => <div className="animate-pulse bg-gray-200 h-72" />,
//   }
// );
// const ThesisGenerator = dynamic(
//   () => import("@/app/components/WritelyAi/ThesisGenerator-tool"),
//   {
//     loading: () => <div className="animate-pulse bg-gray-200 h-72" />,
//   }
// );
const Page = () => {
  const [flag, setFlag] = useState<boolean>(false);
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
