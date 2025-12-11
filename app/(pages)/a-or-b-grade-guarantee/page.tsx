import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import { Content } from "./content";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import ChooseExpert from "@/app/components/OtherLandingPages/UsExpert/ChooseExpert";
import WhyGuarantee from "@/app/components/OtherLandingPages/GradeGuarantee/WhyGuarantee";
import GuaranteeCovers from "@/app/components/OtherLandingPages/GradeGuarantee/GuaranteeCovers";
import HowWorks from "@/app/components/OtherLandingPages/GradeGuarantee/HowWorks";

const Home: NextPage = () => {
  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={Content.heroContent} />
        <WhyGuarantee content={Content.whyGuaranteeContent} />
        <GuaranteeCovers content={Content.guaranteeCoversContent} />
        <HowWorks content={Content.howWorksContent} />
        <ChooseExpert content={Content.guarantee} />
        <div className="bg-linear-to-b from-white via-[#ECECFC] to-white">
          <WhySlider whyData={Content.whyScholalrySlider} />
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
    title: "US-Based PhD Experts | Trusted Academic Support Online",
    description:
      "Connect with verified US-based PhD scholars for reliable academic support. Expert guidance you can trust across multiple subjects and tasks.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
