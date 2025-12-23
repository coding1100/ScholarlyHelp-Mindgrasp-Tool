export const examSubjects = [
  "accounting",
  "anatomy",
  "architecture",
  "biology",
  "chemistry",
  "computer-science",
  "economics",
  "engineering",
  "english",
  "finance",
  "history",
  "human-resource",
  "law",
  "linguistics",
  "marketing",
  "math",
  "nursing",
  "nutrition",
  "operation-management",
  "organizational-behavior",
  "philosophy",
  "physics",
  "sociology",
  "statistics",
] as const;

export type ExamSubject = typeof examSubjects[number];

export function isValidExamSubject(subject: string): subject is ExamSubject {
  return examSubjects.includes(subject as ExamSubject);
}
