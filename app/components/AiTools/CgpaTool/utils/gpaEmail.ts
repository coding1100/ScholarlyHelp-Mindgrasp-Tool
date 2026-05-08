import { CalculatorState } from "../types";
import { computeAllSemesterTotals, SemesterTotals } from "./calc";
import { formatGpaMaybe } from "./numbers";

type GpaEmailResponse = {
  success?: boolean;
  message?: string;
};

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function buildGpaEmailBody(state: CalculatorState) {
  const semesterTotals = computeAllSemesterTotals(state.semesters, state.gradeScale);

  const validSemesterLines = state.semesters
    .map((semester, index) => {
      const found = semesterTotals.find((x) => x.semesterId === semester.id);
      if (!found || found.totals.validCourseCount <= 0) return null;

      const title = semester.title.trim() || `Semester ${index + 1}`;
      return `${title}: ${formatGpaMaybe(found.totals.gpa)}`;
    })
    .filter((line): line is string => Boolean(line));

  const totalCredits = semesterTotals.reduce(
    (sum, item) => sum + item.totals.totalCredits,
    0,
  );
  const totalQualityPoints = semesterTotals.reduce(
    (sum, item) => sum + item.totals.totalQualityPoints,
    0,
  );

  if (totalCredits <= 0 || validSemesterLines.length === 0) return "";

  const gpa = totalQualityPoints / totalCredits;
  return [`Your GPA is ${formatGpaMaybe(gpa)}`, ...validSemesterLines].join("\n");
}

export async function sendGpaEmail({
  email,
  body,
  subject,
}: {
  email: string;
  body: string;
  subject?: string;
}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_NGROX_URL?.replace(/\/$/, "");
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured");
  }

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/tools/gpa-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, body, subject }),
    });
  } catch {
    throw new Error("Unable to connect. Please check your internet and try again.");
  }

  let data: GpaEmailResponse = {};
  try {
    data = (await res.json()) as GpaEmailResponse;
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.message || "Failed to send GPA email. Please try again.");
  }

  return data;
}

