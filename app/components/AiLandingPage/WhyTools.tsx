import Image from "next/image";
import { FC } from "react";
import BlueCheckIcon from "@/app/assets/Icons/blueCheck.png";

interface WhyToolsProps {
  whyToolsContent: {
    heading: string;
    qualities: {
      title: string;
      description: string;
    }[];
  };
}

const WhyTools: FC<WhyToolsProps> = ({ whyToolsContent }) => {
  return (
    <section className="w-full bg-[#565ADD] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
      <div className="mb-8 sm:mb-14 md:mb-16 max-w-7xl mx-auto text-white">
        <h2 className="text-center text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold mb-3 sm:mb-7 leading-[60px]">
          {whyToolsContent.heading}
        </h2>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-10 gap-5 md:mt-20 mt-10">
          {whyToolsContent.qualities.map((item, index) => (
            <div key={index} className="col-span-1 flex items-start gap-8">
              <Image
                src={BlueCheckIcon}
                alt=""
                className="max-w-[70px] min-w-[40px] h-auto"
              />
              <div>
                <p className="text-[30px] text-white font-bold">{item.title}</p>
                <p className="text-[17px] text-white font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTools;
