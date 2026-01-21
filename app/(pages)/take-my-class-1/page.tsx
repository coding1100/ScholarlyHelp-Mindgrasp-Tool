import MainLayout from "@/app/MainLayout";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import ProcessSection from "@/app/components/LandingPage/ProcessSection";
import Success from "@/app/components/LandingPage/Success";
import Subjects from "@/app/components/LandingPage/Subjects";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import GetQoute from "@/app/components/LandingPage/GetQoute";
import Faq from "@/app/components/LandingPage/Faq";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import CardCarousel from "@/app/components/LandingPage/CardCarousel";
import GuaranteedBlock from "@/app/components/LandingPage/GuaranteedBlock";
import Description from "@/app/components/LandingPage/Description";
import Ratings from "@/app/components/LandingPage/Ratings";
import { HomeDataProvider } from "../HomeDataProvider";
import dynamicImport from "next/dynamic";

const GetQouteDynamic = dynamicImport(() => import("@/app/components/LandingPage/GetQoute"), { ssr: false });

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchTakeMyClass1Data() {
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
      // Force a new connection to avoid caching
      maxPoolSize: 1,
    });
    
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Query for take-my-class-1 page using id or pageType
    const query = { 
      $or: [
        { id: "take-my-class-1" },
        { pageType: "take-my-class-1" }
      ]
    };
    
    console.log('Querying pages collection with query:', JSON.stringify(query));
    // Use findOne with no caching
    const content = await db.collection('pages').findOne(query, {
      // Disable any potential caching
      readPreference: 'primary',
    });
    console.log('Found content:', content ? 'Yes' : 'No');
    
    // Debug: Log the heroSection data to verify it's being fetched correctly
    if (content) {
      console.log('Fetched take-my-class-1 data - heroSection:', JSON.stringify(content.heroSection));
      console.log('Fetched take-my-class-1 data - heroSection.mainHeading:', content.heroSection?.mainHeading);
    }
    
    // If no content found, try to see what's in the collection
    if (!content) {
      const allDocs = await db.collection('pages').find({}).limit(5).toArray();
      console.log('Sample documents in pages:', allDocs.map(d => ({ id: d.id, pageType: d.pageType, slug: d.slug })));
    }
    
    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching take-my-class-1 data:', error);
    return null;
  }
}

const TakeMyClass1 = async () => {
  const pageData = await fetchTakeMyClass1Data();
  
  return (
    <HomeDataProvider data={pageData}>
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
        <GetQouteDynamic />
        <Faq />
      </MainLayout>
    </HomeDataProvider>
  );
};

export default TakeMyClass1;

export async function generateMetadata() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const { MongoClient } = await import('mongodb');
      const client = new MongoClient(databaseUrl, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      
      await client.connect();
      const db = client.db('scholarly_help');
      
      const query = { 
        $or: [
          { id: "take-my-class-1" },
          { pageType: "take-my-class-1" }
        ]
      };
      
      const pageData: any = await db.collection('pages').findOne(query);
      await client.close();
      
      if (pageData) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarlyhelp.com';
        const metaTitle = pageData.meta?.title || "Take My Class 1 - Academic Writing Services For You";
        const metaDescription = pageData.meta?.description || "Struggling with online classes, exams, assignments or essays? Scholarly Help provides professional academic writing services tailored to your needs. Get timely, plagiarism-free solutions crafted by experts. Your success starts here!";
        const canonicalUrl = pageData.meta?.canonicalUrl || `${baseUrl}/take-my-class-1`;
        
        return {
          title: metaTitle,
          description: metaDescription,
          alternates: {
            canonical: canonicalUrl,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}take-my-class-1`;
  return {
    title: "Take My Class 1 - Academic Writing Services For You",
    description:
      "Struggling with online classes, exams, assignments or essays? Scholarly Help provides professional academic writing services tailored to your needs. Get timely, plagiarism-free solutions crafted by experts. Your success starts here!",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
