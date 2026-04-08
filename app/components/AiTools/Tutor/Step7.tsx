"use client";

import { ParsedQuestion } from "@/app/utilities/api";
import { useState, useMemo } from "react";

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectQuestionNumbers: number[];
}

interface Step7Props {
  topic: string;
  difficulty: string;
  questions: ParsedQuestion[];
  onComplete?: (result: QuizResult) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string; // For multiple choice, this is the option letter (A, B, C, D)
  correctAnswerText?: string; // For type answer mode
  feedback: {
    correct: string;
    incorrect: string;
  };
}

type AnswerType = "multiple-choice" | "type-answer";

export default function Step7({
  topic,
  difficulty,
  questions: parsedQuestions,
  onComplete,
}: Step7Props) {
  // Convert ParsedQuestion[] to Question[] format
  const questions: Question[] = useMemo(() => {
    return parsedQuestions.map((pq) => ({
      id: pq.number,
      question: pq.question,
      options: pq.options.map((opt) => opt.text),
      correctAnswer: pq.answer,
      correctAnswerText: pq.options.find((opt) => opt.letter === pq.answer)
        ?.text,
      feedback: {
        correct: "Your answer is correct! Great job!",
        incorrect: `The correct answer is ${pq.answer}) ${pq.options.find((opt) => opt.letter === pq.answer)?.text}. Please review and try again.`,
      },
    }));
  }, [parsedQuestions]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerType, setAnswerType] = useState<AnswerType>("multiple-choice");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    correct: number[];
    incorrect: number[];
  }>({ correct: [], incorrect: [] });

  // Safety check: if no questions, show error
  if (questions.length === 0) {
    return (
      <div className="h-[calc(100vh-9vh)] overflow-y-auto">
        <div className="flex items-center justify-center p-4 bg-linear-to-br from-gray-100 to-gray-200">
          <div className="w-full max-w-2xl relative">
            <div className="backdrop-blur-xl bg-[#ffffff]/30 border border-white/40 rounded-3xl p-8 shadow-2xl">
              <div className="relative z-10">
                <p className="text-xl font-semibold text-black text-center mb-3 leading-tight">
                  No Questions Available
                </p>
                <p className="text-gray-600 text-center text-sm">
                  Quiz questions could not be loaded. Please try again.
                </p>
              </div>
            </div>
          </div>
        </div></div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswerTypeChange = (type: AnswerType) => {
    if (!isSubmitted) {
      setAnswerType(type);
      setSelectedOption(null);
      setTypedAnswer("");
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!isSubmitted) {
      setSelectedOption(option);
      // Auto-submit on selection
      const isAnswerCorrect = option === currentQuestion.correctAnswer;
      setIsCorrect(isAnswerCorrect);
      setIsSubmitted(true);
    }
  };

  const handleSubmit = () => {
    if (answerType === "multiple-choice") {
      if (selectedOption) {
        const isAnswerCorrect =
          selectedOption === currentQuestion.correctAnswer;
        setIsCorrect(isAnswerCorrect);
        setIsSubmitted(true);
      }
    } else {
      if (typedAnswer.trim()) {
        // For type answer, we'll check if it matches (case-insensitive, trimmed)
        const normalizedTyped = typedAnswer.trim().toLowerCase();
        const normalizedCorrect = currentQuestion.correctAnswerText
          ?.toLowerCase()
          .trim();
        const isAnswerCorrect =
          normalizedTyped === normalizedCorrect ||
          normalizedTyped.includes(normalizedCorrect || "") ||
          (normalizedCorrect || "").includes(normalizedTyped);
        setIsCorrect(isAnswerCorrect);
        setIsSubmitted(true);
      }
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setTypedAnswer("");
    // Remove previous result for this question if any
    const questionNumber = currentQuestionIndex + 1;
    setQuizResults((prev) => ({
      correct: prev.correct.filter((n) => n !== questionNumber),
      incorrect: prev.incorrect.filter((n) => n !== questionNumber),
    }));
    // Allow switching answer type after try again
  };

  const handleNextQuestion = () => {
    // Record result for current question
    const questionNumber = currentQuestionIndex + 1;

    if (currentQuestionIndex < totalQuestions - 1) {
      // Update results and move to next question
      setQuizResults((prev) => {
        const updated = { ...prev };
        // Remove from both arrays first
        updated.correct = updated.correct.filter((n) => n !== questionNumber);
        updated.incorrect = updated.incorrect.filter(
          (n) => n !== questionNumber
        );
        // Add to correct array
        if (isCorrect) {
          updated.correct.push(questionNumber);
        } else {
          updated.incorrect.push(questionNumber);
        }
        return updated;
      });

      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
      setIsCorrect(false);
      setSelectedOption(null);
      setTypedAnswer("");
      setAnswerType("multiple-choice");
    } else {
      // Quiz complete - calculate final results
      setQuizResults((prev) => {
        const updated = { ...prev };
        // Remove from both arrays first
        updated.correct = updated.correct.filter((n) => n !== questionNumber);
        updated.incorrect = updated.incorrect.filter(
          (n) => n !== questionNumber
        );
        // Add to correct array
        if (isCorrect) {
          updated.correct.push(questionNumber);
        } else {
          updated.incorrect.push(questionNumber);
        }

        // Call onComplete with final results
        onComplete?.({
          totalQuestions,
          correctAnswers: updated.correct.length,
          incorrectQuestionNumbers: updated.incorrect,
        });

        return updated;
      });
    }
  };

  const canSwitchAnswerType = !isSubmitted;

  return (
    <div className="h-[calc(100vh-9vh)] overflow-y-auto">
      <div className="p-4 bg-linear-to-br from-gray-100 to-gray-200">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-6 sm:flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black text-center mb-3 leading-tight">
            {topic} - {difficulty}
          </h2>
          <p className="text-lg text-center mb-3 leading-tight text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>

        {/* Main Glassmorphism Card */}
        <div className="max-w-5xl mx-auto relative">
          <div className="backdrop-blur-xl bg-[#ffffff]/30 border border-white/40 rounded-3xl p-8 shadow-2xl">
            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/20 to-transparent pointer-events-none" />

            <div className="relative z-10">
              {/* Question Section */}
              <div className="mb-6">
                <div className="sm:flex items-start justify-between gap-4 mb-4">
                  <p className="text-lg text-black flex-1 leading-relaxed">
                    {currentQuestion.question}
                  </p>
                  {/* <button
                    className="sm:ml-0 ml-auto px-4 py-2 rounded-xl bg-[#ffffff]/40 backdrop-blur-md border border-[#d1d5dc]/50 text-black text-sm font-medium hover:bg-[#ffffff]/50 transition-all flex items-center gap-2 whitespace-nowrap"
                    disabled
                  >
                    <span>🔊</span> Listen
                  </button> */}
                </div>

                {/* Answer Type Toggle */}
                <div className="sm:grid grid-cols-2 gap-0 mb-6 w-full">
                  <button
                    onClick={() => handleAnswerTypeChange("multiple-choice")}
                    disabled={!canSwitchAnswerType}
                    className={`sm:col-span-1 w-full sm:w-auto px-8 py-2 sm:rounded-tr-none sm:rounded-bl-lg sm:rounded-tl-lg sm:rounded-br-none font-semibold text-sm transition-all ${answerType === "multiple-choice"
                      ? "bg-[#2b7fff] text-white shadow-lg shadow-[#2b7fff]/30"
                      : "bg-[#ffffff]/40 backdrop-blur-md border border-[#d1d5dc]/50 text-black"
                      } ${!canSwitchAnswerType
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#ffffff] hover:text-[#333333] cursor-pointer"
                      }`}
                  >
                    Multiple Choice
                  </button>
                  <button
                    onClick={() => handleAnswerTypeChange("type-answer")}
                    disabled={!canSwitchAnswerType}
                    className={`sm:col-span-1 w-full sm:w-auto px-8 py-2 sm:rounded-tr-lg sm:rounded-bl-none sm:rounded-tl-none sm:rounded-br-lg font-semibold text-sm transition-all ${answerType === "type-answer"
                      ? "bg-[#2b7fff] text-white shadow-lg shadow-[#2b7fff]/30"
                      : "bg-[#ffffff]/40 backdrop-blur-md border border-[#d1d5dc]/50 text-black"
                      } ${!canSwitchAnswerType
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#ffffff] hover:text-[#333333] cursor-pointer"
                      }`}
                  >
                    Type Answer
                  </button>
                </div>

                {/* Multiple Choice Options */}
                {answerType === "multiple-choice" && (
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, index) => {
                      const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                      const isSelected = selectedOption === optionLetter;
                      const isCorrectOption =
                        optionLetter === currentQuestion.correctAnswer;
                      const showFeedback = isSubmitted;

                      return (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(optionLetter)}
                          disabled={isSubmitted}
                          className={`w-full p-4 rounded-xl text-left transition-all ${showFeedback
                            ? isCorrect && isSelected
                              ? "bg-[#00c951]/30 border-2 border-[#00c951] shadow-lg shadow-[#00c951]/30"
                              : isSelected && !isCorrect
                                ? "bg-[#fb2c36]/30 border-2 border-[#fb2c36] shadow-lg shadow-[#fb2c36]/30"
                                : "bg-[#ffffff]/40 backdrop-blur-md border border-[#d1d5dc]/50"
                            : isSelected
                              ? "bg-[#2b7fff]/30 border-2 border-[#2b7fff]"
                              : "bg-[#ffffff]/40 backdrop-blur-md border border-[#d1d5dc]/50 hover:border-[#99a1af]/50"
                            } ${!isSubmitted
                              ? "hover:scale-[1.01] cursor-pointer"
                              : "cursor-default"
                            }`}
                        >
                          <span className="text-black font-medium">
                            {optionLetter}) {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Type Answer Input */}
                {answerType === "type-answer" && (
                  <div className="mb-6 w-full">
                    <div className="sm:flex gap-4 w-full">
                      <input
                        type="text"
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            !isSubmitted &&
                            typedAnswer.trim()
                          ) {
                            handleSubmit();
                          }
                        }}
                        disabled={isSubmitted}
                        placeholder="Type your answer here..."
                        className="sm:flex-1 w-full px-4 py-4 rounded-xl bg-[#ffffff]/40 backdrop-blur-md border border-[#d1d5dc]/50 text-black placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/50 focus:border-[#2b7fff]/50 transition-all text-base disabled:opacity-50"
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitted || !typedAnswer.trim()}
                        className="sm:px-8 w-full sm:w-auto px-4 sm:py-4 py-2 sm:mt-0 mt-2 rounded-xl bg-[#2b7fff] hover:bg-[#155dfc] disabled:bg-[#99a1af] disabled:cursor-not-allowed text-white font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer whitespace-nowrap"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {isSubmitted && (
                  <div
                    className={`p-6 rounded-xl mb-6 ${isCorrect
                      ? "bg-[#00c951]/30 border-2 border-[#00c951] shadow-lg shadow-[#00c951]/30"
                      : "bg-[#fb2c36]/30 border-2 border-[#fb2c36] shadow-lg shadow-[#fb2c36]/30"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{isCorrect ? "✓" : "✗"}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-black mb-2">
                          {isCorrect
                            ? "Great job! That's correct!"
                            : "AI Feedback:"}
                        </h3>
                        <p className="text-black">
                          {isCorrect
                            ? currentQuestion.feedback.correct
                            : currentQuestion.feedback.incorrect}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {isSubmitted && (
                  <div className="flex justify-end gap-4">
                    {!isCorrect && (
                      <button
                        onClick={handleTryAgain}
                        className="px-8 py-2 rounded-lg bg-[#ff6900] hover:bg-[#f54a00] text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
                      >
                        TRY AGAIN
                      </button>
                    )}
                    {isCorrect && (
                      <button
                        onClick={handleNextQuestion}
                        className="px-8 py-2 rounded-lg bg-[#2b7fff] hover:bg-[#155dfc] text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
                      >
                        {currentQuestionIndex < totalQuestions - 1
                          ? "NEXT QUESTION"
                          : "COMPLETE QUIZ"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div></div>
  );
}
