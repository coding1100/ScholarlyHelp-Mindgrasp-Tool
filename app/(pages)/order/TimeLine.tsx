"use client";

import { FC, useState } from "react";
// import "./index.css"; // Removed custom CSS
import { steps } from "./contentSteps";

interface TimeLineProps {
  activeStep: number;
  setActiveStep: any;
}
const TimeLine: FC<TimeLineProps> = ({ activeStep = 1, setActiveStep }) => {
  // const { state } = useAuthContext();
  // const { user } = state;
  const handleClick = (index: any) => {
    // if (!user?.email && index > 2) return;
    setActiveStep(index);
  };
  return (
    <div className="container mx-auto my-10 ">
      <div
        className="grid grid-cols-12 relative"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        {steps.map((step, index) => (
          <div key={index} className="col-span-4 flex flex-col items-center">
            <div className="px-2.5 z-10 bg-white">
              <div
                className={`h-10 w-10 rounded-full border border-[#A3A3A3] flex items-center justify-center pt-1 cursor-pointer  ${activeStep > index ? "border-[#565add] bg-[#565add] text-white" : ""
                  }`}
                onClick={() => handleClick(index + 1)}
              >
                {index + 1}
              </div>
            </div>
            <div className="mt-3">{step.label}</div>
          </div>
        ))}
        <div className="bg-[#A3A3A3] h-[1px] max-w-[70%] mx-auto absolute left-0 right-0 top-[18.5px]" />
      </div>
    </div>
  );
};

export default TimeLine;
