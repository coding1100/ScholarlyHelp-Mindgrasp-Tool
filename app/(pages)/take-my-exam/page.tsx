import MainLayout from "@/app/MainLayout";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import Ratings from "@/app/components/LandingPage/Ratings";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CardCarousel from "@/app/components/LandingPage/CardCarousel";
import Description from "@/app/components/LandingPage/Description";
import GuaranteedBlock from "@/app/components/LandingPage/GuaranteedBlock";
import ProcessSection from "@/app/components/LandingPage/ProcessSection";
import Success from "@/app/components/LandingPage/Success";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import GetQoute from "@/app/components/LandingPage/GetQoute";
import Faq from "@/app/components/LandingPage/Faq";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import { MetaData } from "@/app/metadata/metadata";
import { TakeMyExamDataProvider } from "../TakeMyExamDataProvider";
import type { Metadata } from "next";

export const revalidate = 0;

async function fetchTakeMyExamData() {
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
    });
    
    await client.connect();
    const db = client.db('scholarly_help');
    
    const query = { 
      id: "take-my-exam"
    };
    
    console.log('Querying pages collection for take-my-exam, query:', JSON.stringify(query));
    const content = await db.collection('pages').findOne(query, {
      readPreference: 'primary',
    });
    console.log('Found content:', content ? 'Yes' : 'No');
    
    await client.close();
    return content as any;
  } catch (error) {
    console.error('Error fetching take-my-exam data:', error);
    return null;
  }
}

const Page = async () => {
  const pageData = await fetchTakeMyExamData();
  
  return (
    <TakeMyExamDataProvider data={pageData}>
      <MainLayout>
        <HeroSection />
        <Ratings />
        <CardCarousel />
        <Description />
        <GuaranteedBlock />
        <WhySlider />
        <CustomerReviews />
        <ProcessSection />
        <Success />
        {/* <Subjects /> */}
        <AcademicPartners />
        <GetQoute />
        <Faq />
      </MainLayout>
    </TakeMyExamDataProvider>
  );
};
export default Page;
export async function generateMetadata({}): Promise<Metadata> {
  const pageData = await fetchTakeMyExamData();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = pageData?.meta?.canonicalUrl || `${baseUrl}${MetaData.takeMyExam.url}`;
  return {
    title: pageData?.meta?.title || MetaData.takeMyExam.title,
    description: pageData?.meta?.description || MetaData.takeMyExam.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
