/** Shared pathname helpers for take-my-class landing variants. */

export const TAKE_MY_CLASS_PROFESSOR_PATH = "/take-my-class-professor-does-not-care";
export const TAKE_MY_CLASS_PATH = "/take-my-class";
export const TAKE_MY_CLASS_3_PATH = "/take-my-class-3";

export function normalizePathname(pathname: string | null | undefined): string {
  return (pathname || "").replace(/\/+$/, "") || "/";
}

/** take-my-class, take-my-class-3, and professor (shared landing section UX). */
export function isTakeMyClassLandingPage(pathname: string | null | undefined): boolean {
  const path = normalizePathname(pathname);
  return (
    path === TAKE_MY_CLASS_PATH ||
    path === TAKE_MY_CLASS_3_PATH ||
    path === TAKE_MY_CLASS_PROFESSOR_PATH
  );
}

/** Exact pathname match (with or without trailing slash). */
export function isTakeMyClassLandingPathname(pathname: string | null | undefined): boolean {
  const path = pathname || "";
  return (
    path === "/take-my-class/" ||
    path === "/take-my-class" ||
    path === "/take-my-class-3/" ||
    path === "/take-my-class-3" ||
    path === "/take-my-class-professor-does-not-care/" ||
    path === "/take-my-class-professor-does-not-care"
  );
}

/** take-my-class-3 only (distinct centered header layout). */
export function isTakeMyClass3LandingPage(pathname: string | null | undefined): boolean {
  const path = normalizePathname(pathname);
  return path === TAKE_MY_CLASS_3_PATH;
}

/** Professor variant only (email-only hero form). */
export function isTakeMyClassProfessorLandingPage(
  pathname: string | null | undefined,
): boolean {
  return normalizePathname(pathname) === TAKE_MY_CLASS_PROFESSOR_PATH;
}

/**
 * Header "special route" take-my-class group: original, variant 2, and professor.
 * Excludes take-my-class-3 (handled separately).
 */
export function isTakeMyClassHeaderRoute(pathname: string | null | undefined): boolean {
  const path = normalizePathname(pathname);
  return (
    path === TAKE_MY_CLASS_PATH ||
    path === "/take-my-class-2" ||
    path === TAKE_MY_CLASS_PROFESSOR_PATH
  );
}

/** Legacy substring check used for hero button visibility, DeliveredOn, etc. */
export function pathnameIncludesTakeMyClass(pathname: string | null | undefined): boolean {
  return (pathname || "").includes("/take-my-class");
}
