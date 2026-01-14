"use client";

import React, { FC } from "react";
import { usePathname } from "next/navigation";
import respavatar from "@/app/assets/Images/resp-avatar.svg";
import Link from "next/link";
import Image from "next/image";
const CHECK_BG = "#9F92EC";
const PRIMARY_BG = "#9F92EC";
const SECONDARY_BG = "#B0B0B0";

const CheckBadge: React.FC = () => (
  <span
    className="inline-flex sm:h-8 sm:w-8 h-6 w-6 items-center justify-center rounded-full"
    style={{ backgroundColor: CHECK_BG }}
  >
    {/* white check */}
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 11.2L0.8 6.5L2.914 4.386L5.5 6.972L12.772 0L14.886 2.114L5.5 11.2Z"
        fill="white"
      />
    </svg>
  </span>
);

interface HeroLeadProps {
  heroContent?: {
    mainHeading: string;
    subHeading?: string;
    description: string;
    btn1: string;
    btn2: string;
    btn1Url?: string;
    btn2Url?: string;
  };
}
const HeroLead: FC<HeroLeadProps> = ({ heroContent }) => {
  const pathname = usePathname();

  // Routes where badges section should be hidden
  const hiddenRoutes = [
    '/a-or-b-grade-guarantee',
    '/on-time-delivery-guarantee',
    '/success-stories-and-reviews',
    '/tools',
    '/guarantee-anonymity',
    '/plagiarism-free-process',
    '/us-based-phd-experts',
    '/take-my-class',
    '/take-my-class/',
    '/take-my-exam',
    '/take-my-exam/',
  ];

  const shouldHideBadges = hiddenRoutes.includes(pathname || '');

  // Routes where buttons should be hidden
  const buttonHiddenRoutes = [
    '/take-my-class',
    '/take-my-class/',
    '/take-my-exam',
    '/take-my-exam/',
  ];

  const shouldHideButtons = buttonHiddenRoutes.includes(pathname || '');

  return (
    <div className="max-w-2xl">
      <h1
        className="font-semibold text-[32px] md:text-[50px] leading-[1.1] text-black"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {heroContent?.mainHeading ? (
          <div dangerouslySetInnerHTML={{ __html: heroContent.mainHeading }} />
        ) : (
          <>
            Stop Sacrificing
            <br />
            Your Time, We&apos;ll
            <br />
            Handle Your
            <br />
            Classes
          </>
        )}
      </h1>

      {!shouldHideBadges && (
        <div className="mt-6 flex flex-col items-start gap-3 relative">
          <div className="inline-flex items-center gap-2 self-start rounded-full border max-[768px]:bg-[#D3D4F7] border-[#E9E9F1] bg-white/80 px-4 max-[768px]:px-3 py-2 z-[9]">
            <div>
              <CheckBadge />
            </div>
            <span className="sm:text-[16px] text-[14px] text-[#111318]">
              Free Up 20+ Hours/week
            </span>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border max-[768px]:bg-[#D3D4F7] border-[#E9E9F1] bg-white/80 max-[768px]:px-3 px-4 py-2 z-[9]">
            <div>
              <CheckBadge />
            </div>

            <span className="sm:text-[16px] text-[14px] text-[#111318]">
              24/7 support
            </span>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border max-[768px]:bg-[#D3D4F7] border-[#E9E9F1] bg-white/80 max-[768px]:px-3 px-4 py-2 z-[9]">
            <div>
              <CheckBadge />
            </div>
            <span className="sm:text-[16px] text-[14px] text-[#111318]">
              100% Confidential
            </span>
          </div>
          <div className="min-[768px]:hidden"> 
            <Image
              src={respavatar}
              alt=""
              className="absolute right-0 bottom-0 max-[430px]:w-[130px] max-[430px]:h-[130px]"
            />
          </div>
        </div>
        
      )}

      {heroContent?.subHeading && shouldHideBadges && (
        <div
          className="text-black text-[19px] mt-3 font-semibold "
          dangerouslySetInnerHTML={{ __html: heroContent.subHeading }}
        />
      )}
      {heroContent?.description && shouldHideBadges && (
        <div
          className="text-[#263238] text-[16px] mt-3 "
          dangerouslySetInnerHTML={{ __html: heroContent.description }}
        />
      )}

      {!shouldHideButtons && (
        <div className="mt-6 flex gap-4">
          {heroContent?.btn1Url ? (
            <Link
              href={heroContent.btn1Url}
              className="rounded-md px-5 py-3 sm:text-[15px] text-sm font-medium text-white shadow-sm transition-colors cursor-pointer max-[768px]:flex-grow  max-[768px]:text-center"
              style={{ backgroundColor: PRIMARY_BG }}
            >
              {heroContent?.btn1 ? heroContent.btn1 : "Take My Full Class"}
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-md px-5 py-3 sm:text-[15px] text-sm font-medium text-white shadow-sm transition-colors cursor-pointer max-[768px]:flex-grow  max-[768px]:text-center"
              style={{ backgroundColor: PRIMARY_BG }}
            >
              {heroContent?.btn1 ? heroContent.btn1 : "Take My Full Class"}
            </button>
          )}

          {heroContent?.btn2Url ? (
            <Link
              href={heroContent.btn2Url}
              className="rounded-md px-5 py-3 sm:text-[15px] text-sm font-medium text-white shadow-sm transition-colors cursor-pointer max-[768px]:flex-grow  max-[768px]:text-center"
              style={{ backgroundColor: SECONDARY_BG }}
            >
              {heroContent?.btn2 ? heroContent.btn2 : "Pass My Exam"}
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-md px-5 py-3 sm:text-[15px] text-sm font-medium text-white shadow-sm transition-colors transition-colors"
              style={{ backgroundColor: SECONDARY_BG }}
            >
              {heroContent?.btn2 ? heroContent.btn2 : "Pass My Exam"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroLead;
