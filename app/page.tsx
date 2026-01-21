import MainLayout from "./MainLayout";
import HeroSection from "./components/LandingPage/HeroSection";
import Ratings from "./components/LandingPage/Ratings";
import { HomeDataProvider } from "./(pages)/HomeDataProvider";
import dynamicImport from "next/dynamic";
import { getHomeData } from "./lib/mongodb";

// Skeleton component for loading states
const LoadingSkeleton = ({ height = "400px" }: { height?: string }) => (
  <div className="w-full animate-pulse bg-gray-100" style={{ minHeight: height }} />
);

// Lazy load ALL below-the-fold components to reduce initial JS
const WhySlider = dynamicImport(() => import("./components/LandingPage/WhySlider"), {
  loading: () => <LoadingSkeleton height="500px" />,
  ssr: true, // Keep SSR for SEO but load JS lazily
});

const CardCarousel = dynamicImport(() => import("./components/LandingPage/CardCarousel"), {
  loading: () => <LoadingSkeleton height="600px" />,
  ssr: false, // Heavy slider - no SSR needed
});

const Description = dynamicImport(() => import("./components/LandingPage/Description"), {
  loading: () => <LoadingSkeleton height="300px" />,
  ssr: true,
});

const GuaranteedBlock = dynamicImport(() => import("./components/LandingPage/GuaranteedBlock"), {
  loading: () => <LoadingSkeleton height="400px" />,
  ssr: true,
});

const CustomerReviews = dynamicImport(() => import("./components/LandingPage/CustomerReviews"), {
  loading: () => <LoadingSkeleton height="500px" />,
  ssr: false, // Heavy slider component
});

const ProcessSection = dynamicImport(() => import("./components/LandingPage/ProcessSection"), {
  loading: () => <LoadingSkeleton height="400px" />,
  ssr: true,
});

const Success = dynamicImport(() => import("./components/LandingPage/Success"), {
  loading: () => <LoadingSkeleton height="300px" />,
  ssr: true,
});

const AcademicPartners = dynamicImport(() => import("./components/LandingPage/AcademicPartners"), {
  loading: () => <LoadingSkeleton height="200px" />,
  ssr: true,
});

const GetQouteDynamic = dynamicImport(() => import("./components/LandingPage/GetQoute"), { 
  ssr: false,
  loading: () => <LoadingSkeleton height="400px" />
});

const Faq = dynamicImport(() => import("./components/LandingPage/Faq"), {
  loading: () => <LoadingSkeleton height="400px" />,
  ssr: true,
});

// Enable ISR with 60 second revalidation for fast TTFB
export const revalidate = 60;

const Home = async () => {
  // Use pooled connection - much faster TTFB
  const pageData = await getHomeData();
  
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
        <AcademicPartners />
        <GetQouteDynamic />
        <Faq />
      </MainLayout>
    </HomeDataProvider>
  );
};

export default Home;

export async function generateMetadata() {
  // Reuse the same cached data - no duplicate DB call
  const pageData = await getHomeData();
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scholarlyhelp.com';
  
  if (pageData) {
    const metaTitle = pageData.meta?.title || "Scholarly Help - Academic Writing Services For You";
    const metaDescription = pageData.meta?.description || "Struggling with online classes, exams, assignments or essays? Scholarly Help provides professional academic writing services tailored to your needs. Get timely, plagiarism-free solutions crafted by experts. Your success starts here!";
    const canonicalUrl = pageData.meta?.canonicalUrl || baseUrl;
    
    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
  
  return {
    title: "Scholarly Help - Academic Writing Services For You",
    description:
      "Struggling with online classes, exams, assignments or essays? Scholarly Help provides professional academic writing services tailored to your needs. Get timely, plagiarism-free solutions crafted by experts. Your success starts here!",
    alternates: {
      canonical: baseUrl,
    },
  };
}
