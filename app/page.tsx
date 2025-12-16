import MainLayout from "./MainLayout";
import HeroSection from "./components/LandingPage/HeroSection";
import WhySlider from "./components/LandingPage/WhySlider";
import ProcessSection from "./components/LandingPage/ProcessSection";
import Success from "./components/LandingPage/Success";
import Subjects from "./components/LandingPage/Subjects";
import AcademicPartners from "./components/LandingPage/AcademicPartners";
import GetQoute from "./components/LandingPage/GetQoute";
import Faq from "./components/LandingPage/Faq";
import CustomerReviews from "./components/LandingPage/CustomerReviews";
import CardCarousel from "./components/LandingPage/CardCarousel";
import GuaranteedBlock from "./components/LandingPage/GuaranteedBlock";
import Description from "./components/LandingPage/Description";
import Ratings from "./components/LandingPage/Ratings";
import { HomeDataProvider } from "./(pages)/HomeDataProvider";
import dynamicImport from "next/dynamic";

const GetQouteDynamic = dynamicImport(() => import("./components/LandingPage/GetQoute"), { ssr: false });

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchHomeData() {
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
    
    // Query for main home page - try multiple variations
    const query = { 
      $or: [
        { id: "home_page" }, 
        { id: "home" },
        { id: "main" },
        { slug: "home_page" },
        { slug: "home" },
        { slug: "main" }
      ]
    };
    
    console.log('Querying home collection with query:', JSON.stringify(query));
    // Use findOne with no caching
    const content = await db.collection('home').findOne(query, {
      // Disable any potential caching
      readPreference: 'primary',
    });
    console.log('Found content:', content ? 'Yes' : 'No');
    
    // Debug: Log the heroSection data to verify it's being fetched correctly
    if (content) {
      console.log('Fetched home data - heroSection:', JSON.stringify(content.heroSection));
      console.log('Fetched home data - heroSection.mainHeading:', content.heroSection?.mainHeading);
    }
    
    // If no content found, try to see what's in the collection
    if (!content) {
      const allDocs = await db.collection('home').find({}).limit(5).toArray();
      console.log('Sample documents in home:', allDocs.map(d => ({ id: d.id, slug: d.slug })));
    }
    
    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return null;
  }
}

const Home = async () => {
  const pageData = await fetchHomeData();
  
  return (
    <HomeDataProvider data={pageData}>
      <MainLayout>
        <HeroSection />
        <Ratings />
        <WhySlider />
        <CardCarousel />
        <Description />
        <GuaranteedBlock />
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

export default Home;

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
          { id: "home_page" }, 
          { id: "home" },
          { id: "main" }
        ]
      };
      
      const pageData: any = await db.collection('home').findOne(query);
      await client.close();
      
      if (pageData) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarlyhelp.com';
        const metaTitle = pageData.meta?.title || "Scholarly Help - Academic Writing Services For You";
        const metaDescription = pageData.meta?.description || "Struggling with online classes, exams, assignments or essays? Scholarly Help provides professional academic writing services tailored to your needs. Get timely, plagiarism-free solutions crafted by experts. Your success starts here!";
        const canonicalUrl = pageData.meta?.canonicalUrl || `${baseUrl}`;
        
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
  const canonicalUrl = `${baseUrl}`;
  return {
    title: "Scholarly Help - Academic Writing Services For You",
    description:
      "Struggling with online classes, exams, assignments or essays? Scholarly Help provides professional academic writing services tailored to your needs. Get timely, plagiarism-free solutions crafted by experts. Your success starts here!",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
