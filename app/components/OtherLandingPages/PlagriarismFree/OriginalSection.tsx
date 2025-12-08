"use client";

import Image from "next/image";
import { plagiarismFreeContent } from "@/app/(pages)/plagiarism-free-process/content";
import GreenCheckIcon from "@/app/assets/Icons/greenCheck.png";

const OriginalSection = () => {
  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold text-black mb-3 sm:mb-4">
            {plagiarismFreeContent.originalityContent.mainHeading}
          </h2>

          <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal text-[#263238] max-w-4xl mx-auto px-4 sm:px-0">
            {plagiarismFreeContent.originalityContent.description}
          </p>
        </div>
      </div>

      <div className="max-w-[1157px] mx-auto space-y-9">
        {plagiarismFreeContent.originalityContent.steps.map((step, index) => (
          <div
            className={`bg-white py-[18px] px-4 rounded-[11px] flex justify-center items-center gap-9 w-[1000px] ${
              (index + 1) % 2 === 0 ? "mr-auto" : "ml-auto"
            }`}
            style={{
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            }}
            key={index}
          >
            <Image src={step.img} alt="" className="rounded-md" />
            <div>
              <div className="flex items-center gap-6 mb-4">
                <div className="bg-[#B4ABEF] min-w-[53px] min-h-[53px] text-[30px] font-bold text-white rounded-full flex items-center justify-center">
                  <p>{index + 1}</p>
                </div>
                <p className="text-[30px] font-bold text-black leading-[32px]">
                  {step.title}
                </p>
              </div>
              <p className="text-[17px] font-normal text-[#263238]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex flex-wrap justify-center items-center gap-4 mt-24">
        {plagiarismFreeContent.originalityContent.tags.map((tag, index) => (
          <div
            key={index}
            className="bg-[#DAF6E9] rounded-lg p-6 flex justify-center items-center gap-3.5"
          >
            <Image src={GreenCheckIcon} alt="" className="w-7 h-7" />
            <p className="text-[23px] font-medium text-black">{tag}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OriginalSection;
