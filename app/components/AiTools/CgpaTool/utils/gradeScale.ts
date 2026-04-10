import { GradeScale } from "../types";

// Keep this configurable so you can later support A+ / 4.33 / weighted scales.
export const DEFAULT_GRADE_SCALE: GradeScale = {
  letters: ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"],
  pointsByLetter: {
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
  },
};

export function getGradePoints(scale: GradeScale, letter: string) {
  const v = scale.pointsByLetter[letter];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

