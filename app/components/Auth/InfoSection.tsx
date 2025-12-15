import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";

const Guarantee = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-end gap-3">
    <span className="text-[#5e49b4] text-4xl">{icon}</span>
    <span className="text-black font-medium">{text}</span>
  </div>
);

const InfoSection = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-8 px-4 md:px-8 lg:px-12">
      <h1 className="text-2xl md:text-5xl font-extrabold text-[#2B1C50] leading-tight">
        Leading Academic Writing Services
      </h1>
      <p className="text-lg text-[#3D2E7C]">
        Our service guarantees not only top-notch quality but also 100%
        uniqueness of the delivered papers! Be assured to get a{" "}
        <strong className="font-bold">Turnitin-safe</strong> paper written by
        verified experts.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-4 ">
        <Guarantee icon={<FaShieldAlt />} text="100% confidential" />
        <Guarantee icon={<MdBlock />} text="No spam" />
        <Guarantee
          icon={<IoDocumentTextOutline />}
          text="Plagiarism Free Work"
        />
        <Guarantee icon={<FaCheckCircle />} text="Money Back Guarantee" />
      </div>
    </div>
  );
};

export default InfoSection;
