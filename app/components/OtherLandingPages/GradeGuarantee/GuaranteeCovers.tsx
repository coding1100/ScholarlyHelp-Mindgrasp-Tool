import Image, { StaticImageData } from "next/image";
import { FC } from "react";

interface GuaranteeCoversProps {
  content: {
    mainHeading: string;
    subHeading: string;
    description: string;
    items: {
      icon: StaticImageData;
      title: string;
      description: string;
    }[];
  };
}

const GuaranteeCovers: FC<GuaranteeCoversProps> = ({ content }) => {
  return (
    <section className="w-full bg-[#8173D1] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[28px] text-white sm:text-[36px] md:text-[40px] font-bold mb-3 sm:mb-4">
          {content.mainHeading}
        </h2>
        <p className="text-white text-[16px] sm:text-[17px] md:text-[19px] font-semibold  max-w-4xl mx-auto px-4 sm:px-0">
          {content.subHeading}
        </p>
        <p className="text-white text-[14px] sm:text-[15px] md:text-[16px] font-normal  max-w-4xl mx-auto px-4 sm:px-0">
          {content.description}
        </p>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7 mt-14 text-start">
          {content.items.map((item, index) => (
            <div key={index} className="col-span-1 text-white">
              <Image
                src={item.icon}
                alt={item.title}
                className="lg:mb-11 md:mb-8 mb-5 w-auto lg:h-[94px] md:h-[64px] h-[50px]"
              />
              <p className="lg:text-[30px] md:text-[24px] text-[20px] lg:font-bold font-semibold lg:leading-[35px] md:leading-[28px] leading-[24px] mb-5">
                {item.title}
              </p>
              <p className="md:text-[17px] text-[15px] font-normal ">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuaranteeCovers;
