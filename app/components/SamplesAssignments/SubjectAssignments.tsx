"use client";

import { FC, useState } from "react";
import { usePathname } from "next/navigation";
import SampleSubjectCard from "./SampleSubjectCard";

interface SubjectAssignmentsProps {
  subjectContent: any;
  mainTitle: string;
  description: string;
}
const SubjectAssignments: FC<SubjectAssignmentsProps> = ({
  subjectContent,
  mainTitle,
  description,
}) => {
  const currentPage = usePathname();
  return (
    <section className="mt-10" aria-label={mainTitle}>
      <h2 className="md:text-5xl sm:text-3xl text-xl text-[#000] font-bold text-center mt-16 mb-6">
        {mainTitle}
      </h2>
      <div
        className="max-w-4xl mx-auto text-center text-[#4B5563] mb-12 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="grid grid-cols-12 gap-4">
        {subjectContent.map((item: any, index: any) => (
          <article key={index} className="md:col-span-4 sm:col-span-6 col-span-12 border border-[#C7C8C9] rounded py-5 px-4">
            <SampleSubjectCard content={item} />
          </article>
        ))}
      </div>
    </section>
  );
};

export default SubjectAssignments;
