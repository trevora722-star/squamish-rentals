import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { chatSessions, chatMessages } from "@/db/schema";

export const dynamic = "force-dynamic";

interface ContentBlock {
  type: string;
  text?: string;
  name?: string;
  input?: unknown;
  tool_use_id?: string;
  content?: unknown;
  is_error?: boolean;
}

export default async function AdminChatTranscript({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session] = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.id, id))
    .limit(1);
  if (!session) notFound();

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, id))
    .orderBy(asc(chatMessages.createdAt));

  return (
    <div className="max-w-3xl">
      <Link href="/admin/chats" className="text-sm text-muted-foreground hover:text-fg">
        ← All chats
      </Link>
      <h1 className="mt-3">Chat transcript</h1>
      <p className="mt-2 text-sm text-muted-foreground font-mono">{session.id}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Started {new Date(session.startedAt).toLocaleString("en-CA")} · {messages.length} entries
      </p>

      <div className="mt-8 space-y-4">
        {messages.length === 0 && (
          <p className="text-muted-foreground">No messages.</p>
        )}
        {messages.map((m) => {
          const blocks = (Array.isArray(m.content) ? m.content : [m.content]) as ContentBlock[];
          return (
            <div
              key={m.id}
              className={`rounded-xl border border-border p-5 ${
                m.role === "user" ? "bg-card" : "bg-muted/40"
              }`}
            >
              <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-muted-foreground">
                <span>{m.role}</span>
                <span>
                  {new Date(m.createdAt).toLocaleString("en-CA", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  if (block.type === "text" && block.text) {
    return <p className="whitespace-pre-wrap leading-relaxed">{block.text}</p>;
  }
  if (block.type === "tool_use") {
    return (
      <div className="rounded-md bg-primary-soft px-3 py-2 text-xs font-mono">
        <span className="text-primary font-semibold">→ {block.name}</span>
        <pre className="mt-1 whitespace-pre-wrap text-muted-foreground">
          {JSON.stringify(block.input, null, 2)}
        </pre>
      </div>
    );
  }
  if (block.type === "tool_result") {
    return (
      <div
        className={`rounded-md px-3 py-2 text-xs font-mono ${
          block.is_error ? "bg-danger/10" : "bg-muted"
        }`}
      >
        <span className="font-semibold">
          ← tool_result {block.is_error ? "(error)" : ""}
        </span>
        <pre className="mt-1 whitespace-pre-wrap text-muted-foreground">
          {typeof block.content === "string"
            ? block.content
            : JSON.stringify(block.content, null, 2)}
        </pre>
      </div>
    );
  }
  return (
    <pre className="whitespace-pre-wrap text-xs font-mono text-muted-foreground">
      {JSON.stringify(block, null, 2)}
    </pre>
  );
}
