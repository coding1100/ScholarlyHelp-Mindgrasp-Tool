import MainLayout from "@/app/MainLayout";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import BelowFoldLanding from "@/app/components/LandingPage/BelowFoldLanding";
import { MetaData } from "@/app/metadata/metadata";
import { TakeMyProctoredExamDataProvider } from "../TakeMyProctoredExamDataProvider";
import type { Metadata } from "next";
import Subjects from "@/app/components/LandingPage/Subjects";
import { examsSubjects } from "../exams/content";

export const revalidate = 0;

async function fetchTakeMyProctoredExamData() {
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
      maxPoolSize: 1,
    });

    await client.connect();
    const db = client.db("scholarly_help");

    const query = {
      id: "take-my-proctored-exam-for-me",
    };

    console.log(
      "Querying pages collection for take-my-proctored-exam-for-me, query:",
      JSON.stringify(query),
    );
    const content = await db.collection("pages").findOne(query, {
      readPreference: "primary",
    });
    console.log("Found content:", content ? "Yes" : "No");

    await client.close();
    return content as any;
  } catch (error) {
    console.error("Error fetching take-my-proctored-exam-for-me data:", error);
    return null;
  }
}

const Page = async () => {
  const pageData = await fetchTakeMyProctoredExamData();

  return (
    <TakeMyProctoredExamDataProvider data={pageData}>
      <MainLayout>
        <HeroSection />
        <BelowFoldLanding>
          <Subjects defaultSubjects={examsSubjects} />
        </BelowFoldLanding>
      </MainLayout>
    </TakeMyProctoredExamDataProvider>
  );
};
export default Page;

export async function generateMetadata({}): Promise<Metadata> {
  const pageData = await fetchTakeMyProctoredExamData();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl =
    pageData?.meta?.canonicalUrl ||
    `${baseUrl}${MetaData.takeMyProctoredExam.url}`;
  return {
    title: pageData?.meta?.title || MetaData.takeMyProctoredExam.title,
    description:
      pageData?.meta?.description || MetaData.takeMyProctoredExam.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
