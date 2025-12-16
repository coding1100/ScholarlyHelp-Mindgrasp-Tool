"use client";

import Image from "next/image";
import { guaranteeAnonymityContent } from "@/app/(pages)/guarantee-anonymity/content";

interface PrivacySectionProps {
  content?: {
    mainHeading?: string;
    subHeading?: string;
    description?: string;
    steps?: Array<{ title: string; description: string; img?: any }>;
  };
}

const PrivacySection = ({ content }: PrivacySectionProps) => {
  const privacyContent = content || guaranteeAnonymityContent.privacyContent;

  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold text-black mb-3 sm:mb-4">
            {privacyContent.mainHeading}
          </h2>
          <p className="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-semibold text-black mb-3 sm:mb-4">
            {privacyContent.subHeading}
          </p>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal text-[#263238] max-w-4xl mx-auto px-4 sm:px-0">
            {privacyContent.description}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-8 sm:mt-10 md:mt-12 max-w-[780px] mx-auto">
          {(privacyContent.steps || []).map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 p-4 sm:p-5 md:p-6 mb-8 sm:mb-10 md:mb-12 last:mb-0"
            >
              {index % 2 === 0 ? (
                <>
                  {/* Image */}
                  <div className="order-1 md:order-1 flex justify-center md:justify-start">
                    <Image
                      src={step.img}
                      alt={step.title}
                      className="object-contain md:w-auto sm:w-[200px] w-[100px]"
                    />
                  </div>
                  {/* Text Content */}
                  <div className="order-2 md:order-2 text-center md:text-left">
                    <h3 className="text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30px] font-bold text-black mb-2 sm:mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal text-[#263238]">
                      {step.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Text Content */}
                  <div className="order-2 md:order-1 text-center md:text-left">
                    <h3 className="text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30px] font-bold text-black mb-2 sm:mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal text-[#263238]">
                      {step.description}
                    </p>
                  </div>
                  {/* Image */}
                  <div className="order-1 md:order-2 flex justify-center md:justify-end">
                    <Image
                      src={step.img}
                      alt={step.title}
                      className="object-contain md:w-auto sm:w-[200px] w-[100px]"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
