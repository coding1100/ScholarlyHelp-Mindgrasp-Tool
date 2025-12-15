"use client";

import React, { useState } from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ToolsLayout from "@/app/components/AiTools/ToolsLayout";
import EssayOutlinetool from "@/app/components/AiTools/EssayOutline-tool";

// Try with simpler fallbacks first
// const ToolsLayout = dynamic(
//   () => import("@/app/components/ToolLayout/ToolsLayout"),
//   {
//     loading: () => <p>Loading layout...</p>,
//   }
// );

// const EssayOutlinetool = dynamic(
//   () => import("@/app/components/WritelyAi/EssayOutline-tool"),
//   {
//     loading: () => <p>Loading tool...</p>,
//   }
// );

const Page = () => {
  const [flag, setFlag] = useState(false);

  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <ToolsLayout setFlag={setFlag} flag={flag}>
        <EssayOutlinetool />
      </ToolsLayout>
    </Suspense>
  );
};

export default Page;
