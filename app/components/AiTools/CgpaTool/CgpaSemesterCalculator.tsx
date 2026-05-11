"use client";

import React, { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalculatorState, Semester } from "./types";
import SemesterCard from "./components/SemesterCard";
import { Button, Input } from "./components/ui";
import { createInitialState, createSemester } from "./utils/state";
import { computeAllSemesterTotals } from "./utils/calc";
import {
  buildGpaEmailBody,
  isValidEmail,
  sendGpaEmail,
} from "./utils/gpaEmail";

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

    const body = buildGpaEmailBody(state);
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
            className="md:inline-block hidden"
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
              onCalculateGpa={() => setShowEmailPopup(true)}
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
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setShowEmailPopup(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#323dd6] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              disabled={isSending}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Add your email and we will mail your CGPA result to your mail
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleEmailSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                disabled={isSending}
              />

              <div className="flex justify-end">
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
                    "Get Free CGPA Email"
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
