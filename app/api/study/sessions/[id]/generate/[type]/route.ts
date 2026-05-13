import { NextRequest } from "next/server";
import { generateArtifact } from "@/app/lib/server/study/generate";
import {
  getSession,
  getSessionSourceText,
  upsertArtifact,
} from "@/app/lib/server/study/repo";
import { fail, getAuthenticatedUserId, ok } from "@/app/lib/server/study/http";
import { StudyArtifactType } from "@/app/lib/server/study/types";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set<StudyArtifactType>([
  "notes",
  "summary",
  "flashcards",
  "quizzes",
]);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; type: string } },
) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return fail("Unauthorized", 401);
    }
    const session = await getSession(params.id);
    if (!session) {
      return fail("Session not found", 404);
    }
    if (session.userId !== userId) {
      return fail("Forbidden", 403);
    }

    const type = params.type as StudyArtifactType;
    if (!ALLOWED_TYPES.has(type)) {
      return fail("Unsupported generation type");
    }

    const { mergedText } = await getSessionSourceText(params.id);
    if (!mergedText.trim()) {
      return fail("No source text found for this session");
    }

    const content = await generateArtifact(type, mergedText);
    await upsertArtifact(params.id, type, content);

    return ok({ type, content });
  } catch (error) {
    console.error("study.generate.POST", error);
    return fail("Failed to generate artifact", 500);
  }
}
