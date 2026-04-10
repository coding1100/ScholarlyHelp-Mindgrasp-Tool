export type GradeLetter = string;

export type GradeScale = {
  letters: GradeLetter[];
  pointsByLetter: Record<GradeLetter, number>;
};

export type Course = {
  id: string;
  name: string;
  gradeLetter: GradeLetter | "";
  credits: string; // controlled input: keep raw string for UX
};

export type Semester = {
  id: string;
  title: string;
  courses: Course[];
};

export type CalculatorPreferences = {
  includePreviousInCgpa: boolean;
  currentSemesterOnly: boolean;
};

export type PreviousSemesterGpa = {
  id: string;
  credits: string; // controlled input
  gpa: string; // controlled input
};

export type CalculatorState = {
  gradeScale: GradeScale;
  semesters: Semester[];
  previousSemesters: PreviousSemesterGpa[];
  preferences: CalculatorPreferences;
};

