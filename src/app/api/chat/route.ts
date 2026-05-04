import { NextRequest } from "next/server";
import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODEL, isAnthropicConfigured } from "@/lib/anthropic";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { TOOLS } from "@/lib/chat/tools";
import { TOOL_HANDLERS } from "@/lib/chat/tool-handlers";
import {
  getOrCreateSession,
  loadHistory,
  appendUserMessage,
  appendAssistantContent,
  appendToolResult,
  type AnthropicMessage,
} from "@/lib/chat/persist";

export const runtime = "nodejs";
export const maxDuration = 120;

const RequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1).max(8000),
});

const MAX_TOOL_LOOPS = 8;

export async function POST(req: NextRequest) {
  if (!isAnthropicConfigured()) {
    return new Response(
      JSON.stringify({
        error:
          "Chat is not configured yet. Set ANTHROPIC_API_KEY in your .env.local.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = await req.json();
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { sessionId: incomingSessionId, message } = parsed.data;
  const session = await getOrCreateSession(incomingSessionId);
  const sessionId = session.id;

  await appendUserMessage(sessionId, message);

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      try {
        send("session", { sessionId });

        let history: AnthropicMessage[] = await loadHistory(sessionId);

        for (let loop = 0; loop < MAX_TOOL_LOOPS; loop++) {
          const liveStream = anthropic.messages.stream({
            model: MODEL,
            max_tokens: 2048,
            system: SYSTEM_PROMPT,
            tools: TOOLS,
            messages: history,
          });

          // Forward text deltas as they arrive
          liveStream.on("text", (textDelta) => {
            send("text_delta", { text: textDelta });
          });

          // Notify the client when a tool block starts (so we can show "running…")
          liveStream.on("contentBlock", (block) => {
            if (block.type === "tool_use") {
              send("tool_use", {
                id: block.id,
                name: block.name,
                input: block.input,
              });
            }
          });

          const finalMessage = await liveStream.finalMessage();

          await appendAssistantContent(sessionId, finalMessage.content);

          if (finalMessage.stop_reason !== "tool_use") {
            send("done", { stop_reason: finalMessage.stop_reason });
            controller.close();
            return;
          }

          history = [
            ...history,
            { role: "assistant", content: finalMessage.content },
          ];

          const toolResults: Anthropic.Messages.ContentBlockParam[] = [];
          for (const block of finalMessage.content) {
            if (block.type !== "tool_use") continue;
            const handler = TOOL_HANDLERS[block.name];
            if (!handler) {
              const errMsg = `Unknown tool: ${block.name}`;
              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: errMsg,
                is_error: true,
              });
              await appendToolResult(sessionId, block.id, block.name, errMsg);
              send("tool_result", {
                id: block.id,
                name: block.name,
                ok: false,
                error: errMsg,
              });
              continue;
            }
            try {
              const result = await handler(
                block.input as Record<string, unknown>,
                { sessionId },
              );
              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: JSON.stringify(result),
              });
              await appendToolResult(sessionId, block.id, block.name, result);
              send("tool_result", { id: block.id, name: block.name, ok: true });
            } catch (err) {
              const message = err instanceof Error ? err.message : String(err);
              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: `Error: ${message}`,
                is_error: true,
              });
              await appendToolResult(sessionId, block.id, block.name, {
                error: message,
              });
              send("tool_result", {
                id: block.id,
                name: block.name,
                ok: false,
                error: message,
              });
            }
          }

          history = [...history, { role: "user", content: toolResults }];
        }

        send("error", { message: "Maximum tool loop count reached." });
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chat] error", err);
        controller.enqueue(
          enc.encode(`event: error\ndata: ${JSON.stringify({ message })}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
