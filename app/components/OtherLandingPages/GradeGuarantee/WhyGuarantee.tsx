import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import RoundCheckIcon from "@/app/assets/Icons/roundCheck.png";

interface WhyGuaranteeProps {
  content: {
    mainHeading?: string;
    description?: string;
    details: {
      imge: StaticImageData;
      title: string;
      description: string;
      list?: string[];
      text?: string;
    };
  };
}

const WhyGuarantee: FC<WhyGuaranteeProps> = ({ content }) => {
  return (
    <section className="w-full bg-white px-4 sm:px-6 md:px-8 pt-20 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        {content.mainHeading && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-[907px] mx-auto">
            <h2 className="text-[28px] text-black sm:text-[36px] md:text-[42px] md:leading-[50px] lg:text-[50px] lg:leading-[60px] font-bold mb-3 sm:mb-4">
              {content.mainHeading}
            </h2>
            {content.description && (
              <p className="text-[#263238] text-[14px] sm:text-[15px] md:text-[16px] font-normal  max-w-4xl mx-auto px-4 sm:px-0">
                {content.description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <Image src={content.details.imge} alt={content.details.title} />
          <div>
            <p
              className="lg:text-[40px] text-[30px] lg:leading-[48px] leading-[38px] text-black lg:font-bold font-semibold mb-7"
              dangerouslySetInnerHTML={{ __html: content.details.title }}
            />
            <p className="text-[17px] text-[#263238]">
              {content.details.description}
            </p>
            {content.details.list && (
              <div className="my-7">
                {content.details.list.map((item, i) => (
                  <div key={i} className="flex items-start gap-6 mb-5">
                    <Image
                      src={RoundCheckIcon}
                      alt="icon"
                      width={26}
                      height={24}
                    />
                    <p className="text-[17px] font-bold text-[#263238]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {content.details.text && (
              <p className="text-[17px] text-[#263238]">
                {content.details.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGuarantee;
