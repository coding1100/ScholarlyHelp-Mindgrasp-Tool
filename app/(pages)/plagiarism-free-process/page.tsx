import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import { plagiarismFreeContent } from "./content";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import PrivacySection from "@/app/components/OtherLandingPages/Guarantee/PrivacySection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import OriginalSection from "@/app/components/OtherLandingPages/PlagriarismFree/OriginalSection";

const Home: NextPage = () => {
  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={plagiarismFreeContent.heroContent} />
        <OriginalSection />
        <div className="w-full bg-[#565ADD] py-14 px-4 mb-24">
          <p className="text-[35px] text-white text-center font-bold">
            Your Trust Our Commitment
          </p>
          <p className="text-[17px] text-white text-center font-normal">
            We protect your academic integrity with a process designed to
            deliver original, high-quality work every time.
          </p>
        </div>
        <div className="bg-linear-to-b from-white via-[#ECECFC] to-white">
          <WhySlider whyData={plagiarismFreeContent.whyScholalrySlider} />
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
    title: "Plagiarism-Free Academic Work | Original & Verified Content",
    description:
      "Get authentic, plagiarism-free academic work created from scratch. Our verified process ensures originality, accuracy, and trusted quality every time.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
