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
import { EssayWritingDataProvider } from "./EssayWritingDataProvider";
import dynamicImport from "next/dynamic";
import { essayWritingSubjects } from "./content";

const GetQouteDynamic = dynamicImport(
  () => import("@/app/components/LandingPage/GetQoute"),
  { ssr: false }
);

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchEssayWritingData() {
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

    // Query for main essay-writing page - try multiple variations including with/without 's'
    const query = {
      $or: [
        { id: "essay_writing_page" },
        { id: "essay_writings_page" },
        { id: "main" },
        { id: "essay-writing" },
        { slug: "essay_writing_page" },
        { slug: "essay_writings_page" },
        { slug: "main" },
      ],
    };

    console.log(
      "Querying essay_writing collection with query:",
      JSON.stringify(query)
    );
    const content = await db.collection("essay_writing").findOne(query);
    console.log("Found content:", content ? "Yes" : "No");

    // If no content found, try to see what's in the collection
    if (!content) {
      const allDocs = await db
        .collection("essay_writing")
        .find({})
        .limit(5)
        .toArray();
      console.log(
        "Sample documents in essay_writing:",
        allDocs.map((d) => ({ id: d.id, slug: d.slug }))
      );
    }

    await client.close();

    return content as any;
  } catch (error) {
    console.error("Error fetching essay-writing data:", error);
    return null;
  }
}

const Page = async () => {
  const pageData = await fetchEssayWritingData();

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
        <Subjects defaultSubjects={essayWritingSubjects} />
        <AcademicPartners />
        <GetQouteDynamic />
        <Faq />
      </MainLayout>
    </EssayWritingDataProvider>
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
        $or: [
          { id: "essay_writing_page" },
          { id: "essay_writings_page" },
          { id: "main" },
        ],
      };

      const pageData: any = await db.collection("essay_writing").findOne(query);
      await client.close();

      if (pageData) {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com";
        const metaTitle = pageData.meta?.title || MetaData.essayWriting.title;
        const metaDescription =
          pageData.meta?.description || MetaData.essayWriting.description;
        const canonicalUrl =
          pageData.meta?.canonicalUrl ||
          `${baseUrl}${MetaData.essayWriting.url}`;

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
  const canonicalUrl = `${baseUrl}${MetaData.essayWriting.url}`;
  return {
    title: `${MetaData.essayWriting.title}`,
    description: `${MetaData.essayWriting.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
