"use client";

import React from "react";
import Image from "next/image";
import { usePageData } from "./usePageData";
import { useMemo, useState, useEffect, FC } from "react";

interface AcademicPartnersProps {
  content?: {
    mainHeading?: string;
    description?: string;
    defaultCard?: {
      id: number;
      title: string;
      description: string;
    }[];
    cards?: { // Add support for 'cards' from admin panel
      id: number;
      title: string;
      description: string;
    }[];
    ctaButton?: {
      text: string;
    };
  };
}

const AcademicPartners: FC<AcademicPartnersProps> = ({ content: propsContent }) => {
  const pageData = usePageData();

  // Use props content if available, otherwise fallback to pageData
  const content = propsContent || pageData?.academicPartners;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1450);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const scrollToQuote = () => {
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      quoteForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  const defaultCards = [
    {
      id: 1,
      title: "Confidential partner",
      description:
        "Tired of complex homework? We handle it quickly and accurately. Get real-time help on classes that saves time and gets results.",
    },
    {
      id: 2,
      title: "Founded by Students",
      description:
        "Our CEO worked 30-hour shifts while enrolled full-time and was on the verge of expulsion twice due to academic pressure. We get it — we're solving the system that punishes people with real lives.",
    },
    {
      id: 3,
      title: "40+ Master's Level Tutors",
      description:
        "Every tutor is hand-selected through a 7-stage vetting process (only 3% of applicants make it).",
    },
    {
      id: 4,
      title: "2,100+ Courses Completed",
      description:
        "No time to study for the exam? Our experts take your exams for you, just like you're sitting there — with results that speak for themselves.",
    },
    {
      id: 5,
      title: "100% Confidentiality Guarantee",
      description:
        "Failing behind on assignments? Let us step in. When you ask us to do my online class for me, we make sure your coursework gets done right — and on time.",
    },
  ];

  type CardType = {
    id?: number | string;
    title?: string;
    description?: string;
  };

  interface Position {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }

  return (
    <section className="pt-[90px] pb-[90px] px-4 bg-gradient-to-b from-white w-full to-gray-50 ">
      <div className="max-w-7xl mx-auto flex max-[1450px]:flex-col max-[1320px]:px-8">
        {/* Hero Section */}
        <div className="text-left mb-12 w-[40%] max-[1450px]:w-[100%]">
          <h3 className="sm:text-4xl text-[32px] md:text-5xl sm:font-bold font-semibold text-gray-900 mb-4">
            {content?.mainHeading || "Your Academic Partners for Success"}
          </h3>
          <p className="sm:text-lg text-sm text-gray-600 max-w-3xl mb-8">
            {content?.description ||
              "From exams and essays to full-class management, we handle it all so you don't have to."}
          </p>
          <div className="flex sm:justify-start justify-center mt-[30px]">
            <button
              type="button"
              onClick={scrollToQuote}
              className="rounded-md px-3 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] md:w-64 w-52"
            >
              {content?.ctaButton?.text || "Take my online class"}
            </button>
          </div>
        </div>
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-[60%] relative min-h-[600px] mb-[120px] max-[1450px]:w-[100%] max-[1450px]:mb-[0px]">
          <Image
            src="/assets/Icon/card-line.svg"
            alt="Confidential partner"
            width={800}
            height={800}
            className="absolute top-[135px] left-[-100px] w-[120%] max-w-none max-[1450px]:hidden"
          />

          {/* Cards from MongoDB - Fallback to default if array is missing or empty */}
          {((content?.cards?.length ? content.cards : null) ?? (content?.defaultCard?.length ? content.defaultCard : null) ?? defaultCards).map(
            (card: CardType, index: number) => {
              const rotations = isMobile ? [0, 0, 0, 0, 0] : [3, -9, 6, -6, 0];
              const positions: Position[] = [
                { top: 30, left: 54 },
                { top: 2, right: 80 },
                { left: -186, bottom: -110 },
                { bottom: -120, left: 165 },
                { bottom: -100, right: -45 },
              ];
              const bgColors = [
                "#FEF6D3",
                "#ECF5DF",
                "#F5E2FE",
                "#CFE4FF",
                "#DDF3F1",
              ];
              const imagePaths = [
                "/assets/Icon/img-card-1.png",
                "/assets/Icon/img-card-2.png",
                "/assets/Icon/img-card-3.png",
                "/assets/Icon/img-card-4.png",
                "/assets/Icon/img-card-5.png",
              ];

              const rotation = rotations[index % rotations.length];
              const position = positions[index % positions.length];
              const bgColor = bgColors[index % bgColors.length];
              const imagePath = imagePaths[index % imagePaths.length];

              const cardStyle: React.CSSProperties = {
                backgroundColor: bgColor,
                transform: `rotate(${rotation}deg)`,
              };

              if (position.top !== undefined) cardStyle.top = `${position.top}px`;
              if (position.bottom !== undefined) cardStyle.bottom = `${position.bottom}px`;
              if (position.left !== undefined) cardStyle.left = `${position.left}px`;
              if (position.right !== undefined) cardStyle.right = `${position.right}px`;

              return (
                <div
                  key={card.id || index}
                  className="p-6 py-7 border-yellow-200 shadow-md hover:shadow-xl transition-shadow rounded-[21px] min-h-[310px] w-[289px] absolute z-[9] max-[1450px]:[position:unset] max-[1450px]:rotate-[0deg] max-[1450px]:min-h-fit max-[1450px]:w-full"
                  style={cardStyle}
                >
                  <div className="flex items-start space-x-4 flex-col">
                    <div className="flex-shrink-0 mb-2">
                      <Image
                        src={imagePath}
                        alt={card.title || ""}
                        width={52}
                        height={52}
                        className="object-contain"
                        style={{ transform: `rotate(${-rotation}deg)` }}
                      />
                    </div>
                    <div className="flex flex-col !ml-0">
                      <h3 className="font-semibold text-gray-900 mb-2 font-poppins sm:text-2xl text-xl leading-[1.2] tracking-normal font-poppins">
                        {card.title || ""}
                      </h3>
                      <p className="text-sm text-gray-600 font-poppins font-normal text-[15px] leading-[1.4] tracking-normal">
                        {card.description || ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};

export default AcademicPartners;
