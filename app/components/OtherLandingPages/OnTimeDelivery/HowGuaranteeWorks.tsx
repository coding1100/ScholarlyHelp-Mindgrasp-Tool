import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import HowGuaranteeWorksImg from "@/app/assets/Images/howGuaranteeBg.png";

interface HowGuaranteeWorksProps {
  content: {
    mainHeading: string;
    steps: {
      title: string;
      description: string;
    }[];
  };
}

const HowGuaranteeWorks: FC<HowGuaranteeWorksProps> = ({ content }) => {
  const getNumberColor = (index: number): string => {
    const colors = ["#BBD4F3", "#B4DBD7", "#C7DCAA", "#F6E495"];
    return colors[index] || colors[0];
  };

  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .how-guarantee-bg {
            background-image: none;
          }
          @media (min-width: 1024px) {
            .how-guarantee-bg {
              background-image: url(${HowGuaranteeWorksImg.src});
              background-position: center;
              background-size: cover;
              background-repeat: no-repeat;
            }
          }
        `,
        }}
      />
      <div className="max-w-7xl mx-auto text-center">
        {/* Header Section */}
        <h2 className="text-[28px] text-black sm:text-[36px] sm:leading-[45px] md:text-[42px] font-bold mb-4 sm:mb-7 md:mb-16">
          {content.mainHeading}
        </h2>
        <div className="how-guarantee-bg grid grid-cols-1 lg:grid-cols-11 w-full text-start">
          {content.steps.map((item, index) => (
            <div key={index} className="col-span-1 lg:col-span-6">
              {index % 2 === 0 ? (
                <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
                  <p
                    className="text-[60px] sm:text-[80px] md:text-[103px] leading-[60px] sm:leading-[80px] md:leading-[103px] font-semibold"
                    style={{ color: getNumberColor(index) }}
                  >
                    {index + 1}
                  </p>
                  <div className="flex-1">
                    <p className="text-[24px] sm:text-[28px] md:text-[30px] leading-[28px] sm:leading-[32px] md:leading-[35px] font-bold text-black mb-2 sm:mb-3">
                      {item.title}
                    </p>
                    <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#263238]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className=" md:max-w-[628px] flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 md:ml-auto mb-8 sm:mb-10 md:mb-12">
                  <p
                    className="text-[60px] sm:text-[80px] md:text-[103px] leading-[60px] sm:leading-[80px] md:leading-[103px] font-semibold"
                    style={{ color: getNumberColor(index) }}
                  >
                    {index + 1}
                  </p>
                  <div className="flex-1">
                    <p className="text-[24px] sm:text-[28px] md:text-[30px] leading-[28px] sm:leading-[32px] md:leading-[35px] font-bold text-black mb-2 sm:mb-3">
                      {item.title}
                    </p>
                    <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#263238]">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowGuaranteeWorks;
