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
    
    // Query for on-time-delivery-guarantee page by id
    const query = { 
      id: "on-time-delivery-guarantee"
    };
    
    const content = await db.collection('pages').findOne(query);
    
    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching on-time-delivery-guarantee data:', error);
    return null;
  }
}

const Home: NextPage = async () => {
  const pageData = await fetchPageData();

  // Use MongoDB data if available, otherwise fallback to static content
  const heroContent = pageData?.heroSection || Content.heroContent;
  const whyGuarantee = pageData?.whyGuarantee || Content.whyGuarantee;
  const whyGuaranteeContent = pageData?.whyGuaranteeContent || Content.whyGuaranteeContent;
  const HowGuaranteeWorks = pageData?.HowGuaranteeWorks || Content.HowGuaranteeWorks;
  const whyScholarlySlider = pageData?.whyScholarlySlider || Content.whyScholalrySlider;
  const academicPartners = pageData?.academicPartners || Content.academicPartners;
  const faq = pageData?.faq || Content.faq;

  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={heroContent} />
        <WhyGuaranteeMatters content={whyGuarantee} />
        <WhyGuarantee content={whyGuaranteeContent} />
        <HowGuaranteeWorks content={HowGuaranteeWorks} />
        <div className="bg-linear-to-b from-white via-[#ECECFC] to-white">
          <WhySlider whyData={whyScholarlySlider} />
        </div>
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
  const canonicalUrl = `${baseUrl}on-time-delivery-guarantee`;
  
  return {
    title: pageData?.meta?.title || "On-Time Delivery Guarantee | Fast, Reliable Academic Support",
    description: pageData?.meta?.description || "Receive your work on schedule with our On-Time Delivery Guarantee. We ensure fast, dependable, and stress-free academic support for every task.",
    alternates: {
      canonical: pageData?.meta?.canonicalUrl || canonicalUrl,
    },
  };
}
