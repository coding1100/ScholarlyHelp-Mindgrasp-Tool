"use client";

import Image from "next/image";
import { useMemo } from "react";
import CanvasImg from "@/app/assets/Images/canvas.png";
import MoodleImg from "@/app/assets/Images/moodle.png";
import BlackboardImg from "@/app/assets/Images/blackboard.png";
import CengageImg from "@/app/assets/Images/cengage.png";
import StudyImg from "@/app/assets/Images/studyImg.png";
import WguImg from "@/app/assets/Images/wguImg.png";
import { usePageData } from "@/app/components/LandingPage/usePageData";

const DEFAULT_MAIN_HEADING =
  "Let's Take Your Online Chemistry Exam on All Online Platforms";
const DEFAULT_SUB_HEADING =
  "At The Online Class Help, our experts have mastery over multiple online exam platforms. We do our best to make online chemistry exams stress-free. Our qualified chemistry expert offers the top services when you hire us to do your online chemistry exam so that each student can be assured of his or her academic targets being accomplished with confidence, precision as well and assured outcomes.";

type Platform = {
  key: string;
  name: string;
  description: string;
  logo: import("next/image").StaticImageData;
  alt: string;
};

const DEFAULT_PLATFORMS: Platform[] = [
  {
    key: "canvas",
    name: "Canvas",
    logo: CanvasImg,
    alt: "Canvas logo",
    description:
      "Canvas is a leading LMS used to deliver and manage online courses. We help you navigate Canvas so your chemistry exams, quizzes, and modules stay organized and on track.",
  },
  {
    key: "moodle",
    name: "Moodle",
    logo: MoodleImg,
    alt: "Moodle logo",
    description:
      "Moodle powers countless online chemistry courses worldwide. We guide you through assignments, discussion boards, and timed exams so you can focus on understanding the material.",
  },
  {
    key: "blackboard",
    name: "Blackboard",
    logo: BlackboardImg,
    alt: "Blackboard logo",
    description:
      "Blackboard acts as a digital classroom hub. From tests and homework to announcements and gradebook, we ensure your Blackboard chemistry exams run smoothly.",
  },
  {
    key: "cengage",
    name: "Cengage",
    logo: CengageImg,
    alt: "Cengage logo",
    description:
      "Cengage and platforms like OWLv2/WebAssign make chemistry interactive—but also complex. We support you in mastering problem sets, practice quizzes, and graded assignments inside Cengage.",
  },
  {
    key: "wgu",
    name: "WGU",
    logo: WguImg,
    alt: "WGU logo",
    description:
      "Whether you are balancing work, family, or other commitments, we help you stay on top of competency-based chemistry assessments in WGU’s online environment.",
  },
  {
    key: "study",
    name: "Study.com",
    logo: StudyImg,
    alt: "Study.com logo",
    description:
      "Study.com offers rich video lessons and practice questions. We help you translate that content into strong performance on quizzes, tests, and final chemistry exams.",
  },
];

type AdminPlatform = {
  key: string;
  name?: string;
  description?: string;
  logoUrl?: string;
};

export default function OnlinePlatform() {
  const pageData = usePageData() as { onlinePlatform?: { mainHeading?: string; subHeading?: string; platforms?: AdminPlatform[] } } | null;
  const adminSection = pageData?.onlinePlatform;

  const { mainHeading, subHeading, platforms, useAdminPlatforms } = useMemo(() => {
    const mainHeading =
      (adminSection?.mainHeading && String(adminSection.mainHeading).trim()) ||
      DEFAULT_MAIN_HEADING;
    const subHeading =
      (adminSection?.subHeading && String(adminSection.subHeading).trim()) ||
      DEFAULT_SUB_HEADING;
    const adminPlatforms = Array.isArray(adminSection?.platforms)
      ? adminSection.platforms.filter((p: AdminPlatform) => p?.key != null)
      : [];
    const useAdminPlatforms = adminPlatforms.length > 0;
    const platforms = useAdminPlatforms
      ? adminPlatforms.map((p: AdminPlatform) => ({
          key: String(p.key),
          name: (p.name && String(p.name).trim()) || "",
          description: (p.description && String(p.description).trim()) || "",
          logoUrl: (p.logoUrl && String(p.logoUrl).trim()) || undefined,
        }))
      : DEFAULT_PLATFORMS.map((def) => {
          return {
            ...def,
            name: def.name,
            description: def.description,
          };
        });
    return { mainHeading, subHeading, platforms, useAdminPlatforms };
  }, [adminSection]);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto max-[1320px]:px-4 text-center">
        <div className="max-w-[1104px] mx-auto">
          <h2 className="max-w-[902px] mx-auto text-center text-3xl font-bold leading-tight text-black sm:text-4xl md:text-[36px]">
            {mainHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-center text-sm text-gray-600 sm:text-base">
            {subHeading}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.key}
              className="h-full rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="relative h-10 w-28 flex-shrink-0">
                  {useAdminPlatforms && "logoUrl" in platform && platform.logoUrl ? (
                    <Image
                      src={platform.logoUrl}
                      alt={(platform as AdminPlatform).name || "Platform logo"}
                      fill
                      className="object-contain"
                      sizes="112px"
                    />
                  ) : !useAdminPlatforms && "logo" in platform ? (
                    <Image
                      src={platform.logo}
                      alt={platform.alt}
                      fill
                      className="object-contain"
                      sizes="112px"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                      Logo
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-[15px]">
                {platform.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
