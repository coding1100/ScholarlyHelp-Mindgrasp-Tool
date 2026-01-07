"use client";

import Image, { StaticImageData } from "next/image";
import { FC } from "react";

interface ChooseExpertProps {
  content: {
    mainHeading: string;
    description: string;
    steps: {
      icon: StaticImageData;
      title: string;
      description: string;
    }[];
  };
}

const ChooseExpert: FC<ChooseExpertProps> = ({ content }) => {
  return (
    <section className="w-full bg-[#565ADD] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8"> 
      <div className="max-w-7xl mx-auto text-white">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold mb-3 sm:mb-4">
            {content.mainHeading}
          </h2>

          <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal  max-w-4xl mx-auto px-4 sm:px-0">
            {content.description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {content.steps.map((step, index) => (
          <div
            key={index}
            className="bg-white lg:px-[83px] [992px]:px-[60px] md:px-[40px] px-5 py-10"
          >
            <div className="flex items-center gap-4">
              <Image src={step.icon} alt="" className="w-[60px] " />
              <p className="md:text-[30px] sm:text-[24px] text-[20px] font-bold text-black md:leading-[38px] sm:leading-[28px] leading-[24px]">
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
