"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { sendChatMessage } from "../utilities/api";

interface Message {
  id: string;
  text: string;
  sender: "tutor" | "user";
  timestamp: string;
}

interface ChatContextType {
  messages: Message[];
  conversationId: string | null;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  sendMessage: (messageText: string) => Promise<string>; // Returns the API response
  setConversationId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (messageText: string): Promise<string> => {
    setIsLoading(true);
    const userMessageId = Date.now().toString();
    // Add user message immediately (so chat doesn't look empty)
    addMessage({
      id: userMessageId,
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    try {
      const response = await sendChatMessage(messageText, conversationId);
      setConversationId(response.conversation_id);

      // Add tutor response
      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "tutor",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      addMessage(tutorMessage);

      return response.message;
    } catch (error) {
      // If API fails, remove the optimistically added user message
      setMessages((prev) => prev.filter((m) => m.id !== userMessageId));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversationId,
        isLoading,
        addMessage,
        sendMessage,
        setConversationId,
        setIsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
