import MainLayout from "@/app/MainLayout";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import BelowFoldLanding from "@/app/components/LandingPage/BelowFoldLanding";
import Subjects from "@/app/components/LandingPage/Subjects";
import { MetaData } from "@/app/metadata/metadata";
import { assignmentSubject } from "../assignment/content";

const Page = () => {
  return (
    <MainLayout>
      <HeroSection />
      <BelowFoldLanding>
        <Subjects defaultSubjects={assignmentSubject} />
      </BelowFoldLanding>
    </MainLayout>
  );
};
export default Page;

export function generateMetadata({}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com/";
  const canonicalUrl = `${baseUrl}${MetaData.doMyAssignment.url}`;
  return {
    title: `${MetaData.doMyAssignment.title}`,
    description: `${MetaData.doMyAssignment.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

