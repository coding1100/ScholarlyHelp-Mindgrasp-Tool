import { CalculatorState } from "../types";
import { computeAllSemesterTotals, computeCumulativeTotals } from "./calc";
import { clampMin, formatGpaMaybe, parseNumberLoose } from "./numbers";

type GpaEmailResponse = {
  success?: boolean;
  message?: string;
};

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Weighted GPA from “previous semesters” rows only (ignores preferences). */
function computePreviousRowsOnlyGpa(state: CalculatorState): number | null {
  let credits = 0;
  let qualityPoints = 0;
  for (const r of state.previousSemesters || []) {
    const creditsRaw = parseNumberLoose(r.credits);
    const gpaRaw = parseNumberLoose(r.gpa);
    if (creditsRaw === null || gpaRaw === null) continue;
    const c = clampMin(creditsRaw, 0);
    const g = clampMin(gpaRaw, 0);
    if (c <= 0) continue;
    credits += c;
    qualityPoints += g * c;
  }
  return credits > 0 ? qualityPoints / credits : null;
}

export function buildGpaEmailBody(state: CalculatorState) {
  const totals = computeCumulativeTotals(state);
  const semesterTotals = computeAllSemesterTotals(state.semesters, state.gradeScale);

  const validSemesterLines = state.semesters
    .map((semester, index) => {
      const found = semesterTotals.find((x) => x.semesterId === semester.id);
      if (!found || found.totals.validCourseCount <= 0) return null;

      const title = semester.title.trim() || `Semester ${index + 1}`;
      return `${title}: ${formatGpaMaybe(found.totals.gpa)}`;
    })
    .filter((line): line is string => Boolean(line));

  const previousDetailLines: string[] = [];
  let prevIdx = 0;
  for (const r of state.previousSemesters || []) {
    prevIdx += 1;
    const creditsRaw = parseNumberLoose(r.credits);
    const gpaRaw = parseNumberLoose(r.gpa);
    if (creditsRaw === null || gpaRaw === null) continue;
    const credits = clampMin(creditsRaw, 0);
    const gpa = clampMin(gpaRaw, 0);
    if (credits <= 0) continue;
    previousDetailLines.push(
      `Previous ${prevIdx}: ${formatGpaMaybe(gpa)} GPA, ${credits} credits`,
    );
  }

  const totalCredits = semesterTotals.reduce(
    (sum, item) => sum + item.totals.totalCredits,
    0,
  );
  const totalQualityPoints = semesterTotals.reduce(
    (sum, item) => sum + item.totals.totalQualityPoints,
    0,
  );

  const lines: string[] = [];

  if (totals.cgpa !== null) {
    const label = totals.previousCredits > 0 ? "Your CGPA is" : "Your GPA is";
    lines.push(`${label} ${formatGpaMaybe(totals.cgpa)}`);
  } else if (validSemesterLines.length > 0 && totalCredits > 0) {
    const gpa = totalQualityPoints / totalCredits;
    lines.push(`Your GPA is ${formatGpaMaybe(gpa)}`);
  } else {
    const prevOnly = computePreviousRowsOnlyGpa(state);
    if (prevOnly !== null) {
      lines.push(`Your CGPA (from previous semesters) is ${formatGpaMaybe(prevOnly)}`);
    }
  }

  if (validSemesterLines.length > 0) {
    lines.push("", "Semester breakdown:");
    lines.push(...validSemesterLines.map((l) => `  ${l}`));
  }

  if (previousDetailLines.length > 0) {
    const included =
      totals.includePrevious && totals.previousCredits > 0 && totals.cgpa !== null;
    lines.push(
      "",
      included
        ? "Previous semesters (included in CGPA above):"
        : "Previous semesters:",
    );
    lines.push(...previousDetailLines.map((l) => `  ${l}`));
  }

  if (lines.length === 0) return "";
  return lines.join("\n").trim();
}

/** Single display GPA for email footer / CRM sync (CGPA when available, else fallbacks). */
export function formatCgpaForEmailAndSync(state: CalculatorState): string {
  const totals = computeCumulativeTotals(state);
  if (totals.cgpa !== null) return formatGpaMaybe(totals.cgpa);
  const prevOnly = computePreviousRowsOnlyGpa(state);
  if (prevOnly !== null) return formatGpaMaybe(prevOnly);
  const semesterTotals = computeAllSemesterTotals(state.semesters, state.gradeScale);
  const tc = semesterTotals.reduce((s, x) => s + x.totals.totalCredits, 0);
  const tqp = semesterTotals.reduce((s, x) => s + x.totals.totalQualityPoints, 0);
  if (tc > 0) return formatGpaMaybe(tqp / tc);
  return "—";
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

