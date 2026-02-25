import { FC } from "react";
import { Metadata } from "next";
import { MetaData } from "@/app/metadata/metadata";
import AiHero from "@/app/components/AiLandingPage/AiHero";
import AiTrust from "@/app/components/AiLandingPage/AITrust";
import KeyFeatures from "@/app/components/AiLandingPage/KeyFeatures";
import AiMission from "@/app/components/AiLandingPage/AiMission";
import AiFaq from "@/app/components/AiLandingPage/AiFaq";
import ElevateWriting from "@/app/components/AiLandingPage/ElevateWriting";
// import ThemeToggle from "@/app/components/AiLandingPage/ThemeToggle";
import { PythagorasSolverContent } from "@/app/components/AiLandingPage/AiContent";

interface PageProps {}
const Page: FC<PageProps> = ({}) => {
  // return <div>test</div>
  return (
    <>
      {/* <ThemeToggle /> */}
      <AiHero
        heroContent={PythagorasSolverContent.heroContent}
        imgSection={PythagorasSolverContent.imgSection}
      />
      <AiTrust trustSection={PythagorasSolverContent.trustSection} />
      <KeyFeatures featuresSection={PythagorasSolverContent.featuresSection} />
      <AiMission
        missionSection={PythagorasSolverContent.missionSection}
        guideSection={PythagorasSolverContent.guideSection}
      />
      <AiFaq FaqSestion={PythagorasSolverContent.FaqSestion} />
      <ElevateWriting elevateSection={PythagorasSolverContent.elevateSection} />
    </>
  );
};
export default Page;

export function generateMetadata(): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com";
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const canonicalUrl = `${normalizedBaseUrl}/pythagoras-solver`;

  return {
    title: "AI Pythagoras Equation Solver for Triangle Calculations",
    description:
      "Solve Pythagorean theorem problems instantly. Scholarly AI Pythagoras equation solver provides fast, accurate right triangle solutions. Start solving now.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
