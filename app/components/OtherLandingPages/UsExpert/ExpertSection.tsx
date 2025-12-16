"use client";

import Image, { StaticImageData } from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, FC } from "react";

interface ExpertSectionProps {
  content: {
    mainHeading: string;
    description: string;
    slider: {
      img: StaticImageData;
      expertName: string;
      designation: string;
      description: string;
    }[];
  };
}

const ExpertSection: FC<ExpertSectionProps> = ({ content }) => {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const goPrev = () => sliderRef.current?.slickPrev();
  const goNext = () => sliderRef.current?.slickNext();

  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold text-black mb-3 sm:mb-4">
            {content.mainHeading}
          </h2>

          <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal text-[#263238] max-w-4xl mx-auto px-4 sm:px-0">
            {content.description}
          </p>
        </div>

        {/* Expert Slider */}
        <div className="relative">
          <Slider ref={sliderRef} {...settings}>
            {content.slider.map((expert, index) => (
              <div key={index} className="px-5 h-full">
                <div
                  className="bg-white p-[21px] flex flex-col justify-center items-center rounded-lg h-full min-h-[500px]"
                  style={{
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  }}
                >
                  <Image src={expert.img} alt="" className="mb-5" />
                  <p className="text-[28px] font-bold text-black text-center">
                    {expert.expertName}
                  </p>
                  <p className="text-[10px] italic text-center mb-5">
                    {expert.designation}
                  </p>
                  <p className="text-[15px] text-center text-[#263238] flex-1">
                    {expert.description}
                  </p>
                </div>
              </div>
            ))}
          </Slider>

          {/* Navigation Arrows */}
          <div className="w-[225px] mx-auto flex justify-around mt-[5px] relative z-[9]">
            <ChevronLeft
              size={20}
              className="cursor-pointer"
              onClick={goPrev}
            />
            <ChevronRight
              size={20}
              className="cursor-pointer"
              onClick={goNext}
            />
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .carousel-card.center-card {
          background: #4744c9;
          z-index: 20;
          border: 1px solid #e2e2e2;
        }
        .carousel-card:not(.center-card):hover {
          background: #4744c9;
          transform: scale(1.1);
          z-index: 15;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .slick-dots li {
          width: 20px !important;
        }
        .carousel-card:not(.center-card):hover h3,
        .carousel-card:not(.center-card):hover p {
          color: #fff;
        }
      `}</style>
    </section>
  );
};

export default ExpertSection;
