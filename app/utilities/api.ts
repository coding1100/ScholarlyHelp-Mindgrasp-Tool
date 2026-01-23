// For client components, we need NEXT_PUBLIC_ prefix
// But we'll also check for server-side env vars as fallback
const getBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_BASE_URL ||
    "https://agentic-platform.namatechnologlies.com/api/v1/public";
  // Remove trailing slash if present
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const BASE_URL = getBaseUrl();
const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY ||
  process.env.API_KEY ||
  "ak_6Mmmq4VJV6GwvTUmd6aOGKR47wMjaBw4i5IxIQ4-UyU";
const AGENT_SLUG = "education.personal_tutor";

export interface ChatResponse {
  conversation_id: string;
  message: string;
  agent_id: string;
}

export interface ChatRequest {
  conversation_id: string | null;
  message: string;
}

export interface ParsedQuestion {
  number: number;
  question: string;
  options: { letter: string; text: string }[];
  answer: string;
}

/**
 * Send a message to the tutor agent
 */
export async function sendChatMessage(
  message: string,
  conversationId: string | null = null
): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/agents/${AGENT_SLUG}/chat`, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      message: message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Parse quiz response from API into structured questions
 */
export function parseQuiz(quizText: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];

  // Split by question markers
  const questionBlocks = quizText.split(/\*\*Question \d+:\*\*/).filter(
    (block) => block.trim().length > 0
  );

  questionBlocks.forEach((block, idx) => {
    const parts = block.split("//").map((p) => p.trim()).filter((p) => p);

    if (parts.length < 5) return; // Need at least question + 4 options + answer

    // First part is the question text
    const questionText = parts[0].replace(/\*\*/g, "").trim();

    // Next 4 parts should be options (A, B, C, D)
    const options: { letter: string; text: string }[] = [];
    for (let i = 1; i < 5; i++) {
      const optionMatch = parts[i].match(/^([A-D])\)\s*(.+)$/);
      if (optionMatch) {
        options.push({
          letter: optionMatch[1],
          text: optionMatch[2].trim(),
        });
      }
    }

    // Last part should be the answer
    let answer = "";
    const answerMatch = parts[parts.length - 1].match(/\*\*Answer:\*\*\s*([A-D])/);
    if (answerMatch) {
      answer = answerMatch[1];
    } else {
      // Try to find answer in the block
      const answerRegex = /\*\*Answer:\*\*\s*([A-D])/;
      const match = block.match(answerRegex);
      if (match) {
        answer = match[1];
      }
    }

    if (questionText && options.length === 4 && answer) {
      questions.push({
        number: idx + 1,
        question: questionText,
        options: options,
        answer: answer,
      });
    }
  });

  return questions;
}

/**
 * Generate quiz questions via API
 */
export async function generateQuiz(
  topic: string,
  difficulty: string,
  numberOfQuestions: number = 5,
  conversationId: string | null = null
): Promise<{ questions: ParsedQuestion[]; conversationId: string }> {
  const message = `Generate a quiz about ${topic} with ${numberOfQuestions} multiple choice questions at ${difficulty} difficulty level. Format each question as: **Question [Number]:** [question text] // A) [option] // B) [option] // C) [option] // D) [option] // **Answer:** [letter]`;

  const response = await sendChatMessage(message, conversationId);
  const parsedQuestions = parseQuiz(response.message);

  return {
    questions: parsedQuestions,
    conversationId: response.conversation_id,
  };
}
