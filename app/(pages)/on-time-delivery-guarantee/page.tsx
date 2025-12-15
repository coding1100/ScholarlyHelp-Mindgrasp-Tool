import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import { Content } from "./content";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import WhyGuaranteeMatters from "@/app/components/OtherLandingPages/OnTimeDelivery/WhyGuaranteeMatters";
import WhyGuarantee from "@/app/components/OtherLandingPages/GradeGuarantee/WhyGuarantee";
import HowGuaranteeWorks from "@/app/components/OtherLandingPages/OnTimeDelivery/HowGuaranteeWorks";

const Home: NextPage = () => {
  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={Content.heroContent} />
        <WhyGuaranteeMatters content={Content.whyGuarantee} />
        <WhyGuarantee content={Content.whyGuaranteeContent} />
        <HowGuaranteeWorks content={Content.HowGuaranteeWorks} />
        <div className="bg-linear-to-b from-white via-[#ECECFC] to-white">
          <WhySlider whyData={Content.whyScholalrySlider} />
        </div>
        <CustomerReviews />
        <AcademicPartners content={Content.academicPartners} />

        <Faq content={Content.faq} />
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
    title: "On-Time Delivery Guarantee | Fast, Reliable Academic Support",
    description:
      "Receive your work on schedule with our On-Time Delivery Guarantee. We ensure fast, dependable, and stress-free academic support for every task.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
