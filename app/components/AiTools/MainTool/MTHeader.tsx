import React, { useContext, useEffect, useRef, useState } from "react";
import { CgMenu } from "react-icons/cg";
import { FaBolt } from "react-icons/fa";
import { HiMiniClock } from "react-icons/hi2";
import { RiSettings5Fill } from "react-icons/ri";
import { TitleContext } from "./MainToolLayout";
import PricingPopup from "../PricingPopup";
import DownloadFileType from "./PopupModal/DownloadFileType";
import PublishDocumentModal from "./PopupModal/PublishDocumentModal";
interface MTHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleSettings?: () => void;
}

const MTHeader = ({
  sidebarOpen,
  onToggleSidebar,
  onToggleSettings,
}: MTHeaderProps) => {
  const { title } = useContext(TitleContext);
  const [showPricing, setShowPricing] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [showPublish, setShowPublish] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showExport &&
        exportRef.current &&
        event.target instanceof Node &&
        !exportRef.current.contains(event.target)
      ) {
        setShowExport(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowExport(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showExport]);
  return (
    <div>
      <header className="sticky top-0 bg-white z-50  py-2 px-6 text-black ">
        <div className=" flex items-center justify-between">
          {/* Header left section */}
          <div className="flex items-center space-x-3">
            {!sidebarOpen && (
              <button
                onClick={onToggleSidebar}
                className="hover:bg-gray-200 rounded-lg p-2"
              >
                <CgMenu className="h-6 w-6 text-gray-400 cursor-pointer" />
              </button>
            )}
            <span className="text-lg  text-gray-800">
              {title || "Untitled"}
            </span>
          </div>
          {/*Header right section  */}
          <div className="flex items-center space-x-6">
            <button
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm  p-2 rounded-lg "
              onClick={() => setShowPricing(true)}
            >
              <FaBolt className="h-4 w-4 text-white" />
              <span>See Pricing</span>
            </button>

            <div className="relative" ref={exportRef}>
              <button
                className=" p-2 hover:bg-gray-200 rounded-lg text-sm transition duration-200"
                onClick={() => setShowExport((prev) => !prev)}
              >
                Export
              </button>
              {showExport && (
                <div className="absolute right-0 mt-2 z-50">
                  <DownloadFileType />
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className=" text-sm transition duration-200 hover:bg-gray-200 rounded-lg p-2"
                onClick={() => setShowPublish((prev) => !prev)}
              >
                Publish
              </button>
              {showPublish && (
                <PublishDocumentModal
                  open={showPublish}
                  onClose={() => setShowPublish(false)}
                  variant="popover"
                />
              )}
            </div>
            <button className="hover:bg-gray-200 rounded-lg p-2">
              <HiMiniClock className="h-6 w-6 cursor-pointer " />
            </button>
            <button
              className="hover:bg-gray-200 rounded-lg p-2"
              onClick={() => onToggleSettings && onToggleSettings()}
            >
              <RiSettings5Fill className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      {showPricing && <PricingPopup onClose={() => setShowPricing(false)} />}
    </div>
  );
};

export default MTHeader;
