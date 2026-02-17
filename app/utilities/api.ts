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
 * Parse quiz response from API in "Question X:" or "Question X of Y" format
 * Handles formats like:
 * **Question 1:** or **Question 1 of 2**
 * [question text with possible code blocks]
 * A) [option]
 * B) [option]
 * C) [option]
 * D) [option]
 * **Answer:** [letter]
 */
export function parseQuizFromResponse(quizText: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];

  // Normalize literal \n to actual newlines first
  const normalizedText = quizText.replace(/\\n/g, '\n');

  // Try both formats: "Question X:" and "Question X of Y"
  const questionRegex = /\*\*Question (\d+)(?:\s+of\s+(\d+))?:\*\*/g;
  const questionMatches = Array.from(normalizedText.matchAll(questionRegex));

  if (questionMatches.length === 0) {
    return questions;
  }

  questionMatches.forEach((match, idx) => {
    const questionNumber = parseInt(match[1]);
    const startIndex = match.index! + match[0].length;
    const endIndex = idx < questionMatches.length - 1 
      ? questionMatches[idx + 1].index! 
      : normalizedText.length;

    const questionBlock = normalizedText.substring(startIndex, endIndex).trim();

    // Extract question text (everything before the first option)
    // Options start with A), B), C), or D) on a new line
    const optionStartRegex = /\n([A-D])\)/;
    const optionStartMatch = questionBlock.match(optionStartRegex);
    
    if (!optionStartMatch) {
      // Try without newline (options might be on same line)
      const optionStartRegexInline = /([A-D])\)/;
      const optionStartMatchInline = questionBlock.match(optionStartRegexInline);
      if (!optionStartMatchInline) return;
    }

    const optionStartIndex = optionStartMatch 
      ? questionBlock.indexOf(optionStartMatch[0])
      : questionBlock.search(/[A-D]\)/);
    
    let questionText = questionBlock.substring(0, optionStartIndex).trim();
    
    // Clean up question text (remove extra markdown formatting)
    questionText = questionText
      .replace(/^###?\s*/, '') // Remove ### headers
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/---+/g, '') // Remove horizontal rules
      .replace(/^Question \d+:\s*/, '') // Remove "Question X:" prefix if still present
      .trim();

    // Extract options - find everything between question and answer
    const options: { letter: string; text: string }[] = [];
    
    // Find where the answer section starts
    const answerStartIndex = questionBlock.search(/\*\*Answer:\*\*/i);
    const optionsSection = answerStartIndex > -1 
      ? questionBlock.substring(0, answerStartIndex)
      : questionBlock;
    
    const optionRegex = /^([A-D])\)\s*(.+)$/gm;
    let optionMatch;

    while ((optionMatch = optionRegex.exec(optionsSection)) !== null) {
      options.push({
        letter: optionMatch[1],
        text: optionMatch[2].trim(),
      });
    }

    // Try to find answer
    const answerMatch = questionBlock.match(/\*\*Answer:\*\*\s*([A-D])/i);
    const answer = answerMatch ? answerMatch[1] : '';

    if (questionText && options.length >= 2) {
      questions.push({
        number: questionNumber,
        question: questionText,
        options: options,
        answer: answer, // May be empty if not provided in response
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
