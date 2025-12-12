import Image, { StaticImageData } from "next/image";
import { FC } from "react";

interface HowWorksProps {
  content: {
    mainHeading: string;
    description: string;
    steps: {
      img: StaticImageData;
      title: string;
      description: string;
    }[];
  };
}

const HowWorks: FC<HowWorksProps> = ({ content }) => {
  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-[907px] mx-auto">
          <h2 className="text-[28px] text-black sm:text-[36px] md:text-[42px] font-bold mb-3 sm:mb-4">
            {content.mainHeading}
          </h2>
          <p className="text-[#263238] text-[14px] sm:text-[15px] md:text-[16px] font-normal  max-w-4xl mx-auto px-4 sm:px-0">
            {content.description}
          </p>
        </div>

        {content.steps.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-2 gap-5 items-center max-w-4xl mx-auto${
              index === content.steps.length - 1 ? "" : " mb-20"
            }`}
          >
            {index % 2 === 0 ? (
              <>
                <div className="order-2 md:order-1">
                  <Image src={item.img} alt={item.title} />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-[30px] leading-[34px] text-black font-bold mb-4">
                    {item.title}
                  </p>
                  <p className="text-[17px] text-[#263238]">
                    {item.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="order-2 md:order-2">
                  <Image src={item.img} alt={item.title} />
                </div>
                <div className="order-1 md:order-1">
                  <p className="text-[30px] leading-[34px] text-black font-bold mb-4">
                    {item.title}
                  </p>
                  <p className="text-[17px] text-[#263238]">
                    {item.description}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowWorks;
