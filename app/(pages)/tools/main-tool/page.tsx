"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Toaster, toast } from "react-hot-toast";
import MainToolLayout from "@/app/components/AiTools/MainTool/MainToolLayout";
import EditorContainer from "@/app/components/AiTools/MainTool/EditorContainer";
import MainDocEditer from "@/app/components/AiTools/MainTool/MainDocEditer";

const ClientPage = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [flag, setFlag] = useState(false);
  const searchParams = useSearchParams();
  const [outlineResponse, setOutlineResponse] = useState<string[]>([]);

  // This function simulates the API call and updates the state
  const handleStartWriting = () => {
    // Simulate API call
    toast.loading("Generating document...", { duration: 1500 });

    setTimeout(() => {
      setShowEditor(true);
      toast.success("Document ready!", { duration: 1000 });
    }, 2000);
  };

  useEffect(() => {
    if (searchParams?.get("start") === "1") {
      setShowEditor(true);
    }
  }, [searchParams]);

  return (
    <MainToolLayout flag={flag} setFlag={setFlag}>
      {showEditor ? (
        <EditorContainer outlineResponse={outlineResponse} />
      ) : (
        <MainDocEditer
          onStartWriting={handleStartWriting}
          setOutlineResponse={setOutlineResponse}
        />
      )}
      <Toaster />
    </MainToolLayout>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div />}>
      <ClientPage />
    </Suspense>
  );
};

export default Page;
