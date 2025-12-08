import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import { guaranteeAnonymityContent } from "./content";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import PrivacySection from "@/app/components/OtherLandingPages/Guarantee/PrivacySection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";

const Home: NextPage = () => {
  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={guaranteeAnonymityContent.heroContent} />
        <PrivacySection />
        <div className="bg-linear-to-b from-white via-[#ECECFC] to-white">
          <WhySlider whyData={guaranteeAnonymityContent.whyScholalrySlider} />
          <div className="flex justify-center mt-[60px]">
            <button
              type="button"
              className="rounded-md px-3 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] md:w-64 w-48"
            >
              Take my online class
            </button>
          </div>
        </div>
        <CustomerReviews />
        <AcademicPartners />

        <Faq />
      </MainLayout>
    </div>
  );
};

export default Home;

export function generateMetadata({}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}`;
  return {
    title: "100% Anonymity Guaranteed | Secure & Confidential Help",
    description:
      "Experience fully private, secure, and confidential academic support. Your identity stays protected with strict privacy measures at every step.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
