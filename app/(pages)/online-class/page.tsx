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
import { OnlineClassDataProvider } from "./OnlineClassDataProvider";
import dynamicImport from "next/dynamic";
import { onlineClassSubjects } from "./content";

const GetQouteDynamic = dynamicImport(
  () => import("@/app/components/LandingPage/GetQoute"),
  { ssr: false }
);

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchOnlineClassData() {
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

    // Query for main online-class page - try multiple variations including with/without 's'
    const query = {
      $or: [
        { id: "online_class_page" },
        { id: "online_classes_page" },
        { id: "main" },
        { id: "online-class" },
        { slug: "online_class_page" },
        { slug: "online_classes_page" },
        { slug: "main" },
      ],
    };

    console.log(
      "Querying online_classes collection with query:",
      JSON.stringify(query)
    );
    const content = await db.collection("online_classes").findOne(query);
    console.log("Found content:", content ? "Yes" : "No");

    // If no content found, try to see what's in the collection
    if (!content) {
      const allDocs = await db
        .collection("online_classes")
        .find({})
        .limit(5)
        .toArray();
      console.log(
        "Sample documents in online_classes:",
        allDocs.map((d) => ({ id: d.id, slug: d.slug }))
      );
    }

    await client.close();

    return content as any;
  } catch (error) {
    console.error("Error fetching online-class data:", error);
    return null;
  }
}

const Page = async () => {
  const pageData = await fetchOnlineClassData();

  return (
    <OnlineClassDataProvider data={pageData}>
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
        <Subjects defaultSubjects={onlineClassSubjects} />
        <AcademicPartners />
        <GetQouteDynamic />
        <Faq />
      </MainLayout>
    </OnlineClassDataProvider>
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
        $or: [
          { id: "online_class_page" },
          { id: "online_classes_page" },
          { id: "main" },
        ],
      };

      const pageData: any = await db
        .collection("online_classes")
        .findOne(query);
      await client.close();

      if (pageData) {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com";
        const metaTitle = pageData.meta?.title || MetaData.onlineClass.title;
        const metaDescription =
          pageData.meta?.description || MetaData.onlineClass.description;
        const canonicalUrl =
          pageData.meta?.canonicalUrl ||
          `${baseUrl}${MetaData.onlineClass.url}`;

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
  const canonicalUrl = `${baseUrl}${MetaData.onlineClass.url}`;
  return {
    title: `${MetaData.onlineClass.title}`,
    description: `${MetaData.onlineClass.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
