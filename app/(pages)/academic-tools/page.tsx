import { FC } from "react";
import { MetaData } from "@/app/metadata/metadata";
import MainLayout from "@/app/MainLayout";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import { MainAiLanding } from "@/app/components/AiLandingPage/AiContent";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicTools from "@/app/components/AiLandingPage/AcademicTools";
import WhyTools from "@/app/components/AiLandingPage/WhyTools";

interface PageProps {}
const Page: FC<PageProps> = ({}) => {
  // return <div>test</div>
  return (
    <MainLayout>
      <HeroSection heroContent={MainAiLanding.heroContent} />
      <AcademicTools content={MainAiLanding.academicTools} />
      <WhyTools whyToolsContent={MainAiLanding.whyTools} />
      <WhySlider whyData={MainAiLanding.whyScholalrySlider} />
      <CustomerReviews />
      <AcademicPartners />

      <Faq />
    </MainLayout>
  );
};
export default Page;

export function generateMetadata({}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}${MetaData.aboutUs.url}`;
  return {
    title: `${MetaData.aboutUs.title}`,
    description: `${MetaData.aboutUs.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
