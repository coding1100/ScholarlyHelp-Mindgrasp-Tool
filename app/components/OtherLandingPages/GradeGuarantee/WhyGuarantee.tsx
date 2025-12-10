import Image, { StaticImageData } from "next/image";
import { FC } from "react";

interface WhyGuaranteeProps {
  content: {
    mainHeading: string;
    description: string;
    details: {
      imge: StaticImageData;
      title: string;
      description: string;
    };
  };
}

const WhyGuarantee: FC<WhyGuaranteeProps> = ({ content }) => {
  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 mb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-[907px] mx-auto">
          <h2 className="text-[28px] text-black sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold mb-3 sm:mb-4">
            {content.mainHeading}
          </h2>
          <p className="text-[#263238] text-[14px] sm:text-[15px] md:text-[16px] font-normal  max-w-4xl mx-auto px-4 sm:px-0">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <Image src={content.details.imge} alt={content.details.title} />
          <div>
            <p
              className="text-[40px] leading-[48px] text-black font-bold mb-7"
              dangerouslySetInnerHTML={{ __html: content.details.title }}
            />
            <p className="text-[17px] text-[#263238]">
              {content.details.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGuarantee;
