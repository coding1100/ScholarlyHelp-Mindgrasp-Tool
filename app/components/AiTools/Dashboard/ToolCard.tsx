import Link from "next/link";
import type { IconType } from "react-icons";
import { FiArrowRight } from "react-icons/fi";

export type ToolCardData = {
  name: string;
  description: string;
  href: string;
  icon: IconType;
  badge?: string;
};

export default function ToolCard({ tool }: { tool: ToolCardData }) {
  const Icon = tool.icon;

  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-850">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 20% 0%, rgba(99,102,241,0.12), transparent 45%)",
        }}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-400/10">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
              {tool.name}
            </h3>
            {/* {tool.badge ? (
              <span className="inline-flex shrink-0 items-center rounded-full border border-indigo-200/70 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">
                {tool.badge}
              </span>
            ) : null} */}
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Click to open
        </div>
        <Link
          href={tool.href}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus-visible:ring-offset-gray-900"
          aria-label={`Use ${tool.name}`}
        >
          Use Tool <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
