"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import HeroWhySliderCard from "@/app/components/reusable/HeroWhySliderCard";
import icon1 from "@/app/assets/Icons/icon-1.svg";
import icon2 from "@/app/assets/Icons/icon-2.png";
import icon3 from "@/app/assets/Icons/icon-3.png";
import boxShadow from "@/app/assets/Images/center-box-shadow.svg";
import Image from "next/image";

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

const WhySlider: FC<WhySliderProps> = ({ whyData }) => {
  const baseItems: SliderItem[] = useMemo(
    () => [
      { icon: icon1, text: "Highly-Skilled Subject Experts", alt: "Experts" },
      { icon: icon2, text: "Highly Affordable Rates", alt: "Affordable Rates" },
      {
        icon: icon1,
        text: "100% User Confidentiality",
        alt: "Confidentiality",
      },
      {
        icon: icon3,
        text: "100% User Confidentiality",
        alt: "Confidentiality",
      },
      {
        icon: icon1,
        text: "100% User Confidentiality",
        alt: "Confidentiality",
      },
      {
        icon: icon3,
        text: "100% User Confidentiality",
        alt: "Confidentiality",
      },
      {
        icon: icon1,
        text: "100% User Confidentiality",
        alt: "Confidentiality",
      },
    ],
    []
  );

  const items: SliderItem[] = useMemo(
    () => [...baseItems, ...baseItems],
    [baseItems]
  );

  return (
    <section className="w-full overflow-hidden mt-[-100px] pt-[110px] pb-[30px] bg-white">
      <div className="w-full px-6 pb-10 scale-[1.03]">
        <div className="py-10 ">
          <h2 className="text-[42px] mb-2  font-bold text-center text-[#171717]">
            {whyData?.mainHeading
              ? whyData.mainHeading
              : "Why choose Scholarly"}
          </h2>
          <p className="sm:text-[18px] text-sm text-center text-[#171717] max-w-[970px] mx-auto">
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
            className="rounded-md px-3 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] md:w-64 w-48"
          >
            Take my online class
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhySlider;
