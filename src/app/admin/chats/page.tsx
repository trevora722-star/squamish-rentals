import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { chatSessions, chatMessages } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminChats() {
  const rows = await db
    .select({
      session: chatSessions,
      messageCount: sql<number>`(select count(*)::int from ${chatMessages} where ${chatMessages.sessionId} = ${chatSessions.id})`,
    })
    .from(chatSessions)
    .orderBy(desc(chatSessions.lastMessageAt))
    .limit(100);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1>Chat transcripts</h1>
        <p className="text-sm text-muted-foreground">{rows.length} sessions</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Session</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-right px-4 py-3">Messages</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Last activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No chat sessions yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.session.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-mono text-xs">{r.session.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  {r.session.contactName ?? <span className="text-muted-foreground">anon</span>}
                  {r.session.contactEmail && (
                    <div className="text-xs text-muted-foreground">{r.session.contactEmail}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">{r.messageCount}</td>
                <td className="px-4 py-3">{r.session.status}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.session.lastMessageAt).toLocaleString("en-CA", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
