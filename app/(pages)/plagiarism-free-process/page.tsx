import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import { plagiarismFreeContent } from "./content";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import OriginalSection from "@/app/components/OtherLandingPages/PlagriarismFree/OriginalSection";

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

    // Query for plagiarism-free-process page by id
    const query = {
      id: "plagiarism-free-process"
    };

    const content = await db.collection('pages').findOne(query);

    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching plagiarism-free-process data:', error);
    return null;
  }
}

const Home: NextPage = async () => {
  const pageData = await fetchPageData();

  // Use MongoDB data if available, otherwise fallback to static content
  const heroContent = pageData?.heroSection || plagiarismFreeContent.heroContent;

  // Merge originalityContent - keep static images from Content
  const originalityContent = pageData?.originalityContent
    ? {
      ...pageData.originalityContent,
      steps: pageData.originalityContent.steps?.map((step: any, index: number) => ({
        ...step,
        img: plagiarismFreeContent.originalityContent.steps[index]?.img || step.img // Use static image if available
      })) || plagiarismFreeContent.originalityContent.steps,
      tags: pageData.originalityContent.tags || plagiarismFreeContent.originalityContent.tags
    }
    : plagiarismFreeContent.originalityContent;

  const whyScholarlySlider = pageData?.whyScholarlySlider || plagiarismFreeContent.whyScholalrySlider;
  const academicPartners = pageData?.academicPartners || undefined;

  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={heroContent} />
        <OriginalSection content={originalityContent} />
        <div className="w-full bg-[#565ADD] py-14 px-4 mb-24">
          <p className="md:text-[35px] sm:text-[28px] text-[24px] text-white text-center font-bold">
            Your Trust Our Commitment
          </p>
          <p className="text-[17px] text-white text-center font-normal mb-5">
            We protect your academic integrity with a process designed to
            deliver original, high-quality work every time.
          </p>
        </div>
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
  const canonicalUrl = `${baseUrl}plagiarism-free-process`;

  return {
    title: pageData?.meta?.title || "Plagiarism-Free Academic Work | Original & Verified Content",
    description: pageData?.meta?.description || "Get authentic, plagiarism-free academic work created from scratch. Our verified process ensures originality, accuracy, and trusted quality every time.",
    alternates: {
      canonical: pageData?.meta?.canonicalUrl || canonicalUrl,
    },
  };
}
