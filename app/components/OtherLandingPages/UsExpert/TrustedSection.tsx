"use client";

import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface TrustSectionProps {
  content: {
    mainHeading: string;
    description?: string;
    steps: {
      img: StaticImageData;
      title: string;
      description: string;
    }[];
  };
}

const TrustSection: FC<TrustSectionProps> = ({ content }) => {
  const currentPage = usePathname();
  return (
    <section
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 ${
        currentPage === "/success-stories-and-reviews"
          ? "bg-[#565ADD]"
          : "bg-[#ECECFC]"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2
            className={`text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold ${
              currentPage === "/success-stories-and-reviews"
                ? "text-white"
                : "text-black"
            } mb-3 sm:mb-4`}
          >
            {content.mainHeading}
          </h2>
          {content.description && (
            <p
              className={`text-[14px] sm:text-[15px] md:text-[16px] font-normal ${
                currentPage === "/success-stories-and-reviews"
                  ? "text-white"
                  : "text-[#263238]"
              } max-w-4xl mx-auto px-4 sm:px-0`}
            >
              {content.description}
            </p>
          )}
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 grid-cols-2 justify-center items-center">
          {content.steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center md:mb-0 mb-5 text-center"
            >
              {currentPage === "/success-stories-and-reviews" ? (
                <div className="md:w-auto w-[60px]">
                  <Image
                    src={step.img}
                    alt=""
                    className="w-full h-auto"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </div>
              ) : (
                <Image src={step.img} alt="" className="md:w-auto w-[60px]" />
              )}
              <p
                className={`text-[30px] font-bold ${
                  currentPage === "/success-stories-and-reviews"
                    ? "text-white"
                    : "text-[#493E8E]"
                }`}
              >
                {step.title}
              </p>
              <p
                className={`text-[17px] font-normal ${
                  currentPage === "/success-stories-and-reviews"
                    ? "text-white"
                    : "text-[#263238]"
                }`}
              >
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
