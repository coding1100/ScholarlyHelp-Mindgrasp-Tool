import { splitSentences, topChunksByQuery } from "@/app/lib/server/study/text";
import { StudyArtifactType } from "@/app/lib/server/study/types";
import { generateGeminiText } from "@/app/lib/server/ai/gemini";

function extractJsonBlock(raw: string) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return raw.trim();
}

function parseJson<T>(raw: string): T {
  return JSON.parse(extractJsonBlock(raw)) as T;
}

async function buildSummary(sourceText: string) {
  const raw = await generateGeminiText({
    systemInstruction:
      "You are an educational summarizer. Return valid JSON only without markdown fences.",
    userPrompt: [
      "Summarize the source text into JSON with this exact shape:",
      '{ "short": "2-3 sentences", "detailed": "single concise paragraph under 220 words" }',
      "Use only facts from source text. Do not invent missing details.",
      "",
      "SOURCE TEXT:",
      sourceText.slice(0, 14000),
    ].join("\n"),
  });
  return parseJson<{ short: string; detailed: string }>(raw);
}

async function buildNotes(sourceText: string) {
  const raw = await generateGeminiText({
    systemInstruction:
      "You are an academic study assistant. Return valid JSON only without markdown fences.",
    userPrompt: [
      "Create AI notes in JSON with shape:",
      '{ "title": "AI Notes", "sections": [ { "heading": "string", "bullets": ["string"] } ] }',
      "Rules:",
      "- 3 to 6 sections",
      "- each section has 3 to 6 concise bullets",
      "- every bullet must come from source text",
      "",
      "SOURCE TEXT:",
      sourceText.slice(0, 16000),
    ].join("\n"),
  });
  return parseJson<{
    title: string;
    sections: Array<{ heading: string; bullets: string[] }>;
  }>(raw);
}

async function buildFlashcards(sourceText: string) {
  const raw = await generateGeminiText({
    systemInstruction:
      "You are a flashcard generator for students. Return valid JSON only without markdown fences.",
    userPrompt: [
      "Generate flashcards as JSON array with each item shape:",
      '{ "id": "card-1", "front": "question", "back": "answer" }',
      "Rules:",
      "- 8 to 12 cards",
      "- no duplicate cards",
      "- questions should be specific and source-grounded",
      "- answers must be factual and concise",
      "",
      "SOURCE TEXT:",
      sourceText.slice(0, 16000),
    ].join("\n"),
  });
  const cards = parseJson<Array<{ id: string; front: string; back: string }>>(raw);
  return cards.map((card, index) => ({
    id: card.id || `card-${index + 1}`,
    front: String(card.front || "").trim(),
    back: String(card.back || "").trim(),
  }));
}

async function buildQuiz(sourceText: string) {
  const raw = await generateGeminiText({
    systemInstruction:
      "You are a quiz generator. Return valid JSON only without markdown fences.",
    userPrompt: [
      "Generate 5 to 8 multiple-choice quiz items from source text.",
      "Return JSON array with each item shape:",
      '{ "id": "quiz-1", "question": "string", "options": ["A","B","C","D"], "correctAnswerIndex": 0, "explanation": "string" }',
      "Rules:",
      "- exactly 4 options each",
      "- correctAnswerIndex must be between 0 and 3",
      "- explanation must be grounded in source text",
      "",
      "SOURCE TEXT:",
      sourceText.slice(0, 16000),
    ].join("\n"),
  });
  const quizzes = parseJson<
    Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswerIndex: number;
      explanation: string;
    }>
  >(raw);
  return quizzes.map((quiz, index) => ({
    id: quiz.id || `quiz-${index + 1}`,
    question: String(quiz.question || "").trim(),
    options:
      Array.isArray(quiz.options) && quiz.options.length === 4
        ? quiz.options.map((option) => String(option))
        : [
            "Insufficient options generated.",
            "Insufficient options generated.",
            "Insufficient options generated.",
            "Insufficient options generated.",
          ],
    correctAnswerIndex:
      typeof quiz.correctAnswerIndex === "number" &&
      quiz.correctAnswerIndex >= 0 &&
      quiz.correctAnswerIndex <= 3
        ? quiz.correctAnswerIndex
        : 0,
    explanation: String(quiz.explanation || "").trim(),
  }));
}

export async function generateArtifact(type: StudyArtifactType, sourceText: string) {
  try {
    switch (type) {
      case "summary":
        return await buildSummary(sourceText);
      case "notes":
        return await buildNotes(sourceText);
      case "flashcards":
        return await buildFlashcards(sourceText);
      case "quizzes":
        return await buildQuiz(sourceText);
      default:
        return { message: "Unsupported generation type." };
    }
  } catch (error) {
    console.error("study.generateArtifact.llm", error);
    const fallbackSentences = splitSentences(sourceText);
    if (type === "summary") {
      return {
        short: fallbackSentences.slice(0, 3).join(" "),
        detailed: fallbackSentences.slice(0, 8).join(" "),
      };
    }
    if (type === "notes") {
      return {
        title: "AI Notes",
        sections: [
          { heading: "Key Concepts", bullets: fallbackSentences.slice(0, 6) },
          { heading: "Important Details", bullets: fallbackSentences.slice(6, 12) },
        ].filter((section) => section.bullets.length > 0),
      };
    }
    if (type === "flashcards") {
      return [
        {
          id: "card-1",
          front: "What is the main idea in your uploaded source?",
          back:
            fallbackSentences[0] ||
            "Upload richer source text to generate stronger, source-grounded flashcards.",
        },
      ];
    }
    if (type === "quizzes") {
      return [
        {
          id: "quiz-1",
          question: "Which statement best reflects your source text?",
          options: [
            fallbackSentences[0] || "Not enough source text.",
            "A contradictory statement.",
            "An unrelated interpretation.",
            "No conclusion can be drawn.",
          ],
          correctAnswerIndex: 0,
          explanation: "The first option is derived directly from your source text.",
        },
      ];
    }
    return { message: "Unsupported generation type." };
  }
}

export async function buildTutorReply(
  sourceChunks: string[],
  prompt: string,
): Promise<{ answer: string; citations: number[] }> {
  const ranked = topChunksByQuery(sourceChunks, prompt, 3);
  const citations = ranked.map((r) => r.index);

  const context = ranked
    .map((item) => `[${item.index}] ${item.chunk}`)
    .join("\n\n");

  if (!context) {
    return {
      answer:
        "I could not find matching source context for this question yet. Please add more source text to the session.",
      citations: [],
    };
  }

  try {
    const answer = await generateGeminiText({
      systemInstruction:
        "You are an academic AI tutor. Answer strictly from provided source context. If unsure, say context is insufficient.",
      userPrompt: [
        "QUESTION:",
        prompt,
        "",
        "SOURCE CONTEXT WITH CITATION IDS:",
        context,
        "",
        "Output concise explanation. Reference citation ids like [12] inline where relevant.",
      ].join("\n"),
      temperature: 0.25,
      maxOutputTokens: 900,
    });
    return { answer, citations };
  } catch (error) {
    console.error("study.buildTutorReply.llm", error);
    const fallbackAnswer = [
      "Based on your uploaded source, here is what I found:",
      ranked.map((item) => `- ${item.chunk}`).join("\n"),
      "I can explain this further, or turn it into notes/flashcards.",
    ].join("\n\n");
    return { answer: fallbackAnswer, citations };
  }
}
