"use client";

import { FC, useState } from "react";
import { usePathname } from "next/navigation";
import SampleSubjectCard from "./SampleSubjectCard";

interface SubjectAssignmentsProps {
  subjectContent: any;
  mainTitle: string;
}
const SubjectAssignments: FC<SubjectAssignmentsProps> = ({
  subjectContent,
  mainTitle,
}) => {
  const currentPage = usePathname();
  return (
    <section className="mt-10" aria-label={mainTitle}>
      <h2 className="md:text-5xl sm:text-3xl text-xl text-[#000] font-bold text-center my-16">
        {mainTitle}
      </h2>
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
