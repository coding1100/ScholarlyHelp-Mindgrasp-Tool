import { FiCheckCircle, FiClock, FiShield, FiTrendingUp } from "react-icons/fi";

const features = [
  {
    title: "Save Time on Assignments",
    description:
      "Generate drafts, outlines, and summaries in minutes—so you can focus on understanding, not formatting.",
    icon: FiClock,
  },
  {
    title: "Improve Writing Quality",
    description:
      "Get clearer structure, stronger phrasing, and more polished academic tone across every section.",
    icon: FiTrendingUp,
  },
  {
    title: "AI-Powered Academic Assistance",
    description:
      "Use purpose-built tools for research questions, citations, and study workflows—without clutter.",
    icon: FiCheckCircle,
  },
  {
    title: "Trustworthy by Design",
    description:
      "A calm interface, consistent UI patterns, and accessible interactions that feel premium and reliable.",
    icon: FiShield,
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-y border-gray-200 bg-gray-50/60 dark:border-gray-800 dark:bg-gray-900/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Designed for focused academic work
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
            Everything is structured to reduce decision fatigue and keep you in
            flow—from your first idea to final submission.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-400/10">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {f.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

