import MainLayout from "@/app/MainLayout";
import { MetaData } from "@/app/metadata/metadata";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import Ratings from "@/app/components/LandingPage/Ratings";
import WhySlider from "@/app/components/LandingPage/WhySlider";
import CardCarousel from "@/app/components/LandingPage/CardCarousel";
import Description from "@/app/components/LandingPage/Description";
import GuaranteedBlock from "@/app/components/LandingPage/GuaranteedBlock";
import ProcessSection from "@/app/components/LandingPage/ProcessSection";
import Success from "@/app/components/LandingPage/Success";
import AcademicPartners from "@/app/components/LandingPage/AcademicPartners";
import CustomerReviews from "@/app/components/LandingPage/CustomerReviews";
import GetQoute from "@/app/components/LandingPage/GetQoute";
import Faq from "@/app/components/LandingPage/Faq";
import Subjects from "@/app/components/LandingPage/Subjects";
import { HomeworkDataProvider } from "./HomeworkDataProvider";
import { homeworkSubject } from "./content";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchHomeworkData() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("Database URL not configured");
      return null;
    }

    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    const db = client.db("scholarly_help");

    // Query for main homework page
    const query = {
      $or: [{ id: "homework_page" }, { id: "main" }],
    };

    const content = await db.collection("homework").findOne(query);
    await client.close();

    return content as any;
  } catch (error) {
    console.error("Error fetching homework data:", error);
    // Return null instead of throwing to prevent 500 error
    return null;
  }
}

const Page = async () => {
  const pageData = await fetchHomeworkData();

  return (
    <HomeworkDataProvider data={pageData}>
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
        <Subjects defaultSubjects={homeworkSubject} />
        <AcademicPartners />
        <GetQoute />
        <Faq />
      </MainLayout>
    </HomeworkDataProvider>
  );
};
export default Page;

export async function generateMetadata() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const { MongoClient } = await import("mongodb");
      const client = new MongoClient(databaseUrl, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });

      await client.connect();
      const db = client.db("scholarly_help");

      const query = {
        $or: [{ id: "homework_page" }, { id: "main" }],
      };

      const pageData: any = await db.collection("homework").findOne(query);
      await client.close();

      if (pageData) {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com";
        const metaTitle = pageData.meta?.title || MetaData.homeWork.title;
        const metaDescription =
          pageData.meta?.description || MetaData.homeWork.description;
        const canonicalUrl =
          pageData.meta?.canonicalUrl || `${baseUrl}${MetaData.homeWork.url}`;

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
    console.error("Error fetching metadata:", error);
    // Fall through to default metadata
  }

  // Default metadata if database fetch fails
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}${MetaData.homeWork.url}`;
  return {
    title: `${MetaData.homeWork.title}`,
    description: `${MetaData.homeWork.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
