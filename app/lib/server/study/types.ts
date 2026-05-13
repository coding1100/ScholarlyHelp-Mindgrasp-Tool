export type StudyArtifactType =
  | "notes"
  | "summary"
  | "flashcards"
  | "quizzes";

export type StudySourceKind = "text" | "url" | "file" | "youtube";

export interface StudySession {
  _id?: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySource {
  _id?: string;
  sessionId: string;
  kind: StudySourceKind;
  name: string;
  text: string;
  chunks: string[];
  createdAt: Date;
}

export interface StudyArtifact {
  _id?: string;
  sessionId: string;
  type: StudyArtifactType;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface TutorMessage {
  _id?: string;
  sessionId: string;
  role: "user" | "assistant";
  message: string;
  citations: number[];
  provenance?: "source" | "general" | "image";
  createdAt: Date;
}
