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
import { AssignmentDataProvider } from "./AssignmentDataProvider";
import { assignmentSubject } from "./content";
// import type { Metadata } from "next";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// export const metadata: Metadata = {
//   title: "Help Me Do My Assignment | Online Assignment Help | Scholarly Help",
// };
async function fetchAssignmentData() {
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

    // Query for main assignment page
    const query = {
      $or: [{ id: "assignment_page" }, { id: "main" }],
    };

    const content = await db.collection("assignments").findOne(query);

    // Debug: Log the getQuote data to verify it's being fetched correctly
    if (content) {
      console.log("Fetched assignment data - getQuote:", content.getQuote);
      console.log(
        "Fetched assignment data - ctaButton.text:",
        content.getQuote?.ctaButton?.text
      );
    }

    await client.close();

    return content as any;
  } catch (error) {
    console.error("Error fetching assignment data:", error);
    return null;
  }
}

const Page = async () => {
  const pageData = await fetchAssignmentData();

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
        <Subjects defaultSubjects={assignmentSubject} />
        <AcademicPartners />
        <GetQoute />
        <Faq />
      </MainLayout>
    </AssignmentDataProvider>
  );
};
export default Page;

export async function generateMetadata() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const { MongoClient } = await import("mongodb");
      const client = new MongoClient(databaseUrl);
      await client.connect();
      const db = client.db("scholarly_help");

      const query = {
        $or: [{ id: "assignment_page" }, { id: "main" }],
      };

      const pageData: any = await db.collection("assignments").findOne(query);
      await client.close();

      if (pageData) {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com";
        const metaTitle = pageData.meta?.title || MetaData.assignment.title;
        const metaDescription =
          pageData.meta?.description || MetaData.assignment.description;
        const canonicalUrl =
          pageData.meta?.canonicalUrl || `${baseUrl}${MetaData.assignment.url}`;

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
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}${MetaData.assignment.url}`;
  return {
    title: `${MetaData.assignment.title}`,
    description: `${MetaData.assignment.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
