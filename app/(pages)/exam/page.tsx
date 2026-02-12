import MainLayout from "@/app/MainLayout";
import { MetaData } from "@/app/metadata/metadata";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import BelowFoldLanding from "@/app/components/LandingPage/BelowFoldLanding";
import Subjects from "@/app/components/LandingPage/Subjects";
import { ExamDataProvider } from "./ExamDataProvider";
import { examsSubjects } from "../exams/content";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchExamData() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("Database URL not configured");
      return null;
    }

    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db("scholarly_help");

    // Query for main exam page
    const query = {
      $or: [{ id: "exam_page" }, { id: "main" }],
    };

    const content = await db.collection("exam").findOne(query);
    await client.close();

    return content as any;
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
}

const Page = async () => {
  const pageData = await fetchExamData();

  return (
    <ExamDataProvider data={pageData}>
      <MainLayout>
        <HeroSection />
        <BelowFoldLanding>
          <Subjects defaultSubjects={examsSubjects} />
        </BelowFoldLanding>
      </MainLayout>
    </ExamDataProvider>
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
        $or: [{ id: "exam_page" }, { id: "main" }],
      };

      const pageData: any = await db.collection("exam").findOne(query);
      await client.close();

      if (pageData) {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com";
        const metaTitle = pageData.meta?.title || MetaData.exams.title;
        const metaDescription =
          pageData.meta?.description || MetaData.exams.description;
        const canonicalUrl =
          pageData.meta?.canonicalUrl || `${baseUrl}${MetaData.exams.url}`;

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
  const canonicalUrl = `${baseUrl}${MetaData.exams.url}`;
  return {
    title: `${MetaData.exams.title}`,
    description: `${MetaData.exams.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
