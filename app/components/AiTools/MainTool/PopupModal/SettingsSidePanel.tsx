"use client";
import React from "react";
import { MdOutlineClose } from "react-icons/md";
import DocumentSettingsModalContent from "./DocumentSettingsModal";

interface SettingsSidePanelProps {
  open: boolean;
  onClose: () => void;
}

const PANEL_WIDTH_CLASS = "w-[360px] md:w-[420px]";

const SettingsSidePanel: React.FC<SettingsSidePanelProps> = ({
  open,
  onClose,
}) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 ${PANEL_WIDTH_CLASS} bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-medium text-gray-900">
            Document settings
          </h2>
          <button
            aria-label="Close settings"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <MdOutlineClose className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-4 py-4">
          <DocumentSettingsModalContent onBack={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SettingsSidePanel;
