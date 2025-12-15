import Image, { StaticImageData } from "next/image";
import { FC } from "react";

interface FeaturedStoriesProps {
  content: {
    heading: string;
    stories: {
      image: StaticImageData;
      title: string;
      name: string;
      designation: string;
      description: string;
    }[];
  };
}

const FeaturedStories: FC<FeaturedStoriesProps> = ({ content }) => {
  return (
    <section className="pt-9 pb-20 px-5 overflow-hidden bg-white text-[#171717]">
      <div className="max-w-7xl mx-auto">
        <div className="py-10 ">
          <h2 className="lg:text-[42px] md:text-[28px] sm:text-[24px] text-[20px] lg:mb-[20px] mb-[10px] text-[#000] font-bold text-center">
            {content.heading}
          </h2>
        </div>
        {content.stories.map((story, index) => (
          <div
            className="grid md:grid-cols-2 grid-cols-1 gap-5 max-w-[955px] mx-auto mb-20"
            key={index}
          >
            {index % 2 === 0 ? (
              <>
                <div className="order-1 ">
                  <Image src={story.image} alt="Featured Stories" />
                </div>
                <div className="col-span-1 order-2">
                  <p className="lg:text-[35px] md:text-[28px] sm:text-[24px] text-[20px] lg:leading-[40px] leading-[32px] font-bold text-black mb-3">
                    {story.title}
                  </p>
                  <p className="text-xl font-bold text-black">{story.name}</p>
                  <p className="text-[13px] text-[#263238]">
                    {story.designation}
                  </p>
                  <p className="mt-5 text-[17px] text-[#263238]">
                    {story.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-1 md:order-1 order-2">
                  <p className="lg:text-[35px] md:text-[28px] sm:text-[24px] text-[20px] lg:leading-[40px] leading-[32px] font-bold text-black mb-3">
                    {story.title}
                  </p>
                  <p className="text-xl font-bold text-black">{story.name}</p>
                  <p className="text-[13px] text-[#263238]">
                    {story.designation}
                  </p>
                  <p className="mt-5 text-[17px] text-[#263238]">
                    {story.description}
                  </p>
                </div>
                <div className="md:order-2 order-1">
                  <Image src={story.image} alt="Featured Stories" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedStories;
