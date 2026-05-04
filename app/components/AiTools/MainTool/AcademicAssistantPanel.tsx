"use client";

import React, { useContext, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { HiOutlineXMark } from "react-icons/hi2";
import {
  HiOutlineBookOpen,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";
import { EditorContext, TitleContext } from "./MainToolLayout";
import { sendChatMessage } from "@/app/utilities/api";

export type AssistantPanel = "documents" | "library" | "chat" | "review";

type AcademicAssistantPanelProps = {
  activePanel: Exclude<AssistantPanel, "documents">;
  onClose: () => void;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const getDocumentText = (editor: any | null) => {
  if (!editor) return "";
  return String(editor.state?.doc?.textContent || "").trim();
};

const PanelHeader = ({
  icon,
  title,
  subtitle,
  onClose,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClose: () => void;
}) => (
  <div className="border-b border-gray-200 px-4 py-3">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-primary-400">{icon}</span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="mt-0.5 text-xs leading-5 text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close panel"
        className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      >
        <HiOutlineXMark className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const AcademicAssistantPanel: React.FC<AcademicAssistantPanelProps> = ({
  activePanel,
  onClose,
}) => {
  const { editor } = useContext(EditorContext);
  const { title } = useContext(TitleContext);
  const [sources, setSources] = useState<
    Array<{ id: string; title: string; kind: string }>
  >([
    { id: "sample-1", title: "Class notes or PDFs you upload appear here", kind: "Library" },
  ]);
  const [sourceTitle, setSourceTitle] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask about your draft, request a paragraph, find research angles, or ask for citation suggestions.",
    },
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const documentText = getDocumentText(editor);
  const wordCount = useMemo(
    () => documentText.split(/\s+/).filter(Boolean).length,
    [documentText],
  );

  const handleAddSource = (kind: string, titleValue = sourceTitle) => {
    const nextTitle = titleValue.trim();
    if (!nextTitle) return;
    setSources((prev) => [
      { id: `${Date.now()}`, title: nextTitle, kind },
      ...prev,
    ]);
    setSourceTitle("");
    toast.success("Source added to library");
  };

  const handleSendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: "user", content: message },
    ]);
    setChatLoading(true);

    try {
      const response = await sendChatMessage(
        `You are an academic research writing assistant. Document title: ${
          title || "Untitled"
        }.\n\nCurrent draft:\n${documentText || "(empty draft)"}\n\nUser request:\n${message}`,
        conversationId,
      );
      setConversationId(response.conversation_id || conversationId);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: response.message,
        },
      ]);
    } catch (error) {
      toast.error("AI chat failed. Please try again.");
      setChatMessages((prev) => prev.filter((item) => item.content !== message));
    } finally {
      setChatLoading(false);
    }
  };

  const handleReview = async () => {
    if (!documentText) {
      toast.error("Add content to the document before running review.");
      return;
    }

    setReviewLoading(true);
    try {
      const response = await sendChatMessage(
        `Review this academic draft. Return concise feedback with strengths, missing evidence, clarity issues, citation opportunities, and next steps.\n\nTitle: ${
          title || "Untitled"
        }\n\nDraft:\n${documentText}`,
      );
      setReviewText(response.message);
    } catch (error) {
      toast.error("Review failed. Please try again.");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <aside className="hidden lg:flex h-screen w-[20rem] xl:w-[24rem] flex-col border-r border-gray-200 bg-white">
      {activePanel === "library" && (
        <>
          <PanelHeader
            icon={<HiOutlineBookOpen className="h-5 w-5" />}
            title="Library"
            subtitle="Collect sources for citations and research context."
            onClose={onClose}
          />
          <div className="flex-1 overflow-auto p-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <label className="text-xs font-medium text-gray-700">
                Add source
              </label>
              <input
                value={sourceTitle}
                onChange={(event) => setSourceTitle(event.target.value)}
                placeholder="Paste a URL, DOI, book title, or note"
                className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddSource("Manual")}
                  className="rounded-md bg-primary-400 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-500"
                >
                  Add source
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Upload file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleAddSource("Upload", file.name);
                  }}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="rounded-lg border border-gray-200 bg-white p-3"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {source.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{source.kind}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activePanel === "chat" && (
        <>
          <PanelHeader
            icon={<HiOutlineChatBubbleLeftRight className="h-5 w-5" />}
            title="AI Chat"
            subtitle="Ask questions and generate research help from your draft."
            onClose={onClose}
          />
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl px-3 py-2 text-sm leading-6 ${
                    message.role === "assistant"
                      ? "bg-primary-100 text-gray-800"
                      : "bg-primary-400 text-white"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ))}
              {chatLoading && (
                <div className="rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-500">
                  Thinking...
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 p-3">
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendChat();
                }
              }}
              placeholder="Ask AI about your paper..."
              className="h-20 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
            />
            <button
              type="button"
              onClick={() => void handleSendChat()}
              disabled={!chatInput.trim() || chatLoading}
              className="mt-2 w-full rounded-md bg-primary-400 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Send
            </button>
          </div>
        </>
      )}

      {activePanel === "review" && (
        <>
          <PanelHeader
            icon={<HiOutlineClipboardDocumentCheck className="h-5 w-5" />}
            title="Review"
            subtitle="Check clarity, structure, and citation opportunities."
            onClose={onClose}
          />
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-primary-100 p-3">
                <p className="text-xs text-gray-500">Words</p>
                <p className="text-xl font-semibold text-primary-500">
                  {wordCount}
                </p>
              </div>
              <div className="rounded-xl bg-primary-100 p-3">
                <p className="text-xs text-gray-500">Sources</p>
                <p className="text-xl font-semibold text-primary-500">
                  {sources.length}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleReview()}
              disabled={reviewLoading}
              className="mt-4 w-full rounded-md bg-primary-400 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {reviewLoading ? "Reviewing..." : "Review document"}
            </button>
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 text-sm leading-6 text-gray-700">
              {reviewText ? (
                <ReactMarkdown>{reviewText}</ReactMarkdown>
              ) : (
                <p>
                  Run review to get feedback on argument flow, evidence,
                  citations, and next writing steps.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default AcademicAssistantPanel;
