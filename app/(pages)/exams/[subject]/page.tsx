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
import { examSubjects, isValidExamSubject } from "../examSubjectContent";
import { notFound } from "next/navigation";
import { ExamDataProvider } from "../../exam/ExamDataProvider";

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
    const client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db('scholarly_help');
    
    // Handle different slug formats
    let slugVariations = [slug];
    
    // If slug is like "exam_english", also try "english"
    if (slug.startsWith('exam_')) {
      slugVariations.push(slug.replace('exam_', ''));
    } else {
      // If slug is like "english", also try "exam_english"
      slugVariations.push(`exam_${slug}`);
    }
    
    // Build query to match any variation
    const orConditions = [];
    for (const variation of slugVariations) {
      orConditions.push({ slug: variation });
      orConditions.push({ id: variation });
    }
    const query = { $or: orConditions };
    
    const content = await db.collection('exam').findOne(query);
    await client.close();

    return content as any;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

const Page: React.FC<PageProps> = async ({ params }) => {
  if (!isValidExamSubject(params.subject)) {
    notFound();
  }

  const pageData = await fetchPageData(params.subject);

  // If no pageData found, still render the page with default structure
  // This allows the page to work even if data doesn't exist in MongoDB yet
  if (!pageData) {
    // Return a default page structure instead of 404
    const defaultPageData: any = {
      id: `exam_${params.subject}`,
      slug: params.subject,
      pageType: `exam_${params.subject}`,
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
      <ExamDataProvider data={defaultPageData}>
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
      </ExamDataProvider>
    );
  }

  // Only return 404 if status is explicitly set to something other than published
  if (pageData.status && pageData.status !== 'published' && pageData.status !== 'draft') {
    notFound();
  }

  return (
    <ExamDataProvider data={pageData}>
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
    </ExamDataProvider>
  );
};

export default Page;

export async function generateStaticParams() {
  return examSubjects.map((subject) => ({
    subject,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  if (!isValidExamSubject(params.subject)) {
    return { title: "Not Found", description: "The page you are looking for does not exist." };
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const { MongoClient } = await import('mongodb');
      const client = new MongoClient(databaseUrl);
      await client.connect();
      const db = client.db('scholarly_help');
      
      let slugVariations: string[] = [params.subject];
      if (params.subject.startsWith('exam_')) {
        slugVariations.push(params.subject.replace('exam_', ''));
      } else {
        slugVariations.push(`exam_${params.subject}`);
      }
      
      const orConditions = [];
      for (const variation of slugVariations) {
        orConditions.push({ slug: variation });
        orConditions.push({ id: variation });
      }
      const query = { $or: orConditions, status: { $ne: 'draft' } };
      
      const pageData: any = await db.collection('exam').findOne(query);
      await client.close();
      
      if (pageData) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarlyhelp.com';
        const metaTitle = pageData.meta?.title || `Take My ${params.subject} Exam | Professional ${params.subject} Exam Help`;
        const metaDescription = pageData.meta?.description || `Get expert help with your ${params.subject} exams. Professional ${params.subject} exam assistance for better grades.`;
        const canonicalUrl = pageData.meta?.canonicalUrl || `${baseUrl}/exams/${params.subject}`;
        
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}exams/${params.subject}`;
  
  return {
    title: `Take My ${params.subject} Exam | Professional ${params.subject} Exam Help`,
    description: `Get expert help with your ${params.subject} exams. Professional ${params.subject} exam assistance for better grades.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
