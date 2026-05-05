"use client";

import React, { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalculatorState, Semester } from "./types";
import SemesterCard from "./components/SemesterCard";
import { Button, Input } from "./components/ui";
import { createInitialState, createSemester } from "./utils/state";
import { computeAllSemesterTotals, SemesterTotals } from "./utils/calc";
import { formatGpaMaybe } from "./utils/numbers";

type GpaEmailResponse = {
  success?: boolean;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildGpaEmailBody(
  state: CalculatorState,
  semesterTotals: Array<{ semesterId: string; totals: SemesterTotals }>,
) {
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
  return [`Your GPA is ${formatGpaMaybe(gpa)}`, ...validSemesterLines].join(
    "\n",
  );
}

async function sendGpaEmail({
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
    throw new Error(
      "Unable to connect. Please check your internet and try again.",
    );
  }

  let data: GpaEmailResponse = {};
  try {
    data = (await res.json()) as GpaEmailResponse;
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(
      data?.message || "Failed to send GPA email. Please try again.",
    );
  }

  return data;
}

export default function CgpaSemesterCalculator() {
  const initial = useMemo(() => createInitialState(), []);
  const [state, setState] = useState<CalculatorState>(initial);
  const [showResults, setShowResults] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const semesterTotals = useMemo(
    () => computeAllSemesterTotals(state.semesters, state.gradeScale),
    [state.semesters, state.gradeScale],
  );

  function setSemester(next: Semester) {
    setShowResults(false);
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => (s.id === next.id ? next : s)),
    }));
  }

  function addSemester() {
    setShowResults(false);
    setState((prev) => ({
      ...prev,
      semesters: [
        ...prev.semesters,
        createSemester(prev.semesters.length + 1, 4),
      ],
    }));
  }

  function removeSemester(id: string) {
    setShowResults(false);
    setState((prev) => {
      const next = prev.semesters.filter((s) => s.id !== id);

      return {
        ...prev,
        semesters: next.length ? next : [createSemester(1, 4)],
      };
    });
  }

  function resetAll() {
    const next = createInitialState();
    setState(next);
    setShowResults(false);
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const body = buildGpaEmailBody(state, semesterTotals);
    if (!body.trim()) {
      toast.error("Please add at least one course with a grade and credits.");
      return;
    }

    if (body.length > 10000) {
      toast.error("GPA result is too long to send.");
      return;
    }

    setIsSending(true);
    try {
      const data = await sendGpaEmail({
        email: trimmedEmail,
        body,
        subject: "Your GPA Result",
      });
      toast.success(data.message || "Email sent successfully.");
      setEmail("");
      setShowEmailPopup(false);
      setShowResults(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send GPA email",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Semesters
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="primary"
            onClick={() => setShowEmailPopup(true)}
          >
            Calculate GPA
          </Button>
          <Button type="button" variant="secondary" onClick={addSemester}>
            Add semester
          </Button>
          <Button type="button" variant="secondary" onClick={resetAll}>
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {state.semesters.map((semester) => (
          <div key={semester.id} className="space-y-2">
            <SemesterCard
              semester={semester}
              gradeScale={state.gradeScale}
              onChange={setSemester}
              onRemoveSemester={() => removeSemester(semester.id)}
              disableRemove={state.semesters.length <= 1}
              showResults={showResults}
            />
            {(() => {
              if (!showResults) return null;
              const found = semesterTotals.find(
                (x) => x.semesterId === semester.id,
              );
              if (!found || found.totals.validCourseCount > 0) return null;

              return (
                <div className="px-1 text-xs text-slate-500 dark:text-slate-400">
                  Tip: only rows with a grade and positive credits are counted.
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      {showEmailPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-950">
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Add your email and we will mail your CGPA result to your mail
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={handleEmailSubmit}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                disabled={isSending}
              />

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowEmailPopup(false)}
                  disabled={isSending}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSending}>
                  {isSending ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
