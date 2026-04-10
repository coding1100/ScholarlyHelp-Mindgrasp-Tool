"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CalculatorState, Semester } from "./types";
import GPAResultCard from "./components/GPAResultCard";
import SemesterCard from "./components/SemesterCard";
import GradeScaleEditor from "./components/GradeScaleEditor";
import { Button } from "./components/ui";
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

export default function CgpaTool() {
  const initial = useMemo(() => createInitialState(), []);
  const [state, setState] = useState<CalculatorState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [activeScreen, setActiveScreen] = useState<"calculator" | "gradeScale">(
    "calculator",
  );

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
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => (s.id === next.id ? next : s)),
    }));
  }

  function addSemester() {
    setState((prev) => ({
      ...prev,
      semesters: [
        ...prev.semesters,
        createSemester(prev.semesters.length + 1, 4),
      ],
    }));
  }

  function removeSemester(id: string) {
    setState((prev) => {
      const next = prev.semesters.filter((s) => s.id !== id);
      // Ensure at least one semester exists.
      return {
        ...prev,
        semesters: next.length ? next : [createSemester(1, 4)],
      };
    });
  }

  function resetAll() {
    const next = createInitialState();
    setState(next);
    clearCgpaToolState();
  }

  return (
    <div className="container overflow-y-auto h-[90vh] mx-auto max-w-[840px] px-4 md:px-8 md:pt-8 2xl:max-w-6xl">
      <div className="bg-white dark:bg-gray-800 overflow-hidden transition-colors duration-300">
        <div className="w-full">
          <div className="mx-auto">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <div className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    CGPA / College GPA Calculator
                  </div>
                  <div className="mt-1 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300">
                    Enter courses by semester. The calculator updates instantly
                    and safely ignores incomplete rows.
                  </div>
                </div>
                {activeScreen === "calculator" ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setActiveScreen("gradeScale")}
                    className="w-full sm:w-auto"
                  >
                    Change grade scale
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {activeScreen === "gradeScale" ? (
                <GradeScaleEditor
                  gradeScale={state.gradeScale}
                  onBack={() => setActiveScreen("calculator")}
                  onChange={(next) =>
                    setState((prev) => ({ ...prev, gradeScale: next }))
                  }
                />
              ) : (
                <>
                  {/* Summary moved to top (no right sidebar) */}
                  <GPAResultCard
                    state={state}
                    onChange={setState}
                    onReset={resetAll}
                  />

                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Semesters
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={addSemester}
                      >
                        Add semester
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={resetAll}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {state.semesters.map((s) => (
                      <div key={s.id} className="space-y-2">
                        <SemesterCard
                          semester={s}
                          gradeScale={state.gradeScale}
                          onChange={setSemester}
                          onRemoveSemester={() => removeSemester(s.id)}
                          disableRemove={state.semesters.length <= 1}
                        />
                        {(() => {
                          const found = semesterTotals.find(
                            (x) => x.semesterId === s.id,
                          );
                          if (!found) return null;
                          if (found.totals.validCourseCount > 0) return null;
                          return (
                            <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
                              Tip: only rows with a grade and positive credits
                              are counted.
                            </div>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
