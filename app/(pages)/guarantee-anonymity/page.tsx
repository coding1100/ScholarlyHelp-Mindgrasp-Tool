import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import { guaranteeAnonymityContent } from "./content";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import PrivacySection from "@/app/components/OtherLandingPages/Guarantee/PrivacySection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";

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

    // Query for guarantee-anonymity page by id
    const query = {
      id: "guarantee-anonymity"
    };

    const content = await db.collection('pages').findOne(query);

    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching guarantee-anonymity data:', error);
    return null;
  }
}

const Home: NextPage = async () => {
  const pageData = await fetchPageData();

  // Use MongoDB data if available, otherwise fallback to static content
  const heroContent = pageData?.heroSection
    ? { ...pageData.heroSection, formBackImg2: guaranteeAnonymityContent.heroContent.formBackImg2 }
    : guaranteeAnonymityContent.heroContent;

  // Merge privacyContent - keep static images from Content
  const privacyContent = pageData?.privacyContent
    ? {
      ...pageData.privacyContent,
      steps: pageData.privacyContent.steps?.map((step: any, index: number) => ({
        ...step,
        img: guaranteeAnonymityContent.privacyContent.steps[index]?.img || step.img // Use static image if available
      })) || guaranteeAnonymityContent.privacyContent.steps
    }
    : guaranteeAnonymityContent.privacyContent;

  const whyScholarlySlider = pageData?.whyScholarlySlider || guaranteeAnonymityContent.whyScholalrySlider;
  const academicPartners = pageData?.academicPartners || undefined;

  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={heroContent} />
        <PrivacySection content={privacyContent} />
        <div className="bg-linear-to-b from-white via-[#ECECFC] to-white">
          <WhySlider whyData={whyScholarlySlider} />
        </div>
        <CustomerReviews />
        <AcademicPartners content={academicPartners} />
        <Faq />
      </MainLayout>
    </div>
  );
};

export default Home;

export async function generateMetadata() {
  const pageData = await fetchPageData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}guarantee-anonymity`;

  return {
    title: pageData?.meta?.title || "100% Anonymity Guaranteed | Secure & Confidential Help",
    description: pageData?.meta?.description || "Experience fully private, secure, and confidential academic support. Your identity stays protected with strict privacy measures at every step.",
    alternates: {
      canonical: pageData?.meta?.canonicalUrl || canonicalUrl,
    },
  };
}
