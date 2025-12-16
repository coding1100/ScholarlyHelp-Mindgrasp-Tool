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
import Subjects from "@/app/components/LandingPage/Subjects";
import { essaySubjects, isValidEssaySubject, EssaySubject } from "../subjectContent";
import { notFound } from "next/navigation";
import { EssayWritingDataProvider } from "../EssayWritingDataProvider";
import dynamicImport from "next/dynamic";

const GetQouteDynamic = dynamicImport(() => import("@/app/components/LandingPage/GetQoute"), { ssr: false });

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    subject: string;
  };
}

async function fetchPageData(slug: string) {
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
    });
    
    await client.connect();
    const db = client.db('ScholarlyHelp_V1');
    
    // Handle different slug formats
    let slugVariations = [slug];
    
    // If slug is like "essay_writing_english", also try "english"
    if (slug.startsWith('essay_writing_')) {
      slugVariations.push(slug.replace('essay_writing_', ''));
    } else if (slug.startsWith('essay_writings_')) {
      slugVariations.push(slug.replace('essay_writings_', ''));
      slugVariations.push(slug.replace('essay_writings_', 'essay_writing_'));
    } else {
      // If slug is like "english", also try "essay_writing_english"
      slugVariations.push(`essay_writing_${slug}`);
      slugVariations.push(`essay_writings_${slug}`);
    }
    
    // Build query to match any variation
    const orConditions = [];
    for (const variation of slugVariations) {
      orConditions.push({ slug: variation });
      orConditions.push({ id: variation });
    }
    const query = { $or: orConditions };
    
    console.log(`Querying essay_writing with slug: ${slug}, query:`, JSON.stringify(query));
    const content = await db.collection('essay_writing').findOne(query);
    console.log('Found content:', content ? 'Yes' : 'No');
    
    // If no content found, try to see what's in the collection
    if (!content) {
      const allDocs = await db.collection('essay_writing').find({ slug: slug }).limit(5).toArray();
      console.log('Sample documents matching slug:', allDocs.map(d => ({ id: d.id, slug: d.slug })));
    }
    
    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

const Page: React.FC<PageProps> = async ({ params }) => {
  // Check if the subject is valid
  if (!isValidEssaySubject(params.subject)) {
    notFound();
  }

  const pageData = await fetchPageData(params.subject);

  // If no pageData found, still render the page with default structure
  // This allows the page to work even if data doesn't exist in MongoDB yet
  if (!pageData) {
    // Return a default page structure instead of 404
    const defaultPageData: any = {
      id: `essay_writing_${params.subject}`,
      slug: params.subject,
      pageType: `essay_writing_${params.subject}`,
      status: 'published',
      meta: { title: '', description: '' },
      heroSection: { mainHeading: '', subHeading: '', description: '' },
      whySlider: { mainHeading: '', description: '', ctaButton: { text: '' } },
      cardCarousel: { mainHeading: '', description: '', ctaButton: { text: '' } },
      description: { mainHeading: '', description: '', services: [], badges: [], ctaButton: { text: '' } },
      guaranteedBlock: { mainHeading: '', description: '', ctaButton: { text: '' } },
      processSection: { mainHeading: '', description: '', steps: [] },
      success: { mainHeading: '', description: '', ctaButton: { text: '' } },
      academicPartners: { mainHeading: '', description: '', cards: [], ctaButton: { text: '' } },
      getQuote: { mainHeading: '', description: '', ctaButton: { text: '' } },
      faq: { mainHeading: '', faqs: [] }
    };
    
    return (
      <EssayWritingDataProvider data={defaultPageData}>
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
          <Subjects />
          <AcademicPartners />
          <GetQouteDynamic />
          <Faq />
        </MainLayout>
      </EssayWritingDataProvider>
    );
  }

  // Only return 404 if status is explicitly set to something other than published
  if (pageData.status && pageData.status !== 'published' && pageData.status !== 'draft') {
    notFound();
  }

  return (
    <EssayWritingDataProvider data={pageData}>
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
        <Subjects />
        <AcademicPartners />
        <GetQouteDynamic />
        <Faq />
      </MainLayout>
    </EssayWritingDataProvider>
  );
};

export default Page;

export function generateStaticParams() {
  return essaySubjects.map((subject) => ({
    subject: subject
  }));
}

export async function generateMetadata({ params }: { params: { subject: string } }) {
  if (!isValidEssaySubject(params.subject)) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.'
    };
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const { MongoClient } = await import('mongodb');
      const client = new MongoClient(databaseUrl);
      await client.connect();
      const db = client.db('ScholarlyHelp_V1');
      
      let slugVariations: string[] = [params.subject];
      if (params.subject.startsWith('essay_writing_')) {
        slugVariations.push(params.subject.replace('essay_writing_', ''));
      } else if (params.subject.startsWith('essay_writings_')) {
        slugVariations.push(params.subject.replace('essay_writings_', ''));
        slugVariations.push(params.subject.replace('essay_writings_', 'essay_writing_'));
      } else {
        slugVariations.push(`essay_writing_${params.subject}`);
        slugVariations.push(`essay_writings_${params.subject}`);
      }
      
      const orConditions = [];
      for (const variation of slugVariations) {
        orConditions.push({ slug: variation });
        orConditions.push({ id: variation });
      }
      const query = { $or: orConditions, status: { $ne: 'draft' } };
      
      const pageData: any = await db.collection('essay_writing').findOne(query);
      await client.close();
      
      if (pageData) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarlyhelp.com';
        const metaTitle = pageData.meta?.title || `${params.subject.charAt(0).toUpperCase() + params.subject.slice(1).replace(/-/g, " ")} Essay Writing Help`;
        const metaDescription = pageData.meta?.description || `Get expert help with your ${params.subject.replace(/-/g, " ")} essay writing.`;
        const canonicalUrl = pageData.meta?.canonicalUrl || `${baseUrl}/essay-writing/${params.subject}`;
        
        return {
          title: metaTitle,
          description: metaDescription,
          alternates: { canonical: canonicalUrl },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }

  // Fallback metadata
  const subjectTitle = params.subject.charAt(0).toUpperCase() + params.subject.slice(1).replace(/-/g, ' ');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}essay-writing/${params.subject}`;
  
  return {
    title: `${subjectTitle} Essay Writing Help - Professional Assistance`,
    description: `Get expert help with your ${params.subject.replace(/-/g, ' ')} essay writing.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
