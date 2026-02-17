import React from "react";

interface AISuggestionProps {
  suggestion: string;
  position: { top: number; left: number };
  onAccept: () => void;
  onTryAgain: () => void;
}

const AISuggestion: React.FC<AISuggestionProps> = ({
  suggestion,
  position,
  onAccept,
  onTryAgain,
}) => (
  <div
    className=" z-20 bg-transparent"
    style={{ top: position.top, left: position.left }}
  >
    <span className="text-gray-400">{suggestion}</span>
    <div className="flex gap-2 mt-1 items-center">
      <button
        className="px-2 py-1 bg-green-500 text-white rounded text-xs"
        onClick={onAccept}
      >
        Accept <span className="ml-1 text-[10px]">(Shift + →)</span>
      </button>
      <button
        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
        onClick={onTryAgain}
      >
        Try Again
      </button>
    </div>
  </div>
);

export default AISuggestion;
