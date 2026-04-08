"use client";

import React, { useMemo } from "react";
import {
  useLanguagePractice,
  LanguagePracticeStep,
} from "@/app/context/LanguagePracticeContext";

function SkillBar({
  label,
  value,
  color = "blue",
}: {
  label: string;
  value: number;
  color?: "blue" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    blue: "bg-[#155dfc]",
    green: "bg-green-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="tabular-nums text-gray-600">{Math.round(value)}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-100">
        <div
          className={[
            "h-3 rounded-full transition-all",
            colorClasses[color],
          ].join(" ")}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function Step8() {
  const {
    language,
    level,
    goals,
    progress,
    setStep,
    callAi,
    isAiBusy,
    history,
  } = useLanguagePractice();

  const overall = useMemo(() => {
    const sum =
      progress.vocabulary +
      progress.grammar +
      progress.conversation +
      progress.pronunciation +
      progress.consistency;
    return sum / 5;
  }, [progress]);

  const activityCounts = useMemo(() => {
    return {
      vocabulary: history.vocabulary.filter((t) => t.role === "user").length,
      grammar: history.grammar.filter((t) => t.role === "user").length,
      conversation: history.conversation.filter((t) => t.role === "user")
        .length,
      pronunciation: history.pronunciation.filter((t) => t.role === "user")
        .length,
    };
  }, [history]);

  const getEncouragement = () => {
    if (overall >= 80) return "Outstanding progress! You're mastering this.";
    if (overall >= 60) return "Great work! Keep practicing to level up.";
    if (overall >= 40) return "Nice start! Consistency is key.";
    return "You're building a strong foundation. Keep going!";
  };

  const getNextAction = (): LanguagePracticeStep => {
    const lowest = [
      { key: "vocabulary", value: progress.vocabulary },
      { key: "grammar", value: progress.grammar },
      { key: "conversation", value: progress.conversation },
      { key: "pronunciation", value: progress.pronunciation },
    ].sort((a, b) => a.value - b.value)[0];

    const stepMap: Record<string, LanguagePracticeStep> = {
      vocabulary: 4,
      grammar: 5,
      conversation: 6,
      pronunciation: 7,
    };

    return stepMap[lowest.key] ?? 4;
  };

  const requestSummary = async () => {
    await callAi({
      area: "progress",
      userInput:
        "Give me an encouraging progress summary with specific feedback and suggested next steps.",
      hint: "Be encouraging, specific, and actionable. Mention strengths and areas to focus on.",
    });
  };

  const lastSummary =
    [...history.progress].reverse().find((t) => t.role === "ai")?.content ?? "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
        <div className="text-sm font-semibold">Your progress dashboard</div>
        <div className="mt-1 text-sm text-gray-600">{getEncouragement()}</div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700">
            <span className="font-semibold">Language:</span>{" "}
            {language ?? "Not set"}
          </span>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700">
            <span className="font-semibold">Level:</span> {level ?? "TBD"}
          </span>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700">
            <span className="font-semibold">Overall:</span>{" "}
            {Math.round(overall)}%
          </span>
        </div>
      </div>

      <Card title="Skills breakdown">
        <div className="space-y-4">
          <SkillBar
            label="Vocabulary"
            value={progress.vocabulary}
            color="blue"
          />
          <SkillBar label="Grammar" value={progress.grammar} color="green" />
          <SkillBar
            label="Conversation"
            value={progress.conversation}
            color="purple"
          />
          <SkillBar
            label="Pronunciation"
            value={progress.pronunciation}
            color="orange"
          />
          <SkillBar
            label="Consistency"
            value={progress.consistency}
            color="blue"
          />
        </div>
      </Card>

      <Card title="Activity summary">
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
            <div className="text-lg font-bold text-gray-800">
              {activityCounts.vocabulary}
            </div>
            <div className="text-gray-600">Vocab practices</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
            <div className="text-lg font-bold text-gray-800">
              {activityCounts.grammar}
            </div>
            <div className="text-gray-600">Grammar lessons</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
            <div className="text-lg font-bold text-gray-800">
              {activityCounts.conversation}
            </div>
            <div className="text-gray-600">Conversations</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
            <div className="text-lg font-bold text-gray-800">
              {activityCounts.pronunciation}
            </div>
            <div className="text-gray-600">Pronunciations</div>
          </div>
        </div>
      </Card>

      <Card title="AI feedback">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Get personalized feedback and next steps.
          </div>
          <button
            type="button"
            onClick={requestSummary}
            disabled={isAiBusy || !language}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition",
              isAiBusy || !language
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900",
            ].join(" ")}
            title={!language ? "Pick a language in Step 1" : undefined}
          >
            {isAiBusy ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              "Get feedback"
            )}
          </button>
        </div>

        {lastSummary ? (
          <div className="mt-3 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
            {lastSummary}
          </div>
        ) : null}
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setStep(7)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(getNextAction())}
          className="rounded-xl bg-[#155dfc] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1447e6]"
        >
          Practice more
        </button>
      </div>
    </div>
  );
}
