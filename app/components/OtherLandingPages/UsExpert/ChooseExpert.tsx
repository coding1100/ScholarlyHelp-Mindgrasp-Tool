"use client";

import Image from "next/image";
import { Content } from "@/app/(pages)/us-based-phd-experts/content";

const ChooseExpert = () => {
  return (
    <section className="w-full bg-[#565ADD] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 mb-24">
      <div className="max-w-7xl mx-auto text-white">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold  mb-3 sm:mb-4">
            {Content.supportContent.mainHeading}
          </h2>

          <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal  max-w-4xl mx-auto px-4 sm:px-0">
            {Content.supportContent.description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Content.chooseExpertSection.steps.map((step, index) => (
          <div key={index} className="bg-white px-[83px] py-10">
            <div className="flex items-center gap-4">
              <Image src={step.icon} alt="" />
              <p className="text-[30px] font-bold text-black leading-[38px]">
                {step.title}
              </p>
            </div>
            <p className="text-[17px] font-normal text-[#263238] ">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChooseExpert;
