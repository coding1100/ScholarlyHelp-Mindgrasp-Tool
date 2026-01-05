"use client";
import { PiTextAaBold } from "react-icons/pi";
import { FaUndo, FaRedo } from "react-icons/fa";
import { MdFormatQuote } from "react-icons/md";
import { MdOutlineImage } from "react-icons/md";
import { MdOutlineSmartDisplay } from "react-icons/md";
import { MdOutlineFunctions } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const FooterBar = () => {
  return (
    <div className="flex justify-between items-center px-2 py-1 border-t border-gray-300 bg-white w-full mt-8 text-black">
      {/* Center buttons */}
      <div className="flex items-center gap-2 mx-auto">
        <button className="text-gray-700 text-lg hover:text-blue-600">
          <PiTextAaBold />
        </button>

        <span className="border-l h-5 border-gray-300"></span>

        <button className="text-sm text-gray-800 font-normal">T</button>

        <select className="text-sm border-none bg-transparent focus:outline-none cursor-pointer">
          <option>Text</option>
          <option>Heading</option>
          <option>Title</option>
        </select>

        <span className="border-l h-5 border-gray-300"></span>

        <button title="insert image" className="text-gray-600 hover:text-black">
          <MdOutlineImage className="text-lg" />
        </button>
        <button className="text-gray-600 hover:text-black">
          <MdOutlineSmartDisplay className="text-lg" />
        </button>
        <button className="text-gray-600 hover:text-black">
          <MdOutlineFunctions className="text-lg" />
        </button>
        <button className="text-gray-600 hover:text-black">
          <RxCross2 className="text-lg" />
        </button>

        <span className="border-l h-5 border-gray-300"></span>

        <button className="text-gray-600 hover:text-black">
          <FaUndo />
        </button>
        <button className="text-gray-600 hover:text-black">
          <FaRedo />
        </button>
      </div>

      {/* Right side stats */}
      <div className="flex items-center text-sm text-gray-600 gap-4">
        <span>0 words</span>
        <span>0 citations</span>
      </div>
    </div>
  );
};

export default FooterBar;
