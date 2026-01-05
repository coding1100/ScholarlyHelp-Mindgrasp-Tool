"use client";
import React from "react";
import { SiLatex } from "react-icons/si";
import { HiOutlineLockClosed } from "react-icons/hi";

const DownloadFileType: React.FC = () => {
  return (
    <div className="w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-2 z-[9999] relative">
      <button
        type="button"
        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <SiLatex className="text-gray-800" />
        <span>LaTeX (.tex)</span>
      </button>
      <button
        type="button"
        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        {/* <SiMicrosoftword className="text-[#2b579a]" /> */}
        <span>Word (.docx)</span>
      </button>
      <div
        aria-disabled
        className="w-full px-3 py-2 text-left text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed"
      >
        <HiOutlineLockClosed />
        <span>Copy to clipboard</span>
      </div>
    </div>
  );
};

export default DownloadFileType;
