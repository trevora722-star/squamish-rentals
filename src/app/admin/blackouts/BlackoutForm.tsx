"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FleetEntry {
  id: string;
  name: string;
}

export function BlackoutForm({ fleet }: { fleet: FleetEntry[] }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [atvId, setAtvId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!startDate || !endDate) {
      setError("Pick a start and end date.");
      return;
    }
    if (endDate < startDate) {
      setError("End date must be on or after start date.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/blackouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          reason: reason.trim() || null,
          atvId: atvId || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setStartDate("");
      setEndDate("");
      setReason("");
      setAtvId("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 rounded-xl border border-border bg-card p-6 space-y-4"
    >
      <h2 className="text-lg font-display font-semibold">Block off dates</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="From">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
            required
          />
        </Field>
        <Field label="To (inclusive)">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
            min={startDate}
            required
          />
        </Field>
      </div>

      <Field
        label="Scope"
        hint="Block the whole fleet, or just one specific ATV."
      >
        <select
          value={atvId}
          onChange={(e) => setAtvId(e.target.value)}
          className="form-input"
        >
          <option value="">Whole fleet</option>
          {fleet.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} only
            </option>
          ))}
        </select>
      </Field>

      <Field label="Reason (shown internally only)">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. holiday, maintenance, group event"
          className="form-input"
        />
      </Field>

      {error && (
        <p className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary disabled:opacity-50"
      >
        {submitting ? "Adding…" : "Block these dates"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}
