"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import ToolsLayout from "@/app/components/AiTools/ToolsLayout";
import SummarizerTool from "@/app/components/AiTools/summarizer-tool";

// const ToolsLayout = dynamic(
//   () => import("@/app/components/ToolLayout/ToolsLayout"),
//   {
//     loading: () => <div className="animate-pulse bg-gray-200 h-72" />,
//   }
// );
// const SummarizerTool = dynamic(
//   () => import("@/app/components/WritelyAi/summarizer-tool"),
//   {
//     loading: () => <div className="animate-pulse bg-gray-200 h-72" />,
//   }
// );
export default function ParaphraserPage() {
  const [flag, setFlag] = useState<boolean>(false);
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-72" />}>
      <ToolsLayout setFlag={setFlag} flag={flag}>
        <SummarizerTool />
      </ToolsLayout>
    </Suspense>
  );
}
