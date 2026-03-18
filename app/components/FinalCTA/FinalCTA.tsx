import { FC } from "react";

interface FinalCTAProps {}

const FinalCTA: FC<FinalCTAProps> = ({}) => {
  return (
    <div className="bg-[#3C3D5D] py-12">
      <div className="mx-auto max-w-7xl grid grid-cols-12">
        <div className="col-span-6">
          <p className="text-white lg:text-[42px] md:text-3xl sm:text-xl text-lg font-bold leading-[1.1]">
            Pass Your{" "}
            <span className="bg-[#5A5BE0] rounded-full px-4 py-1 -rotate-3 inline-block font-semibold">
              Chemistry
            </span>{" "}
            Class Without Burning Out.
          </p>
          <p className="sm:text-lg text-base text-white">
            You get a Guaranteed 'A' or 'B', 100% Domestic Logins, and 24/7
            Support. Don't let Chemistry class ruin your GPA
          </p>
        </div>
        <div className="col-span-5"></div>
      </div>
    </div>
  );
};

export default FinalCTA;
