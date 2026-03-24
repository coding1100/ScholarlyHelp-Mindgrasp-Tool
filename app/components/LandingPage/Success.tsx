// app/components/ThreeDCarousel.tsx
"use client";

import React, { useState, useEffect, useMemo, FC } from "react";
import Image from "next/image";
import { usePageData } from "./usePageData";
import { usePathname } from "next/navigation";
const proof5 = "/images/proof-3.webp";
const proof1 = "/images/proof-2.webp";
const proof2 = "/images/proof-2.webp";
const proof4 = "/images/proof-3.webp";

interface SuccessProps {
  content?: {
    mainHeading: string;
    description: string;
  };
}
const Success: FC<SuccessProps> = ({ content }) => {
  const data = usePageData();
  const success =
    content?.mainHeading && content?.description ? content : data?.success;

  const currentPath = usePathname();
  const isOnlineClassPage = currentPath.includes("online-class");
  const showStatsBar =
    currentPath === "/" ||
    // currentPath === "/take-my-class-2/" ||
    currentPath === "/online-class/" ||
    currentPath.startsWith("/online-class/");
  const shouldUseNewSliderDesign =
    currentPath === "/" ||
    currentPath === "/online-class" ||
    currentPath.startsWith("/online-class/");
  const scrollToQuote = () => {
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      quoteForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [active, setActive] = useState(0);

  type SlideType = {
    id?: number | string;
    image: string;
  };

  const defaultSlides: SlideType[] = [
    { id: 0, image: proof1 },
    { id: 1, image: proof2 },
    { id: 2, image: proof4 },
    { id: 3, image: proof5 },
  ];

  const slides = useMemo(() => {
    if (
      success?.slides &&
      Array.isArray(success.slides) &&
      success.slides.length > 0
    ) {
      return success.slides;
    }
    return defaultSlides;
  }, [success]);

  const courseName = (success as any)?.course || "Chemistry 101";
  const gradeChange = (success as any)?.beforeAfter || "A+ Grades";
  const totalScore = (success as any)?.total || "96.66%";

  // Auto-slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="pt-9 pb-20 px-5 overflow-hidden text-[#171717]">
      <div className="max-w-6xl max-[992px]:max-w-4xl mx-auto ">
        <div className="py-10 ">
          <h2 className="text-[42px] max-[768px]:text-[28px] mb-[20px] text-[#000] font-bold text-center">
            {success?.mainHeading || "What Success Looks Like"}
          </h2>
          <p className="sm:text-[18px] text-sm text-center">
            {success?.description ||
              "From exams and essays to full-class management, we handle it all so you don't have to."}
          </p>
        </div>
        <div
          className="relative max-[992px]:h-[400px] max-[768px]:h-[250px] max-[480px]:h-[150px] lg:h-[500px]"
          style={
            shouldUseNewSliderDesign
              ? undefined
              : { perspective: "1000px", transformStyle: "preserve-3d" }
          }
        >
          {slides.map((slide: SlideType, i: number) => {
            const next = (active + 1) % slides.length;
            const prev = (active + slides.length - 1) % slides.length;
            const isActive = i === active;
            let oldTransform = "translate3d(0,0,-500px)";
            let oldOpacity = "opacity-0";

            if (i === active) {
              oldTransform = "translate3d(0,0,0)";
              oldOpacity = "opacity-100";
            } else if (i === next) {
              oldTransform = "translate3d(25%,0,-250px)";
              oldOpacity = "opacity-40";
            } else if (i === prev) {
              oldTransform = "translate3d(-25%,0,-250px)";
              oldOpacity = "opacity-40";
            }

            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  shouldUseNewSliderDesign
                    ? isActive
                      ? "opacity-100 scale-100 z-20 cursor-pointer"
                      : "opacity-0 scale-[0.98] z-0 pointer-events-none"
                    : `${oldOpacity} cursor-pointer`
                }`}
                style={
                  shouldUseNewSliderDesign
                    ? undefined
                    : { transform: oldTransform }
                }
              >
                <div
                  className={`relative w-full h-full overflow-hidden ${
                    shouldUseNewSliderDesign
                      ? "rounded-xl border border-[#E7E8F0] bg-[#F7F8FC] lg:shadow-[0_10px_35px_rgba(40,60,136,0.12)]"
                      : "rounded-lg lg:shadow-2xl"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={`Slide ${i + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            );
          })}

          {/* Pagination Dots */}
          <div className="absolute hidden -bottom-12 left-0 right-0 justify-center space-x-3">
            {slides.map((_: SlideType, i: number) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === active ? "bg-gray-700 scale-110" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {showStatsBar && (
        <div
          className="max-w-6xl max-[992px]:max-w-6xl mx-auto bg-white py-4 px-4 rounded-b-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative z-50"
          style={{
            boxShadow:
              "rgba(231, 235, 255, 0.85) 0px 50px 100px -20px, rgba(231, 235, 255, 0.6) 0px 30px 60px -30px, rgba(231, 235, 255, 0.4) -30px 30px 60px -30px, rgba(231, 235, 255, 0.4) 30px 30px 60px -30px",
          }}
        >
          <div className="w-auto text-center sm:text-left">
            <p className="text-sm sm:text-[16px]">Course:</p>
            <p className="text-xl sm:text-[27px] font-bold uppercase break-words">
              {courseName}
            </p>
          </div>
          <div className="w-auto grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-5">
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-[16px]">Before → After:</p>
              <p className="text-xl sm:text-[27px] font-bold uppercase break-words">
                {gradeChange}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-[16px]">Total</p>
              <p className="text-xl sm:text-[27px] font-bold uppercase break-words">
                {totalScore}
              </p>
            </div>
          </div>
        </div>
      )}
      {!isOnlineClassPage ||
        (currentPath === "/" && (
          <div className="flex justify-center mt-[60px]">
            <button
              type="button"
              onClick={scrollToQuote}
              className="rounded-md px-6 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] max-[768px]:w-full font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] "
            >
              {success?.ctaButton?.text || "Secure My 'A' or 'B' Grades"}
            </button>
          </div>
        ))}
    </section>
  );
};

export default Success;
