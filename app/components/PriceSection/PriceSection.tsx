"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { FaShield } from "react-icons/fa6";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { usePageData } from "@/app/components/LandingPage/usePageData";
import VisaCard from "@/app/assets/Images/visaIcon.webp";
import MasterCard from "@/app/assets/Images/masterCardIcon.webp";
import AmericanExpress from "@/app/assets/Images/americanExpressIcon.webp";
import Discover from "@/app/assets/Images/discovercard.png";

const DEFAULT_MAIN_HEADING_LINE1 = "The Best Price";
const DEFAULT_MAIN_HEADING_LINE2 = "Offer You've Seen";
const DEFAULT_DESCRIPTION_1 =
  "At The Online Class Help, our experts have mastery over multiple online exam platforms. We do our best to make online chemistry exams stress-free.";
const DEFAULT_DESCRIPTION_2 =
  "Our qualified chemistry expert offers the top services when you hire us to do your online chemistry exam so that each student can be assured of his or her academic targets being accomplished with confidence, precision as well and assured outcomes.";
const DEFAULT_CARD_HEADING = "The Best Price Offer You've Seen";
const DEFAULT_BUTTON_TEXT = "Order Now";

const DEFAULT_PRICE_ITEMS = [
  { service: "Class", price: "$70", unit: "/week" },
  { service: "Exams", price: "$100", unit: "" },
  { service: "Quiz", price: "$70", unit: "" },
  { service: "Assignment", price: "$25", unit: "" },
  { service: "Homework", price: "$25", unit: "" },
  { service: "Essay", price: "$10", unit: "/page" },
];

const DEFAULT_BENEFITS = [
  "Built by Students, for Students",
  "Confidential Academic Partner",
  "100% Confidentiality Commitment",
];

function PurpleCheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      aria-hidden
    >
      <circle cx="12" cy="12" r="12" fill="#7B61FF" />
      <path
        d="M7 12l3 3 7-7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 text-gray-800"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 text-gray-800"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

type PriceItem = { service: string; price: string; unit: string };

export default function PriceSection() {
  const pageData = usePageData() as {
    priceSection?: {
      mainHeadingLine1?: string;
      mainHeadingLine2?: string;
      description1?: string;
      description2?: string;
      cardHeading?: string;
      buttonText?: string;
      benefits?: string[];
      priceItems?: PriceItem[];
    };
  } | null;

  const {
    mainHeadingLine1,
    mainHeadingLine2,
    description1,
    description2,
    cardHeading,
    buttonText,
    benefits,
    priceItems,
  } = useMemo(() => {
    const section = pageData?.priceSection;
    const mainHeadingLine1 =
      (section?.mainHeadingLine1 && String(section.mainHeadingLine1).trim()) ||
      DEFAULT_MAIN_HEADING_LINE1;
    const mainHeadingLine2 =
      (section?.mainHeadingLine2 && String(section.mainHeadingLine2).trim()) ||
      DEFAULT_MAIN_HEADING_LINE2;
    const description1 =
      (section?.description1 && String(section.description1).trim()) ||
      DEFAULT_DESCRIPTION_1;
    const description2 =
      (section?.description2 && String(section.description2).trim()) ||
      DEFAULT_DESCRIPTION_2;
    const cardHeading =
      (section?.cardHeading && String(section.cardHeading).trim()) ||
      DEFAULT_CARD_HEADING;
    const buttonText =
      (section?.buttonText && String(section.buttonText).trim()) ||
      DEFAULT_BUTTON_TEXT;
    const benefits =
      Array.isArray(section?.benefits) && section.benefits.length > 0
        ? section.benefits
            .map((b) =>
              typeof b === "string"
                ? b
                : ((b as { text?: string })?.text ?? ""),
            )
            .map((s) => (s != null ? String(s).trim() : ""))
            .filter(Boolean)
        : DEFAULT_BENEFITS;
    const priceItems: PriceItem[] =
      Array.isArray(section?.priceItems) && section.priceItems.length > 0
        ? section.priceItems
            .map((p) => ({
              service: (p?.service && String(p.service).trim()) || "",
              price: (p?.price && String(p.price).trim()) || "",
              unit: (p?.unit && String(p.unit).trim()) || "",
            }))
            .filter((p) => p.service || p.price)
        : DEFAULT_PRICE_ITEMS;
    return {
      mainHeadingLine1,
      mainHeadingLine2,
      description1,
      description2,
      cardHeading,
      buttonText,
      benefits,
      priceItems,
    };
  }, [pageData?.priceSection]);

  const scrollToQuote = () => {
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      quoteForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white pt-12 md:pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-[1320px]:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left column - content */}
          <div className="col-span-1">
            <p className="font-bold text-gray-900 text-3xl leading-tight sm:text-4xl md:text-[2.5rem] lg:text-5xl">
              {mainHeadingLine1}
              {/* <br />
              <span className="text-4xl sm:text-[2.75rem] md:text-5xl lg:text-[3rem]">
                {mainHeadingLine2}
              </span> */}
            </p>
            <p className="mt-5 text-base text-gray-600 sm:text-lg">
              {description1}
            </p>
            {/* <p className="mt-3 text-base text-gray-600 sm:text-lg">
              {description2}
            </p> */}
            <ul className="mt-6 space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-base text-gray-700 sm:text-lg"
                >
                  <PurpleCheckIcon />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column - pricing card */}
          <div className="col-span-1">
            <div className="rounded-2xl bg-[#ECECFC] p-6 shadow-md sm:p-8">
              <h3 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
                {cardHeading}
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
                {priceItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-xl bg-white px-3 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span className="text-center text-sm font-medium text-gray-600 sm:text-base">
                      {item.service}
                    </span>
                    <div className="sm:mt-8 mt-3 flex items-baseline justify-center gap-0.5 text-[#ff641a]">
                      <span className="text-xl font-bold sm:text-[45px]">
                        {item.price}
                      </span>
                      {item.unit && (
                        <span className="text-sm">{item.unit}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={scrollToQuote}
                className="mt-6 w-full rounded-lg bg-[#ff641a] py-3.5 text-base font-semibold text-white transition duration-300 hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] border border-transparent sm:py-4 sm:text-lg"
              >
                {buttonText}
              </button>
              <div className=" flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 border border-[#c4c4d1] rounded-full px-3 py-1">
                    <FaShield className="!w-4 !h-4" />
                    <span className="!text-[10px] font-bold uppercase tracking-wide text-gray-600 sm:text-sm">
                      Money back guarantee
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border border-[#c4c4d1] rounded-full px-3 py-1">
                    <RiCheckboxCircleFill className="!w-4 !h-4" />
                    <span className="!text-[10px] font-bold uppercase tracking-wide text-gray-600 sm:text-sm">
                      No hidden charges
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap12 ml-auto">
                  <div className="relative h-6 w-10">
                    <Image
                      src={VisaCard}
                      alt="Visa"
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>
                  <div className="relative h-6 w-10">
                    <Image
                      src={MasterCard}
                      alt="Mastercard"
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>
                  <div className="relative h-6 w-10">
                    <Image
                      src={AmericanExpress}
                      alt="American Express"
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>
                  <div className="relative h-6 w-10">
                    <Image
                      src={Discover}
                      alt="Discover"
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
