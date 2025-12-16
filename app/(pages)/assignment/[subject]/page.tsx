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
import { assignmentSubjects, isValidAssignmentSubject } from "../subjectContent";
import { notFound } from "next/navigation";
import { AssignmentDataProvider } from "../AssignmentDataProvider";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps { 
  params: { subject: string; }; 
}

async function fetchPageData(slug: string) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('Database URL not configured');
      return null;
    }

    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db('ScholarlyHelp_V1');
    
    // Handle different slug formats
    let slugVariations = [slug];
    
    // If slug is like "assignment_english", also try "english"
    if (slug.startsWith('assignment_')) {
      slugVariations.push(slug.replace('assignment_', ''));
    } else {
      // If slug is like "english", also try "assignment_english"
      slugVariations.push(`assignment_${slug}`);
    }
    
    // Build query to match any variation
    const orConditions = [];
    for (const variation of slugVariations) {
      orConditions.push({ slug: variation });
      orConditions.push({ id: variation });
    }
    const query = { $or: orConditions };
    
    const content = await db.collection('assignments').findOne(query);
    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const { subject } = params;
  
  if (!isValidAssignmentSubject(subject)) {
    notFound();
  }

  const pageData = await fetchPageData(subject);

  // If no pageData found, still render the page with default structure
  // This allows the page to work even if data doesn't exist in MongoDB yet
  if (!pageData) {
    // Return a default page structure instead of 404
    const defaultPageData: any = {
      id: `assignment_${subject}`,
      slug: subject,
      pageType: `assignment_${subject}`,
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
      <AssignmentDataProvider data={defaultPageData}>
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
          <GetQoute />
          <Faq />
        </MainLayout>
      </AssignmentDataProvider>
    );
  }

  // Only return 404 if status is explicitly set to something other than published
  if (pageData.status && pageData.status !== 'published' && pageData.status !== 'draft') {
    notFound();
  }

  return (
    <AssignmentDataProvider data={pageData}>
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
        <GetQoute />
        <Faq />
      </MainLayout>
    </AssignmentDataProvider>
  );
};

export default Page;

export function generateStaticParams() { return assignmentSubjects.map((subject) => ({ subject })); }

export async function generateMetadata({ params }: { params: { subject: string } }) {
  if (!isValidAssignmentSubject(params.subject)) { 
    return { title: "Not Found", description: "The page you are looking for does not exist." }; 
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const { MongoClient } = await import('mongodb');
      const client = new MongoClient(databaseUrl);
      await client.connect();
      const db = client.db('ScholarlyHelp_V1');
      
      let slugVariations: string[] = [params.subject];
      if (params.subject.startsWith('assignment_')) {
        slugVariations.push(params.subject.replace('assignment_', ''));
      } else {
        slugVariations.push(`assignment_${params.subject}`);
      }
      
      const orConditions = [];
      for (const variation of slugVariations) {
        orConditions.push({ slug: variation });
        orConditions.push({ id: variation });
      }
      const query = { $or: orConditions, status: { $ne: 'draft' } };
      
      const pageData: any = await db.collection('assignments').findOne(query);
      await client.close();
      
      if (pageData) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarlyhelp.com';
        const metaTitle = pageData.meta?.title || `${params.subject.charAt(0).toUpperCase() + params.subject.slice(1).replace(/-/g, " ")} Assignment Help`;
        const metaDescription = pageData.meta?.description || `Get expert help with your ${params.subject.replace(/-/g, " ")} assignment.`;
        const canonicalUrl = pageData.meta?.canonicalUrl || `${baseUrl}/assignment/${params.subject}`;
        
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
  const subjectTitle = params.subject.charAt(0).toUpperCase() + params.subject.slice(1).replace(/-/g, " ");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}assignment/${params.subject}`;

  return {
    title: `${subjectTitle} Assignment Help - Professional Assistance`,
    description: `Get expert help with your ${params.subject.replace(/-/g, " ")} assignment.`,
    alternates: { canonical: canonicalUrl },
  };
}