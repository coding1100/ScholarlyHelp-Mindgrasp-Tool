import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import { Content } from "./content";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import PrivacySection from "@/app/components/OtherLandingPages/Guarantee/PrivacySection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import OriginalSection from "@/app/components/OtherLandingPages/PlagriarismFree/OriginalSection";
import TrustSection from "@/app/components/OtherLandingPages/UsExpert/TrustedSection";
import ExpertSection from "@/app/components/OtherLandingPages/UsExpert/ExpertSection";
import ChooseExpert from "@/app/components/OtherLandingPages/UsExpert/ChooseExpert";

const Home: NextPage = () => {
  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={Content.heroContent} />
        <TrustSection />
        <ExpertSection />
        <ChooseExpert />
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
