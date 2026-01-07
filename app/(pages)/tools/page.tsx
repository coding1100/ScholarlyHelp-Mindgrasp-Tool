import MainLayout from "@/app/MainLayout";
import type { NextPage } from "next";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import Faq from "@/app/components/LandingPage/Faq";
import AcademicTools from "@/app/components/AiLandingPage/AcademicTools";
import WhyTools from "@/app/components/AiLandingPage/WhyTools";
import { MainAiLanding } from "@/app/components/AiLandingPage/AiContent";

import clientPromise from "@/app/lib/mongodb";
import { Metadata } from "next";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchPageData() {
  try {
    const client = await clientPromise;
    const db = client.db('scholarly_help');

    // Query for academic-tools page by id (using existing MongoDB data)
    // Try exact match first
    let content = await db.collection('pages').findOne({ id: "academic-tools" });

    // If not found, try with regex to handle potential whitespace or trailing characters
    if (!content) {
      content = await db.collection('pages').findOne({
        id: { $regex: /^academic-tools/i }
      });
    }

    // If still not found, try pageType
    if (!content) {
      content = await db.collection('pages').findOne({ pageType: "academic-tools" });
    }

    if (!content) {
      console.log('No content found for academic-tools in pages collection');
      // Debug: Check what documents exist in pages collection
      const allPages = await db.collection('pages').find({}).limit(10).toArray();
      console.log('Available page IDs in pages collection:', allPages.map(p => ({ id: p.id, pageType: p.pageType })));
    } else {
      console.log('Successfully fetched academic-tools data from MongoDB');
      console.log('Content keys:', Object.keys(content));
      console.log('Content id:', content.id);
      console.log('Content pageType:', content.pageType);
    }



    return content as any;
  } catch (error) {
    console.error('Error fetching academic-tools data:', error);
    return null;
  }
}

const Page: NextPage = async () => {
  const pageData = await fetchPageData();

  // Use MongoDB data if available, otherwise fallback to static content
  const heroContent = pageData?.heroSection
    ? { ...pageData.heroSection, formBackImg2: MainAiLanding.heroContent.formBackImg2 }
    : MainAiLanding.heroContent;
  const academicTools = pageData?.academicTools || MainAiLanding.academicTools;
  const whyTools = pageData?.whyTools || MainAiLanding.whyTools;

  // Merge whyScholarlySlider - keep static icons from MainAiLanding
  // Note: JSON uses whyScholalrySlider (with typo) to match static content
  const whyScholarlySlider = pageData?.whyScholalrySlider || pageData?.whyScholarlySlider
    ? {
      ...(pageData?.whyScholalrySlider || pageData?.whyScholarlySlider),
      sliderItems: (pageData?.whyScholalrySlider?.sliderItems || pageData?.whyScholarlySlider?.sliderItems || []).map((item: any, index: number) => ({
        ...item,
        icon: MainAiLanding.whyScholalrySlider.sliderItems[index]?.icon || item.icon // Use static icon if available
      }))
    }
    : MainAiLanding.whyScholalrySlider;

  const academicPartners = pageData?.academicPartners || MainAiLanding.academicPartners;
  const faq = pageData?.faq || MainAiLanding.faq;

  return (
    <div>
      <MainLayout>
        <HeroSection heroContent={heroContent} />
        <AcademicTools content={academicTools} />
        <WhyTools whyToolsContent={whyTools} />
        {/* <WhySlider whyData={whyScholarlySlider} /> */}
        {/* <CustomerReviews /> */}
        <AcademicPartners content={academicPartners} />
        <Faq content={faq} />
      </MainLayout>
    </div>
  );
};

export default Page;

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPageData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com";
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const canonicalUrl = `${normalizedBaseUrl}/tools`;

  return {
    title: pageData?.meta?.title || "Free Academic Tools | Essay, Paraphraser, Summary & Thesis",
    description: pageData?.meta?.description || "Use our free AI academic tools to write essays, paraphrase content, summarize text, and create thesis statements. Fast, accurate, student-friendly support.",
    alternates: {
      canonical: pageData?.meta?.canonicalUrl || canonicalUrl,
    },
  };
}

