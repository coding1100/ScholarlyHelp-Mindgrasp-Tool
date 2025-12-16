"use client";

import Image from "next/image";
import { plagiarismFreeContent } from "@/app/(pages)/plagiarism-free-process/content";
import GreenCheckIcon from "@/app/assets/Icons/greenCheck.png";

interface OriginalSectionProps {
  content?: {
    mainHeading?: string;
    description?: string;
    steps?: Array<{ title: string; description: string; img?: any }>;
    tags?: string[];
  };
}

const OriginalSection = ({ content }: OriginalSectionProps) => {
  const originalityContent = content || plagiarismFreeContent.originalityContent;
  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold text-black mb-3 sm:mb-4">
            {originalityContent.mainHeading}
          </h2>

          <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal text-[#263238] max-w-4xl mx-auto px-4 sm:px-0">
            {originalityContent.description}
          </p>
        </div>
      </div>

      <div className="max-w-[1157px] mx-auto space-y-6 sm:space-y-7 md:space-y-8 lg:space-y-9 px-4 sm:px-6 md:px-8">
        {(originalityContent.steps || []).map((step, index) => (
          <div
            className={`bg-white py-4 sm:py-[14px] md:py-[16px] lg:py-[18px] px-4 sm:px-5 md:px-6 rounded-[11px] flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-7 lg:gap-9 w-full max-w-full md:max-w-[900px] lg:max-w-[1000px] ${
              (index + 1) % 2 === 0
                ? "md:mr-auto md:ml-0"
                : "md:ml-auto md:mr-0"
            }`}
            style={{
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            }}
            key={index}
          >
            <div className="flex-shrink-0 w-full md:w-auto">
              <Image
                src={step.img}
                alt={step.title}
                className="rounded-md w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-none h-auto mx-auto md:mx-0"
              />
            </div>
            <div className="flex-1 w-full md:w-auto">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-3 sm:mb-3.5 md:mb-4">
                <div className="bg-[#B4ABEF] min-w-[40px] min-h-[40px] sm:min-w-[45px] sm:min-h-[45px] md:min-w-[50px] md:min-h-[50px] lg:min-w-[53px] lg:min-h-[53px] text-[20px] sm:text-[24px] md:text-[26px] lg:text-[30px] font-bold text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <p>{index + 1}</p>
                </div>
                <p className="text-[20px] sm:text-[24px] md:text-[26px] lg:text-[30px] font-bold text-black leading-tight sm:leading-[28px] md:leading-[30px] lg:leading-[32px]">
                  {step.title}
                </p>
              </div>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-normal text-[#263238]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-5 mt-12 sm:mt-16 md:mt-20 lg:mt-24 px-4 sm:px-6 md:px-8">
        {(originalityContent.tags || []).map((tag, index) => (
          <div
            key={index}
            className="bg-[#DAF6E9] rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 flex justify-center items-center gap-2 sm:gap-3 md:gap-3.5"
          >
            <Image
              src={GreenCheckIcon}
              alt=""
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
            />
            <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[23px] font-medium text-black">
              {tag}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OriginalSection;
