"use client";

import Image from "next/image";
import { Content } from "@/app/(pages)/us-based-phd-experts/content";

const TrustSection = () => {
  return (
    <section className="w-full bg-[#ECECFC] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold text-black mb-3 sm:mb-4">
            {Content.supportContent.mainHeading}
          </h2>

          <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal text-[#263238] max-w-4xl mx-auto px-4 sm:px-0">
            {Content.supportContent.description}
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-4 justify-center items-center">
          {Content.supportContent.steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center"
            >
              <Image src={step.img} alt="" />
              <p className="text-[30px] font-bold text-[#493E8E]">
                {step.title}
              </p>
              <p className="text-[17px] font-normal text-[#263238]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
