"use client";
import React, { useState } from "react";
import { LuZap } from "react-icons/lu";
import PricingPopup from "./PricingPopup";
import { usePathname } from "next/navigation";

const ToolHeader: React.FC = () => {
  const [showPricing, setShowPricing] = useState(false);
  const currentPath = usePathname();
  
  // Normalize path by removing trailing slash for consistent comparison
  const normalizedPath = currentPath?.endsWith('/') ? currentPath.slice(0, -1) : currentPath;

  return (
    <header className="relative flex h-[8vh] items-center justify-between px-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 transition-colors duration-300">
      <div></div>
      {/* Centered Title */}

      <h1 className="md:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {normalizedPath === "/tools/paraphraser-tool"
          ? "AI Paraphraser Tool"
          : normalizedPath === "/tools/summarizer-tool"
          ? "AI summarizer Tool"
          : normalizedPath === "/tools/thesis-generator-tool"
          ? "AI Thesis Generator Tool"
          : normalizedPath === "/tools/essay-outline-tool"
          ? "AI Essay Outline Tool"
          : ""}
      </h1>

      {/* Right-aligned Button */}
      {/* <div className="absolute right-6"> */}
      <button
        type="button"
        onClick={() => setShowPricing(true)}
        className="flex font-sans items-center justify-center gap-2 rounded-lg bg-indigo-600 dark:bg-indigo-700 pl-3 pr-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 transition-colors duration-300"
      >
        <LuZap className="h-4 w-4 text-white" />
        See Pricing
      </button>
      {/* </div> */}
      {showPricing && <PricingPopup onClose={() => setShowPricing(false)} />}
    </header>
  );
};

export default ToolHeader;
