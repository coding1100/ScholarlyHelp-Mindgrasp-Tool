import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import { Content } from "./content";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import Success from "@/app/components/LandingPage/Success";
import FeaturedStories from "@/app/components/OtherLandingPages/SuccessStories/FeaturedStories";
import TrustSection from "@/app/components/OtherLandingPages/UsExpert/TrustedSection";

const Home: NextPage = () => {
  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={Content.heroContent} />
        <div className="bg-white py-20">
          <div className="max-w-[835px] mx-auto text-center">
            <h2 className="text-black lg:text-[50px] [992px]:text-[42px] md:text-[30px] sm:text-[28px] text-[24px] lg:leading-[60px] [992px]:leading-[52px] leading-[42px] font-bold mb-5">
              What Students Say
              <br />
              About Scholarly Help
            </h2>
            <p className="text-[19px] text-black font-semibold mb-5">
              Honest feedback from students who trust our academic support.
            </p>
            <p className="text-[17px] text-[#263238] font-normal">
              These stories reflect the impact of our work, from improved grades
              to stress-free submissions and reliable academic support. Every
              review highlights our dedication to quality, confidentiality, and
              timely assistance, showing how students succeed with a partner
              they can trust.
            </p>
          </div>
        </div>
        <Success content={Content.successLookLike} />
        <FeaturedStories content={Content.featuredStories} />
        <TrustSection content={Content.supportContent} />

        <WhySlider whyData={Content.whyScholalrySlider} />
        <CustomerReviews />
        <AcademicPartners content={Content.academicPartners} />

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
    title: "Success Stories & Reviews | Student Results & Experiences",
    description:
      "Explore real success stories from students who achieved better grades and confidence with our support. Honest reviews that reflect trust, quality, and results.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
