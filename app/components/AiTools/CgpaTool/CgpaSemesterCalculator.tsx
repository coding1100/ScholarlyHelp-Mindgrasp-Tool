"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CalculatorState, Semester } from "./types";
import SemesterCard from "./components/SemesterCard";
import { Button, Input } from "./components/ui";
import {
  clearCgpaToolState,
  loadCgpaToolState,
  saveCgpaToolState,
} from "./utils/storage";
import {
  createInitialState,
  createSemester,
  normalizeLoadedState,
} from "./utils/state";
import { computeAllSemesterTotals } from "./utils/calc";

export default function CgpaSemesterCalculator() {
  const initial = useMemo(() => createInitialState(), []);
  const [state, setState] = useState<CalculatorState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loaded = loadCgpaToolState();
    if (loaded) setState(normalizeLoadedState(loaded, initial));
    setHydrated(true);
  }, [initial]);

  useEffect(() => {
    if (!hydrated) return;
    saveCgpaToolState(state);
  }, [state, hydrated]);

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
    clearCgpaToolState();
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
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
              />

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowEmailPopup(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
