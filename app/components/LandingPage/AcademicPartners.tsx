"use client";

import Image from "next/image";
import { useAssignmentData } from "@/app/(pages)/assignment/AssignmentDataProvider";
import { useMemo } from "react";

export default function AcademicPartners() {
  const data = useAssignmentData();
  const academicPartners = data?.academicPartners;
  
  const scrollToQuote = () => {
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      quoteForm.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const defaultCards = [
    { id: 1, title: "Confidential partner", description: "Tired of complex homework? We handle it quickly and accurately. Get real-time help on classes that saves time and gets results." },
    { id: 2, title: "Founded by Students", description: "Our CEO worked 30-hour shifts while enrolled full-time and was on the verge of expulsion twice due to academic pressure. We get it — we're solving the system that punishes people with real lives." },
    { id: 3, title: "40+ Master's Level Tutors", description: "Every tutor is hand-selected through a 7-stage vetting process (only 3% of applicants make it)." },
    { id: 4, title: "2,100+ Courses Completed", description: "No time to study for the exam? Our experts take your exams for you, just like you're sitting there — with results that speak for themselves." },
    { id: 5, title: "100% Confidentiality Guarantee", description: "Failing behind on assignments? Let us step in. When you ask us to do my online class for me, we make sure your coursework gets done right — and on time." }
  ];
  
  const cards = useMemo(() => {
    if (academicPartners?.cards && Array.isArray(academicPartners.cards) && academicPartners.cards.length > 0) {
      return academicPartners.cards;
    }
    return defaultCards;
  }, [academicPartners]);

  return (
    <section className="pt-[90px] pb-[90px] px-4 bg-gradient-to-b from-white w-full to-gray-50 ">
      <div className="max-w-7xl mx-auto flex max-[1450px]:flex-col max-[1320px]:px-8">
        {/* Hero Section */}
        <div className="text-left mb-12 w-[40%] max-[1450px]:w-[100%]">
          <h3 className="sm:text-4xl text-[32px] md:text-5xl sm:font-bold font-semibold text-gray-900 mb-4">
            {academicPartners?.mainHeading || "Your Academic Partners for Success"}
          </h3>
          <p className="sm:text-lg text-sm text-gray-600 max-w-3xl mb-8">
            {academicPartners?.description || "From exams and essays to full-class management, we handle it all so you don't have to."}
          </p>
          <div className="flex sm:justify-start justify-center mt-[30px]">
            <button
              type="button"
              onClick={scrollToQuote}
              className="rounded-md px-3 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] md:w-64 w-52"
            >
              {academicPartners?.ctaButton?.text || "Take my online class"}
            </button>
          </div>
        </div>
        {/* Feature Cards */}
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-[60%] relative min-h-[600px] mb-[120px] max-[1450px]:w-[100%] max-[1450px]:mb-[0px]">
          <Image
            src="/assets/Icon/card-line.svg"
            alt="Confidential partner"
            width={800}
            height={800}
            className="absolute top-[135px] left-[-100px] w-[120%] max-w-none max-[1450px]:hidden"
          />

          {/* Cards from MongoDB */}
          {cards.map((card, index) => {
            const rotations = [3, -9, 6, -6, 0];
            const positions = [
              { top: 30, left: 54 },
              { top: 2, right: 80 },
              { top: 180, left: -186, bottom: -110 },
              { top: undefined, bottom: -120, left: 165 },
              { top: undefined, bottom: -100, right: -45 }
            ];
            const bgColors = ['#FEF6D3', '#ECF5DF', '#F5E2FE', '#CFE4FF', '#DDF3F1'];
            const imagePaths = [
              '/assets/Icon/img-card-1.png',
              '/assets/Icon/img-card-2.png',
              '/assets/Icon/img-card-3.png',
              '/assets/Icon/img-card-4.png',
              '/assets/Icon/img-card-5.png'
            ];
            
            const rotation = rotations[index % rotations.length];
            const position = positions[index % positions.length];
            const bgColor = bgColors[index % bgColors.length];
            const imagePath = imagePaths[index % imagePaths.length];
            
            return (
              <div 
                key={card.id || index}
                className="p-6 py-7 border-yellow-200 shadow-md hover:shadow-xl transition-shadow rounded-[21px] min-h-[310px] w-[289px] absolute z-[9] max-[1450px]:[position:unset] max-[1450px]:rotate-[0deg] max-[1450px]:min-h-fit max-[1450px]:w-full"
                style={{
                  backgroundColor: bgColor,
                  transform: `rotate(${rotation}deg)`,
                  ...(position.top !== undefined && { top: `${position.top}px` }),
                  ...(position.left !== undefined && { left: `${position.left}px` }),
                  ...(position.right !== undefined && { right: `${position.right}px` }),
                  ...(position.bottom !== undefined && { bottom: `${position.bottom}px` })
                }}
              >
                <div className="flex items-start space-x-4 flex-col">
                  <div className="flex-shrink-0 mb-4">
                    <Image
                      src={imagePath}
                      alt={card.title || ''}
                      width={52}
                      height={52}
                      className="object-contain"
                      style={{ transform: `rotate(${-rotation}deg)` }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-4 font-poppins sm:text-2xl text-xl leading-[1.2] tracking-normal font-poppins">
                      {card.title || ''}
                    </h3>
                    <p className="text-sm text-gray-600 font-poppins font-normal text-[15px] leading-[1.4] tracking-normal">
                      {card.description || ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
