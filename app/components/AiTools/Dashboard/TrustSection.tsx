import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    quote:
      "The outline + paraphraser combo helped me finish a full paper in one evening without feeling rushed.",
    name: "Amina",
    detail: "Undergrad • Business",
  },
  {
    quote:
      "Clean UI, no distractions. I use the summarizer for readings and the tutor tool when I’m stuck.",
    name: "Daniel",
    detail: "Student • Computer Science",
  },
  {
    quote:
      "The tools feel purpose-built for assignments. It’s fast, consistent, and genuinely helpful.",
    name: "Sofia",
    detail: "Postgrad • Education",
  },
];

export default function TrustSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Trusted by students worldwide
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
            A premium experience that encourages consistent product usage—built
            around real academic workflows.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat value="10,000+" label="Students" />
            <Stat value="120k+" label="Tool runs" />
            <Stat value="4.8/5" label="Avg. rating" />
          </div>

          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-850 dark:text-gray-200">
            <FiStar className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            <FiStar className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            <FiStar className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            <FiStar className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            <FiStar className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-300">
              Based on student feedback (demo)
            </span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-850"
            >
              <blockquote className="text-sm leading-6 text-gray-700 dark:text-gray-200">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t.detail}
                  </div>
                </div>
                <div className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                  Verified
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-850">
      <div className="text-lg font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">
        {label}
      </div>
    </div>
  );
}

