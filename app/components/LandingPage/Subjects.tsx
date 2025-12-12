"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { usePageData } from "./usePageData";
import { useMemo } from "react";

export default function SubjectsSection() {
  const data = usePageData();
  const subjectsData = data?.subjects;
  const currentPage = usePathname();
  const basePath = currentPage.split("/").slice(0, 2).join("/");

  const scrollToQuote = () => {
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      quoteForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isHomePage = currentPage === "/";

  type SubjectType = {
    src: string;
    label: string;
    url: string;
  };

  const defaultSubjects: SubjectType[] = [
    {
      src: "/assets/Icon/english.png",
      label: "English",
      url: `${basePath}/english`,
    },
    { src: "/assets/Icon/math.png", label: "Math", url: `${basePath}/math` },
    {
      src: "/assets/Icon/anatomyandphysiology.png",
      label: "Anatomy and Physiology",
      url: `${basePath}/anatomy`,
    },
    {
      src: "/assets/Icon/statistics.png",
      label: "Statistics",
      url: `${basePath}/statistics`,
    },
    {
      src: "/assets/Icon/hrmclass.png",
      label: "HRM Class",
      url: `${basePath}/human-resource`,
    },
    {
      src: "/assets/Icon/operationmanagement.png",
      label: "Operation Management",
      url: `${basePath}/operation-management`,
    },
    {
      src: "/assets/Icon/computerscience.png",
      label: "Computer Science",
      url: `${basePath}/computer-science`,
    },
    {
      src: "/assets/Icon/accounting.png",
      label: "Accounting",
      url: `${basePath}/accounting`,
    },
    {
      src: "/assets/Icon/history.png",
      label: "History",
      url: `${basePath}/history`,
    },
    {
      src: "/assets/Icon/marketing.png",
      label: "Marketing",
      url: `${basePath}/marketing`,
    },
    { src: "/assets/Icon/psychology.png", label: "Psychology", url: `` },
    {
      src: "/assets/Icon/philosophy.png",
      label: "Philosophy",
      url: `${basePath}/philosophy`,
    },
  ];
  
  // Use MongoDB subjects if available, otherwise use default
  const subjects = useMemo(() => {
    if (subjectsData?.subjectsContent && Array.isArray(subjectsData.subjectsContent) && subjectsData.subjectsContent.length > 0) {
      return subjectsData.subjectsContent.map((item: any) => {
        // Extract slug from URL if available
        let url = item.url || '';
        if (url && !url.startsWith('/')) {
          url = `${basePath}${url.startsWith('/') ? '' : '/'}${url}`;
        } else if (!url && item.title) {
          // Generate URL from title if not provided
          const slug = item.title.toLowerCase().replace(/\s+/g, '-');
          url = `${basePath}/${slug}`;
        }
        
        return {
          src: item.icon || "/assets/Icon/english.png",
          label: item.title || '',
          url: url
        };
      }).filter((s: any) => s.label); // Filter out items without labels
    }
    return defaultSubjects;
  }, [subjectsData, basePath]);

  return ( 
    <section className="pt-[86px] pb-16 bg-[#ECECFC] text-[#2B1C51]">
      <div className="max-w-7xl mx-auto max-[1320px]:px-8 text-center">
        <h2 className="text-[42px] text-[#000] font-bold mb-3">
          {subjectsData?.mainHeading || "Subjects & Majors We Cover"}
        </h2>
        <p className="sm:text-base text-sm text-gray-600 max-w-3xl mx-auto mb-12">
          {subjectsData?.description || "Beyond the subjects listed below, we excel at handling diverse topics effectively. Our expertise knows no bounds, ensuring we're ready for any challenge that comes our way."}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
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
          {isHomePage ? (
            <button
              type="button"
              onClick={scrollToQuote}
              className="rounded-md px-3 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] md:w-64 w-48"
            >
              Take my online class
            </button>
          ) : (
            <Link href="/#quote-form">
              <button
                type="button"
                className="rounded-md px-3 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] md:w-64 w-48"
              >
                Take my online class
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
