"use client";

import { useState } from "react";
import Link from "next/link";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(360px,calc(100vw-2.5rem))] rounded-2xl border border-border bg-card shadow-[var(--shadow-pop)] overflow-hidden animate-pop-in">
          <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 font-display text-lg">
                S
              </span>
              <div>
                <p className="font-semibold leading-tight">Booking assistant</p>
                <p className="text-xs opacity-80">Usually replies in seconds</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 hover:bg-primary-foreground/10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="px-5 py-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Hi! I'm the Squamish Adventure Rentals booking assistant. I can
              quote your trip, check live availability, and book the whole
              thing for you.
            </p>
            <p className="text-sm text-muted-foreground">
              The full chat experience is launching soon. Tap below to start a
              conversation on our dedicated chat page.
            </p>
            <Link
              href="/chat"
              className="btn-primary w-full text-center inline-block"
            >
              Open full chat
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close booking chat" : "Open booking chat"}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-pop)] hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
              d="M21 12c0 4.418-4.03 8-9 8a9.9 9.9 0 0 1-3.8-.74L3 20l.94-3.6A7.9 7.9 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </>
  );
}
