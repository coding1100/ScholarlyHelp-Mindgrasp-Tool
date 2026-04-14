import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function CTASection() {
  return (
    <section className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 px-6 py-10 shadow-sm dark:border-gray-800 dark:bg-gray-850 sm:px-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70rem_50rem_at_20%_0%,rgba(99,102,241,0.16),transparent_60%),radial-gradient(60rem_45rem_at_90%_30%,rgba(99,102,241,0.12),transparent_55%)]"
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Start using AI tools today
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
              Choose a tool, keep momentum, and submit work you feel confident
              about.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/tools/main-tool?start=1"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4f39f6] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#432dd7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f39f6] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 sm:w-auto"
              >
                Try Now <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools/main-tool"
                className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f39f6] focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900 sm:w-auto"
              >
                Open Main Tool
              </Link>
            </div>

            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              No forms, no clutter. Just tools that help you ship better work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
