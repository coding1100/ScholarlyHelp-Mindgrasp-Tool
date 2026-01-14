"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import HeroWhySliderCard from "@/app/components/reusable/HeroWhySliderCard";
import icon1 from "@/app/assets/Icons/icon-1.svg";
import icon2 from "@/app/assets/Icons/icon-2.png";
import icon3 from "@/app/assets/Icons/icon-3.png";
import icon4 from "@/app/assets/Icons/icon-4.png";
import icon5 from "@/app/assets/Icons/icon-5.png";
import icon6 from "@/app/assets/Icons/icon-6.png";
import icon7 from "@/app/assets/Icons/icon-7.png";
import icon8 from "@/app/assets/Icons/icon-8.png";

import boxShadow from "@/app/assets/Images/center-box-shadow.svg";
import Image from "next/image";
import { usePageData } from "./usePageData";

type SliderItem = {
  icon: string | any;
  text: string;
  alt?: string;
};

function SliderRow({
  items,
  direction = "left",
  intervalMs = 2500,
}: {
  items: SliderItem[];
  direction?: "left" | "right";
  intervalMs?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState<number>(320);

  useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCardWidth(Math.round(rect.width + 20));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame: number | null = null;
    let lastScrollAt = Date.now();

    const step = () => {
      const now = Date.now();
      if (now - lastScrollAt >= intervalMs) {
        lastScrollAt = now;
        const maxLoopPoint = container.scrollWidth / 2;
        if (direction === "left") {
          const nextLeft = container.scrollLeft + cardWidth;
          if (nextLeft >= maxLoopPoint) {
            container.scrollLeft = 0;
          } else {
            container.scrollTo({ left: nextLeft, behavior: "smooth" });
          }
        } else {
          const prevLeft = container.scrollLeft - cardWidth;
          if (prevLeft < 0) {
            container.scrollLeft = Math.max(maxLoopPoint - cardWidth, 0);
          } else {
            container.scrollTo({ left: prevLeft, behavior: "smooth" });
          }
        }
      }
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [cardWidth, direction, intervalMs]);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth"
    >
      {/* <Image
        src={boxShadow}
        alt=""
        width={300}
        height={200}
        className=""
      /> */}
      {items.map((item, index) => (
        <div
          key={index}
          ref={index === 0 ? cardRef : undefined}
          className="snap-start"
        >
          <HeroWhySliderCard
            icon={item.icon}
            text={item.text}
            alt={item.alt}
            className="min-w-[280px] sm:min-w-[300px] lg:min-w-[360px]"
          />
        </div>
      ))}
    </div>
  );
}

interface WhySliderProps {
  whyData?: {
    mainHeading: string;
    description: string;
    sliderItems: {
      icon: any;
      text: string;
      alt: string;
    }[];
  };
}

const WhySlider: FC<WhySliderProps> = ({ whyData: propWhyData }) => {
  const data = usePageData();
  const whyData = propWhyData || data?.whySlider;

  // Convert MongoDB sliderItems to component format
  const mongoItems: SliderItem[] = useMemo(() => {
    if (whyData?.sliderItems && Array.isArray(whyData.sliderItems)) {
      return whyData.sliderItems.map((item: any) => ({
        icon: item.icon || icon1,
        text: item.text || "",
        alt: item.alt || "",
      }));
    }
    return [];
  }, [whyData]);

  const baseItems: SliderItem[] = useMemo(
    () =>
      mongoItems.length > 0
        ? mongoItems
        : [
          {
            icon: icon2,
            text: "Highly-Skilled Subject Experts",
            alt: "",
          },
          {
            icon: icon1,
            text: "Highly Affordable Rates",
            alt: "",
          },
          {
            icon: icon3,
            text: "100% User Confidentiality",
            alt: "",
          },
          {
            icon: icon4,
            text: "Deliver Resourceful Solutions",
            alt: "",
          },
          {
            icon: icon5,
            text: "Produce Premium Content",
            alt: "",
          },
          {
            icon: icon6,
            text: "Zero Grammatical Mistakes",
            alt: "",
          },
          {
            icon: icon7,
            text: "Non-Plagiarized Content",
            alt: "",
          },
          {
            icon: icon8,
            text: "Live Chat Support Availability",
            alt: "",
          },
        ],
    [mongoItems]
  );

  const items: SliderItem[] = useMemo(
    () => [...baseItems, ...baseItems],
    [baseItems]
  );

  return (
    <section className="w-full overflow-hidden  pb-[30px] bg-white">
      <div className="w-full px-6 pb-10 scale-[1.03]">
        <div className="py-10 ">
          <h2 className="text-[42px] mb-3 font-bold text-center text-[#171717]">
            {whyData?.mainHeading
              ? whyData.mainHeading
              : "Why choose Scholarly"}
          </h2>
          <p className="sm:text-lg text-sm text-gray-600 max-w-3xl mx-auto text-center">
            {whyData?.description
              ? whyData.description
              : "Scholarly Help offers plenty of services through skilled online class helpers and various subject experts."}
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <SliderRow
            items={whyData?.sliderItems ? whyData.sliderItems : items}
            direction="left"
            intervalMs={4500}
          />
          <SliderRow
            items={whyData?.sliderItems ? whyData.sliderItems : items}
            direction="right"
            intervalMs={4000}
          />
          <SliderRow
            items={whyData?.sliderItems ? whyData.sliderItems : items}
            direction="left"
            intervalMs={3500}
          />
        </div>
        <div className="flex justify-center mt-[60px]">
          <button
            type="button"
            className="rounded-md px-6 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px]"
            onClick={() => {
              const form = document.getElementById("quote-form");
              if (form) {
                form.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {whyData?.ctaButton?.text || "Take my online class"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhySlider;
