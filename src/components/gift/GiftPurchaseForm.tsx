"use client";

import { useState } from "react";

const PRESET_AMOUNTS = [249, 500, 750, 1000];

function formatCAD(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function GiftPurchaseForm() {
  const [amount, setAmount] = useState<number>(249);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalAmount =
    customAmount.trim().length > 0
      ? parseFloat(customAmount.trim())
      : amount;

  const validAmount =
    !Number.isNaN(finalAmount) && finalAmount >= 50 && finalAmount <= 5000;

  const canSubmit =
    validAmount &&
    purchaserName.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(purchaserEmail);

  async function submit() {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/gift/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCad: finalAmount,
          purchaserName: purchaserName.trim(),
          purchaserEmail: purchaserEmail.trim(),
          recipientName: recipientName.trim() || undefined,
          recipientEmail: recipientEmail.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create gift card");

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      // Stripe wasn't configured — show the code anyway in success page
      window.location.href = `/gift/success?code=${encodeURIComponent(data.code)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <Section title="1. Choose the amount">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(preset);
                setCustomAmount("");
              }}
              className={`rounded-xl border-2 p-5 text-center transition-colors ${
                customAmount.trim().length === 0 && amount === preset
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-card hover:border-primary"
              }`}
            >
              <div className="font-display text-2xl font-semibold">
                {formatCAD(preset)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {preset === 249
                  ? "1 day, single rider"
                  : preset === 500
                    ? "Day for two"
                    : preset === 750
                      ? "Long weekend"
                      : "Full multi-day"}
              </div>
            </button>
          ))}
        </div>

        <Field label="Or pick any amount ($50 – $5,000)" hint="Whole dollars only.">
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-muted-foreground">$</span>
            <input
              type="number"
              min={50}
              max={5000}
              step={1}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 350"
              className="form-input pl-7"
            />
          </div>
        </Field>
      </Section>

      <Section title="2. Your details (the buyer)">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name">
            <input
              type="text"
              value={purchaserName}
              onChange={(e) => setPurchaserName(e.target.value)}
              className="form-input"
              autoComplete="name"
            />
          </Field>
          <Field label="Your email" hint="We'll send the code here.">
            <input
              type="email"
              value={purchaserEmail}
              onChange={(e) => setPurchaserEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
            />
          </Field>
        </div>
      </Section>

      <Section title="3. The lucky rider (optional)">
        <p className="text-xs text-muted-foreground">
          If you fill in the recipient&apos;s email, we&apos;ll send them a
          separate note with the gift code. Otherwise, leave these blank — you
          can deliver the code yourself.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Their name">
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="form-input"
              placeholder="e.g. Sam"
            />
          </Field>
          <Field label="Their email">
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="form-input"
              placeholder="optional"
            />
          </Field>
        </div>
        <Field label="Personal note (shown in their email)">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="e.g. Happy birthday, kid — go ride."
            className="form-input resize-none"
            maxLength={500}
          />
        </Field>
      </Section>

      {error && (
        <div className="rounded-md border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit || submitting}
        className="btn-accent w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting
          ? "Sending you to checkout…"
          : `Buy ${formatCAD(validAmount ? finalAmount : 0)} gift card`}
      </button>
      <p className="text-xs text-muted-foreground text-center -mt-3">
        You&apos;ll be taken to a secure Stripe checkout page to pay.
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-5">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
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
      {hint && (
        <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>
      )}
      <div className="mt-2">{children}</div>
    </label>
  );
}
