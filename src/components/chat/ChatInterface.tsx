"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  toolEvents?: ToolEvent[];
  pending?: boolean;
}

interface ToolEvent {
  id: string;
  name: string;
  status: "running" | "ok" | "error";
  error?: string;
}

const ATV_LABELS: Record<string, string> = {
  "kawasaki-atv": "Kawasaki ATV",
};

const ROUTE_LABELS: Record<string, string> = {
  "squamish-valley-fsr": "the Squamish Valley FSR",
  "brandywine-callaghan": "the Brandywine + Callaghan loop",
  "indian-arm-backroads": "the Indian Arm backroads",
  "powder-mountain": "the Powder Mountain catchment",
};

function buildSeedMessage(opts: {
  atv?: string;
  action?: string;
  route?: string;
  booking?: string;
  cancelled?: string;
}): string | null {
  if (opts.booking && opts.cancelled === "1") {
    return `Hi — I just cancelled the Stripe checkout for booking ${opts.booking}. Can you help me figure out what to do next?`;
  }
  if (opts.atv && ATV_LABELS[opts.atv]) {
    const name = ATV_LABELS[opts.atv];
    if (opts.action === "quote") {
      return `Hi — I'd like a quote for the ${name}. Can you walk me through what dates and group size you'd need from me?`;
    }
    return `Hi — I'm interested in the ${name}. Can you check upcoming availability and tell me what trips it's a good fit for?`;
  }
  if (opts.route && ROUTE_LABELS[opts.route]) {
    return `Hi — I'd like to ride ${ROUTE_LABELS[opts.route]}. Which ATV would you suggest and what dates do you have open in the next month?`;
  }
  return null;
}

const SUGGESTIONS = [
  "I want two ATVs for Saturday and Sunday near Whistler — what do you have?",
  "I'm a first-timer. What's the easiest machine to start on?",
  "Can you deliver to a campsite in Brandywine on July 12?",
  "What's a good half-day ride for an experienced rider?",
];

interface ChatInterfaceProps {
  initialSessionId?: string;
  seedParams?: {
    atv?: string;
    action?: string;
    route?: string;
    booking?: string;
    cancelled?: string;
  };
}

export function ChatInterface({ initialSessionId, seedParams }: ChatInterfaceProps) {
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!initialSessionId) {
      const stored = localStorage.getItem("sar_session_id");
      if (stored) setSessionId(stored);
    }
  }, [initialSessionId]);

  useEffect(() => {
    if (sessionId) localStorage.setItem("sar_session_id", sessionId);
  }, [sessionId]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Auto-send a seed message based on URL params (only once per mount, only if no
  // existing conversation in this session).
  useEffect(() => {
    if (seededRef.current) return;
    if (!seedParams) return;
    if (messages.length > 0) return;
    const seed = buildSeedMessage(seedParams);
    if (!seed) return;
    seededRef.current = true;
    sendMessage(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedParams]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return;
    setError(null);
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    const assistantId = crypto.randomUUID();
    const assistantStub: ChatMessage = {
      id: assistantId,
      role: "assistant",
      text: "",
      toolEvents: [],
      pending: true,
    };
    setMessages((prev) => [...prev, userMsg, assistantStub]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });
      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error ?? `Server returned ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\n\n/);
        buffer = events.pop() ?? "";
        for (const raw of events) {
          if (!raw.trim()) continue;
          const lines = raw.split("\n");
          let evName = "message";
          let dataStr = "";
          for (const line of lines) {
            if (line.startsWith("event:")) evName = line.slice(6).trim();
            else if (line.startsWith("data:")) dataStr += line.slice(5).trim();
          }
          if (!dataStr) continue;
          let data: Record<string, unknown> = {};
          try {
            data = JSON.parse(dataStr);
          } catch {
            continue;
          }

          handleStreamEvent(evName, data, assistantId);
        }
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, pending: false } : m)),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                pending: false,
                text:
                  m.text ||
                  "Sorry — something went wrong on our end. Please try again.",
              }
            : m,
        ),
      );
    } finally {
      setStreaming(false);
    }
  }

  function handleStreamEvent(
    name: string,
    data: Record<string, unknown>,
    assistantId: string,
  ) {
    if (name === "session" && typeof data.sessionId === "string") {
      setSessionId(data.sessionId);
      return;
    }
    if ((name === "text" || name === "text_delta") && typeof data.text === "string") {
      const t = data.text;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, text: m.text + t } : m,
        ),
      );
      return;
    }
    if (name === "tool_use" && typeof data.id === "string") {
      const evt: ToolEvent = {
        id: data.id,
        name: String(data.name ?? "tool"),
        status: "running",
      };
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, toolEvents: [...(m.toolEvents ?? []), evt] }
            : m,
        ),
      );
      return;
    }
    if (name === "tool_result" && typeof data.id === "string") {
      const id = data.id;
      const ok = Boolean(data.ok);
      const errText = typeof data.error === "string" ? data.error : undefined;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                toolEvents: (m.toolEvents ?? []).map((e) =>
                  e.id === id
                    ? { ...e, status: ok ? "ok" : "error", error: errText }
                    : e,
                ),
              }
            : m,
        ),
      );
      return;
    }
    if (name === "error" && typeof data.message === "string") {
      setError(data.message);
    }
  }

  function newConversation() {
    if (streaming) return;
    localStorage.removeItem("sar_session_id");
    setSessionId(undefined);
    setMessages([]);
    setError(null);
    seededRef.current = false;
  }

  return (
    <div className="flex flex-col h-full bg-bg">
      <div ref={scrollerRef} className="flex-1 overflow-y-auto">
        <div className="container-x mx-auto max-w-2xl py-10 space-y-6">
          {messages.length === 0 && <Welcome onPick={sendMessage} />}
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {error && (
            <div className="rounded-md border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="container-x mx-auto max-w-2xl py-4 flex items-end gap-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell us your dates, your group, or where you want to ride…"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            className="flex-1 resize-none rounded-lg border border-input bg-bg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {streaming ? "Thinking…" : "Send"}
          </button>
        </form>
        {messages.length > 0 && (
          <div className="container-x mx-auto max-w-2xl pb-3 -mt-2">
            <button
              onClick={newConversation}
              disabled={streaming}
              className="text-xs text-muted-foreground hover:text-fg disabled:opacity-50"
            >
              ↻ Start a new conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Welcome({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-primary-soft px-6 py-8">
        <p className="font-display text-2xl font-semibold text-primary">
          Hi! I'm the Squamish Adventure Rentals booking assistant.
        </p>
        <p className="mt-3 text-fg/80">
          I can quote your trip, check live availability, and book the whole
          thing for you. What are you thinking?
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Try asking…
        </p>
        <div className="mt-3 grid gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onPick(s)}
              className="text-left rounded-lg border border-border bg-card px-4 py-3 text-sm hover:border-primary hover:bg-primary-soft transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-card border border-border rounded-tl-sm"
        }`}
      >
        {(message.text || message.pending) && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.text}
            {message.pending && !message.text && (
              <span className="inline-flex gap-1 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-pulse [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80 animate-pulse [animation-delay:300ms]" />
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
