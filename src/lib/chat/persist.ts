import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { chatMessages, chatSessions } from "@/db/schema";
import type Anthropic from "@anthropic-ai/sdk";

export type AnthropicMessage = Anthropic.Messages.MessageParam;

export async function getOrCreateSession(sessionId?: string) {
  if (sessionId) {
    const [existing] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1);
    if (existing) return existing;
  }
  const [created] = await db.insert(chatSessions).values({}).returning();
  return created;
}

export async function loadHistory(sessionId: string): Promise<AnthropicMessage[]> {
  const rows = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(asc(chatMessages.createdAt));

  // The DB stores each message in Anthropic content-block JSON format.
  // We aggregate consecutive same-role rows back into Anthropic message params.
  const messages: AnthropicMessage[] = [];
  for (const r of rows) {
    if (r.role !== "user" && r.role !== "assistant") continue;
    const last = messages[messages.length - 1];
    const content = r.content as Anthropic.Messages.ContentBlockParam[];
    if (last && last.role === r.role) {
      const prev = Array.isArray(last.content) ? last.content : [];
      last.content = [...prev, ...content];
    } else {
      messages.push({ role: r.role, content });
    }
  }
  return messages;
}

export async function appendUserMessage(sessionId: string, text: string) {
  await db.insert(chatMessages).values({
    sessionId,
    role: "user",
    content: [{ type: "text", text }],
  });
  await db
    .update(chatSessions)
    .set({ lastMessageAt: new Date() })
    .where(eq(chatSessions.id, sessionId));
}

export async function appendAssistantContent(
  sessionId: string,
  content: Anthropic.Messages.ContentBlockParam[],
) {
  await db.insert(chatMessages).values({
    sessionId,
    role: "assistant",
    content,
  });
  await db
    .update(chatSessions)
    .set({ lastMessageAt: new Date() })
    .where(eq(chatSessions.id, sessionId));
}

export async function appendToolResult(
  sessionId: string,
  toolUseId: string,
  toolName: string,
  result: unknown,
) {
  await db.insert(chatMessages).values({
    sessionId,
    role: "user",
    toolUseId,
    toolName,
    content: [
      {
        type: "tool_result",
        tool_use_id: toolUseId,
        content: typeof result === "string" ? result : JSON.stringify(result),
      },
    ],
  });
}
