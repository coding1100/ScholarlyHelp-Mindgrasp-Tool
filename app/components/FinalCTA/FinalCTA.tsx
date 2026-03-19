"use client";

import { FC } from "react";
import SemiCircle from "@/app/assets/Images/finalCtaBg.png";
import { usePageData } from "../LandingPage/usePageData";
interface FinalCTAProps {}

const FinalCTA: FC<FinalCTAProps> = ({}) => {
  const data = usePageData() as any;
  const finalCta = data?.finalCta || {};
  const textBefore =
    (finalCta?.textBefore && String(finalCta.textBefore).trim()) || "Pass Your";
  const highlightedText =
    (finalCta?.highlightedText && String(finalCta.highlightedText).trim()) ||
    "Chemistry";
  const textAfter =
    (finalCta?.textAfter && String(finalCta.textAfter).trim()) ||
    "Class Without Burning Out.";
  const description =
    (finalCta?.description && String(finalCta.description).trim()) ||
    "You get a Guaranteed 'A' or 'B', 100% Domestic Logins, and 24/7 Support. Don't let Chemistry class ruin your GPA";
  const buttonText =
    (finalCta?.buttonText && String(finalCta.buttonText).trim()) ||
    "Secure My Grades Now";

  const scrollToQuote = () => {
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      quoteForm.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="bg-[#3C3D5D]">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 px-4 sm:px-6">
        <div className="lg:col-span-6 py-8 sm:py-10 lg:py-12">
          <p
            className="text-white lg:text-[42px] md:text-3xl sm:text-[28px] text-[32px] font-bold"
            style={{ lineHeight: "1.2" }}
          >
            {textBefore}{" "}
            <span
              className="bg-[#5A5BE0] rounded-full px-3 sm:px-4 py-1 md:-rotate-3 inline-block font-semibold whitespace-nowrap"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
              }}
            >
              {highlightedText}
            </span>{" "}
            {textAfter}
          </p>
          <p className="sm:text-lg text-base text-white mt-2.5 max-w-2xl">
            {description}
          </p>
        </div>
        <div
          className="lg:col-span-6 bg-cover min-h-[180px] sm:min-h-[220px] lg:min-h-full flex justify-center items-center py-6 lg:py-0"
          style={{
            backgroundImage: `url(${SemiCircle.src})`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <button
            onClick={scrollToQuote}
            type="button"
            className="w-full sm:w-[80%] lg:w-[75%] py-4 sm:py-6 rounded-md px-6 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-base sm:text-lg font-bold flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a]"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalCTA;
