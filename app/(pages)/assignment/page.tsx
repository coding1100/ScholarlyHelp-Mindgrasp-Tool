import MainLayout from "@/app/MainLayout";
import { MetaData } from "@/app/metadata/metadata";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import BelowFoldLanding from "@/app/components/LandingPage/BelowFoldLanding";
import Subjects from "@/app/components/LandingPage/Subjects";
import { AssignmentDataProvider } from "./AssignmentDataProvider";
import { assignmentSubject } from "./content";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        <BelowFoldLanding>
          <Subjects defaultSubjects={assignmentSubject} />
        </BelowFoldLanding>
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

