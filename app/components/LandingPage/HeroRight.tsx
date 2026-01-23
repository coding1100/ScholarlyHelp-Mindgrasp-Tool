"use client";

import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";
import HeroForm from "./HeroForm"; // Direct import for LCP - no dynamic loading
import Illustration from "@/app/assets/Images/Hero-Group-195.webp";
import Bg1 from "@/app/assets/Images/Hero-b-1.png";
import Bg2 from "@/app/assets/Images/Hero-b-2.png";
import Bg3 from "@/app/assets/Images/Hero-b-3.png";
import Bg4 from "@/app/assets/Images/Hero-b-4.png";
import Bg5 from "@/app/assets/Images/rev-icon.svg";
import Heart from "@/app/assets/Images/Hero-b-Heart.png";
import Update from "@/app/assets/Images/Hero-b-Update.png";
import Discount from "@/app/assets/Images/Hero-b-Discount.png";
import TomIcon from "@/app/assets/Icons/tom.png";

const Star: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
      fill="#FFB400"
    />
  </svg>
);

interface HeroRightProps {
  formBackImg2?: StaticImageData;
}
const HeroRight: FC<HeroRightProps> = ({ formBackImg2 }) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="relative flex items-start gap-6 z-[999]">
        {/* background decorative layer behind the form - lazy load decorative images */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
          <Image
            src={Bg1}
            alt=""
            className="absolute -left-[80px] top-[130px] opacity-50"
            fetchPriority="high"
          />
          <Image
            src={Bg3}
            alt=""
            className="absolute -left-[80px] -top-10 opacity-50"
            fetchPriority="high"
          />
          <Image
            src={Bg2}
            alt=""
            className="absolute -left-[80px] top-[300px] opacity-50"
            fetchPriority="high"
          />
          <Image
            src={Bg4}
            alt=""
            className="absolute left-28 -top-20 opacity-50"
            fetchPriority="high"
          />
        </div>

        {/* form sits above decorative layer */}
        <div className="relative z-[99] w-full">
          <HeroForm formBackImg2={formBackImg2} />
        </div>

        {/* right column: illustration + rating stacked; illustration sits slightly under the form */}
        {/* <div className="relative z-1 -ml-12 hidden flex-col gap-5 md:flex">
          <Image src={Illustration} alt="A+ subject illustration" priority className="h-auto w-[340px]" />
          <div className="flex max-w-xs flex-col gap-2">
            <div className="flex items-center gap-1">
              <Star /><Star /><Star /><Star /><Star />
            </div>
            <div className="font-semibold text-[#1E1E1E]">Stress Free A+</div>
            <p className="text-[14px] leading-6 text-[#555B66]">
              Scholarly has taken 100% of the stress I usually deal with when...
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg[#F2F3F8] text-[12px] text-[#6A6F7A]">T</span>
              <div className="text-[12px] text-[#6A6F7A]">
                <div>Tom Q.</div>
                <div>Engineering Student, Devry University</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* mobile rating under the form */}
      <div className="flex max-w-md min-[768px]:flex-col gap-4 md:hidden relative z-20 max-[768px]:p-5 max-[768px]:bg-[#9F92EC1A]">
        <div className="min-[768px]:hidden"> 
        <Image
            src={Bg5}
            alt=""
            className=""
            fetchPriority="high"
          />
        </div>
        <div className="">
          <div className="flex items-center gap-1">
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </div>

          <div className="font-semibold text-[#1E1E1E]">Stress Free A+</div>
          <p className="text-[14px] leading-6 text-[#555B66]">
            Scholarly has taken 100% of the stress I usually deal with when...
          </p>
          <div className="mt-2 flex items-center gap-2">
            {/* <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F2F3F8] text-[12px] text-[#6A6F7A]">
              <Image
                src={TomIcon}
                alt="Tom Icon"
                className="max:w-[31px] min-w-[28px]"
              />
            </span> */}
            <div className="text-[12px] text-[#6A6F7A]">
              <div></div>
              <div><span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F2F3F8] text-[12px] text-[#6A6F7A] border border-[#c7c7c7] mr-[5px] bg-[#eee]">T</span> Engineering Student, Devry University</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroRight;
