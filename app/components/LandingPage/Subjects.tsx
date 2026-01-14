"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { usePageData } from "./usePageData";
import { useMemo } from "react";

type SubjectType = {
  src: string;
  label: string;
  url: string;
};

export default function SubjectsSection({
  defaultSubjects,
}: {
  defaultSubjects: SubjectType[];
}) {
  const data = usePageData();
  const subjectsData = data?.subjects;
  const currentPage = usePathname();
  const rawBasePath = currentPage.split("/").slice(0, 2).join("/");
  const basePath = rawBasePath === "/" ? "" : rawBasePath;

  const scrollToQuote = () => {
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      quoteForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isHomePage = currentPage === "/";

  // const defaultSubjects: SubjectType[] = [
  //   {
  //     src: "/assets/Icon/english.png",
  //     label: "English",
  //     url: `${basePath}/english`,
  //   },
  //   { src: "/assets/Icon/math.png", label: "Math", url: `${basePath}/math` },
  //   {
  //     src: "/assets/Icon/anatomyandphysiology.png",
  //     label: "Anatomy and Physiology",
  //     url: `${basePath}/anatomy`,
  //   },
  //   {
  //     src: "/assets/Icon/statistics.png",
  //     label: "Statistics",
  //     url: `${basePath}/statistics`,
  //   },
  //   {
  //     src: "/assets/Icon/hrmclass.png",
  //     label: "HRM Class",
  //     url: `${basePath}/human-resource`,
  //   },
  //   {
  //     src: "/assets/Icon/operationmanagement.png",
  //     label: "Operation Management",
  //     url: `${basePath}/operation-management`,
  //   },
  //   {
  //     src: "/assets/Icon/computerscience.png",
  //     label: "Computer Science",
  //     url: `${basePath}/computer-science`,
  //   },
  //   {
  //     src: "/assets/Icon/accounting.png",
  //     label: "Accounting",
  //     url: `${basePath}/accounting`,
  //   },
  //   {
  //     src: "/assets/Icon/history.png",
  //     label: "History",
  //     url: `${basePath}/history`,
  //   },
  //   {
  //     src: "/assets/Icon/marketing.png",
  //     label: "Marketing",
  //     url: `${basePath}/marketing`,
  //   },
  //   {
  //     src: "/assets/Icon/psychology.png",
  //     label: "Psychology",
  //     url: `${basePath}/psychology`,
  //   },
  //   {
  //     src: "/assets/Icon/philosophy.png",
  //     label: "Philosophy",
  //     url: `${basePath}/philosophy`,
  //   },
  //   {
  //     src: "/assets/Icon/finance.png",
  //     label: "Finance",
  //     url: `${basePath}/finance`,
  //   },
  //   {
  //     src: "/assets/Icon/law.png",
  //     label: "Law",
  //     url: `${basePath}/law`,
  //   },
  //   {
  //     src: "/assets/Icon/economics.png",
  //     label: "Economics",
  //     url: `${basePath}/economics`,
  //   },
  //   {
  //     src: "/assets/Icon/chemistry.png",
  //     label: "Chemistry",
  //     url: `${basePath}/chemistry`,
  //   },
  //   {
  //     src: "/assets/Icon/engineering.png",
  //     label: "Engineering",
  //     url: `${basePath}/engineering`,
  //   },
  //   {
  //     src: "/assets/Icon/linguistics.png",
  //     label: "Linguistics",
  //     url: `${basePath}/linguistics`,
  //   },
  //   {
  //     src: "/assets/Icon/physics.png",
  //     label: "Physics",
  //     url: `${basePath}/physics`,
  //   },
  //   {
  //     src: "/assets/Icon/architecture.png",
  //     label: "Architecture",
  //     url: `${basePath}/architecture`,
  //   },
  //   {
  //     src: "/assets/Icon/pharmacology.png",
  //     label: "Pharmacology",
  //     url: `${basePath}/pharmacology`,
  //   },
  //   {
  //     src: "/assets/Icon/biology.png",
  //     label: "Biology",
  //     url: `${basePath}/biology`,
  //   },
  //   {
  //     src: "/assets/Icon/nursing.png",
  //     label: "Nursing",
  //     url: `${basePath}/nursing`,
  //   },
  //   {
  //     src: "/assets/Icon/organizational-behavior.png",
  //     label: "Organizational Behavior",
  //     url: `${basePath}/organizational-behavior`,
  //   },
  //   {
  //     src: "/assets/Icon/sociology.png",
  //     label: "Sociology",
  //     url: `${basePath}/sociology`,
  //   },
  // ];

  // Use MongoDB subjects if available, otherwise use default
  const subjects = useMemo(() => {
    let subjectsList: SubjectType[] = [];

    if (
      subjectsData?.subjectsContent &&
      Array.isArray(subjectsData.subjectsContent) &&
      subjectsData.subjectsContent.length > 0
    ) {
      subjectsList = subjectsData.subjectsContent
        .map((item: any) => {
          // Extract slug from URL if available
          let url = item.url || "";
          if (url && !url.startsWith("/")) {
            url = `${basePath}${url.startsWith("/") ? "" : "/"}${url}`;
          } else if (!url && item.title) {
            // Generate URL from title if not provided
            const slug = item.title.toLowerCase().replace(/\s+/g, "-");
            url = `${basePath}/${slug}`;
          }

          return {
            src: item.icon || "/assets/Icon/english.png",
            label: item.title || "",
            url: url,
          };
        })
        .filter((s: any) => s.label); // Filter out items without labels
    } else {
      subjectsList = defaultSubjects;
    }

    // Filter out the current page's subject
    return subjectsList.filter(
      (subject: SubjectType) => subject.url !== currentPage
    );
  }, [subjectsData, basePath, currentPage, defaultSubjects]);

  return (
    <section className="pt-[86px] pb-16 bg-[#ECECFC] text-[#2B1C51]">
      <div className="max-w-7xl mx-auto max-[1320px]:px-4 text-center">
        <h2 className="text-[42px] text-[#000] font-bold mb-3">
          {subjectsData?.mainHeading || "Subjects & Majors We Cover"}
        </h2>
        <p className="sm:text-base text-sm text-gray-600 max-w-3xl mx-auto mb-12">
          {subjectsData?.description ||
            "Beyond the subjects listed below, we excel at handling diverse topics effectively. Our expertise knows no bounds, ensuring we're ready for any challenge that comes our way."}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-12">
          {subjects.map((subject: SubjectType, index: number) =>
            subject.url ? (
              <Link key={index} href={subject.url}>
                <div className="bg-[#F2F2FD] rounded-lg p-6 h-[200px] flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-12 h-12 mb-3 relative">
                    <Image
                      src={subject.src}
                      alt={subject.label}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800 text-center sm:text-[23px]">
                    {subject.label}
                  </span>
                </div>
              </Link>
            ) : (
              <div
                key={index}
                className="bg-[#F2F2FD] rounded-lg p-6 h-[200px] flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-12 h-12 mb-3 relative">
                  <Image
                    src={subject.src}
                    alt={subject.label}
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center sm:text-[23px]">
                  {subject.label}
                </span>
              </div>
            )
          )}
        </div>

        <div className="flex justify-center mt-[60px]">
          <button
            type="button"
            onClick={scrollToQuote}
            className="rounded-md px-6 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px]"
          >
            {subjectsData?.ctaText || "Take my online class"}
          </button>
        </div>
      </div>
    </section>
  );
}
