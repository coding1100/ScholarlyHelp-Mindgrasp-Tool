import { FC } from "react";
import { Metadata } from "next";
import { MetaData } from "@/app/metadata/metadata";
import AiHero from "@/app/components/AiLandingPage/AiHero";
import AiTrust from "@/app/components/AiLandingPage/AITrust";
import KeyFeatures from "@/app/components/AiLandingPage/KeyFeatures";
import AiMission from "@/app/components/AiLandingPage/AiMission";
import AiFaq from "@/app/components/AiLandingPage/AiFaq";
import ElevateWriting from "@/app/components/AiLandingPage/ElevateWriting";
import { AiParahrasingContent } from "@/app/components/AiLandingPage/AiContent";
import ThemeToggle from "@/app/components/AiLandingPage/ThemeToggle";

interface PageProps { }
const Page: FC<PageProps> = ({ }) => {
    return (
        <>
            <ThemeToggle />

            <AiHero
                heroContent={AiParahrasingContent.heroContent}
                imgSection={AiParahrasingContent.imgSection}
            />
            <AiTrust trustSection={AiParahrasingContent.trustSection} />
            <KeyFeatures featuresSection={AiParahrasingContent.featuresSection} />
            <AiMission
                missionSection={AiParahrasingContent.missionSection}
                guideSection={AiParahrasingContent.guideSection}
            />
            <AiFaq FaqSestion={AiParahrasingContent.FaqSestion} />
            <ElevateWriting elevateSection={AiParahrasingContent.elevateSection} />
        </>
    );
};
export default Page;

export function generateMetadata(): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarlyhelp.com";
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const canonicalUrl = `${normalizedBaseUrl}/ai-paraphraser`;

    return {
        title: "AI Paraphrasing Tool | Rewrite & Refine Academic Content Free",
        description: "Enhance clarity and originality with our AI-powered paraphrasing tool. Reward academic content effortlessly while maintaining your true meaning and professional tone.",
        alternates: {
            canonical: canonicalUrl,
        },
    };
}
