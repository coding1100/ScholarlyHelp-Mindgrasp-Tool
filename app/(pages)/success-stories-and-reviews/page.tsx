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

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchPageData() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('Database URL not configured');
      return null;
    }

    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 1,
      readPreference: 'primary',
    });
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Query for success-stories-and-reviews page by id
    const query = { 
      id: "success-stories-and-reviews"
    };
    
    const content = await db.collection('pages').findOne(query);
    
    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching success-stories-and-reviews data:', error);
    return null;
  }
}

const Home: NextPage = async () => {
  const pageData = await fetchPageData();

  // Use MongoDB data if available, otherwise fallback to static content
  const heroContent = pageData?.heroSection || Content.heroContent;
  const successLookLike = pageData?.successLookLike || Content.successLookLike;
  const featuredStories = pageData?.featuredStories || Content.featuredStories;
  const supportContent = pageData?.supportContent || Content.supportContent;
  const whyScholarlySlider = pageData?.whyScholarlySlider || Content.whyScholalrySlider;
  const academicPartners = pageData?.academicPartners || Content.academicPartners;
  const faq = pageData?.faq || Content.faq;

  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={heroContent} />
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
        <Success content={successLookLike} />
        <FeaturedStories content={featuredStories} />
        <TrustSection content={supportContent} />
        <WhySlider whyData={whyScholarlySlider} />
        <CustomerReviews />
        <AcademicPartners content={academicPartners} />
        <Faq content={faq} />
      </MainLayout>
    </div>
  );
};

export default Home;

export async function generateMetadata() {
  const pageData = await fetchPageData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}success-stories-and-reviews`;
  
  return {
    title: pageData?.meta?.title || "Success Stories & Reviews | Student Results & Experiences",
    description: pageData?.meta?.description || "Explore real success stories from students who achieved better grades and confidence with our support. Honest reviews that reflect trust, quality, and results.",
    alternates: {
      canonical: pageData?.meta?.canonicalUrl || canonicalUrl,
    },
  };
}
