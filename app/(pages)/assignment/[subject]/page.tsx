import MainLayout from "@/app/MainLayout";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import Ratings from "@/app/components/LandingPage/Ratings";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CardCarousel from "@/app/components/LandingPage/CardCarousel";
import Description from "@/app/components/LandingPage/Description";
import GuaranteedBlock from "@/app/components/LandingPage/GuaranteedBlock";
import ProcessSection from "@/app/components/LandingPage/ProcessSection";
import Success from "@/app/components/LandingPage/Success";
import Subjects from "@/app/components/LandingPage/Subjects";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import GetQoute from "@/app/components/LandingPage/GetQoute";
import Faq from "@/app/components/LandingPage/Faq";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import { assignmentSubjects, isValidAssignmentSubject } from "../subjectContent";
import { notFound } from "next/navigation";
import Head from "next/head";

interface PageProps { params: { subject: string; }; pageData?: any; }

async function fetchPageData(category: string, slug: string) {
  const response = await fetch(`${process.env.DIRECTUS_URL}/items/pages?filter[category][_eq]=${category}&filter[slug][_eq]=${slug}`);
  const data = await response.json();
  return data.data[0];
}

export async function getServerSideProps(context: any) {
  const { subject } = context.params;
  if (!isValidAssignmentSubject(subject)) {
    return { notFound: true };
  }

  const pageData = await fetchPageData('assignment', subject);

  if (!pageData || pageData.status !== 'published') {
    return { notFound: true };
  }

  return {
    props: { pageData },
  };
}

const Page: React.FC<PageProps> = ({ pageData }) => {
  if (!pageData) {
    notFound();
  }

  return (
    <>
      <Head>
        <title>{pageData.meta_title || pageData.title}</title>
        <meta name="description" content={pageData.meta_description} />
      </Head>
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
    </>
  );
};

export default Page;

export function generateStaticParams() { return assignmentSubjects.map((subject) => ({ subject })); }

export function generateMetadata({ params }: { params: { subject: string } }) {
  if (!isValidAssignmentSubject(params.subject)) { return { title: "Not Found", description: "The page you are looking for does not exist." }; }

  const subjectTitle = params.subject.charAt(0).toUpperCase() + params.subject.slice(1).replace(/-/g, " ");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}assignment/${params.subject}`;

  return {
    title: `${subjectTitle} Assignment Help - Professional Assistance`,
    description: `Get expert help with your ${params.subject.replace(/-/g, " ")} assignment.`,
    alternates: { canonical: canonicalUrl },
  };
}