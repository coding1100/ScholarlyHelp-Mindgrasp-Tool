"use client";

import TutorFlow from "@/app/components/AiTools/Tutor/TutorFlow";
import { ChatProvider } from "@/app/context/ChatContext";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToolsLayout from "@/app/components/AiTools/ToolsLayout";
import AIParaphraser from "@/app/components/AiTools/AIParaphraser-tool";
// import ThemeToggle from "@/app/components/AiLandingPage/ThemeToggle";

export default function TutorPage() {
  const [flag, setFlag] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token");
    if (!isAuthenticated) {
      router.replace("/sign-in?returnUrl=/tools/paraphraser-tool");
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
        <ChatProvider>
          <div className="">
            <TutorFlow />
          </div>
        </ChatProvider>
      </ToolsLayout>
    </Suspense>
  );
}
