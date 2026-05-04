"use client";

import { useEffect, useMemo, useState } from "react";

const ATV_SLUG = "kawasaki-atv";

interface Quote {
  numDays: number;
  itemLines: { label: string; quantity: number; subtotal: number }[];
  addonLines: { label: string; quantity: number; subtotal: number }[];
  atvSubtotal: number;
  addonsSubtotal: number;
  deliveryFee: number;
  deliveryZoneName?: string;
  taxAmount: number;
  grandTotal: number;
  depositTotal: number;
  outOfZone: boolean;
  notes?: string;
}

interface AvailResult {
  atvSlug: string | null;
  available: boolean;
  unitsAvailable: number;
  unitsRequested: number;
  unitsOwned: number;
  alternativeDates?: { startDate: string; endDate: string }[];
}

const ADDON_OPTIONS = [
  { slug: "extra-helmet", label: "Extra DOT helmet (flat fee)", priceLabel: "$15 each" },
  { slug: "gas-can", label: "Spare 10L gas can", priceLabel: "$10/day" },
  { slug: "gps-unit", label: "Handheld GPS with FSR maps", priceLabel: "$20/day" },
  { slug: "cooler", label: "Cooler with ice", priceLabel: "$15/day" },
  { slug: "guided-intro", label: "Guided intro ride (1 hr)", priceLabel: "$120 flat" },
];

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatCAD(n: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);
}

export function BookingForm() {
  const [startDate, setStartDate] = useState(todayPlus(7));
  const [endDate, setEndDate] = useState(todayPlus(8));
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryWindow, setDeliveryWindow] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeWaiver, setAgreeWaiver] = useState(false);
  const [addons, setAddons] = useState<Record<string, number>>({});

  const [avail, setAvail] = useState<AvailResult | null>(null);
  const [availLoading, setAvailLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validate date range
  const datesValid = useMemo(() => {
    if (!startDate || !endDate) return false;
    return new Date(startDate) <= new Date(endDate);
  }, [startDate, endDate]);

  // Re-check availability whenever dates / qty change
  useEffect(() => {
    if (!datesValid) {
      setAvail(null);
      return;
    }
    let cancelled = false;
    setAvailLoading(true);
    fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        atvSlug: ATV_SLUG,
        quantity,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const r = data.results?.[0] as AvailResult | undefined;
        setAvail(r ?? null);
      })
      .catch(() => {
        if (!cancelled) setAvail(null);
      })
      .finally(() => {
        if (!cancelled) setAvailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, quantity, datesValid]);

  async function getQuote() {
    setQuoteError(null);
    setQuoteLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ atvSlug: ATV_SLUG, quantity }],
          addons: Object.entries(addons)
            .filter(([, qty]) => qty > 0)
            .map(([slug, qty]) => ({ addonSlug: slug, quantity: qty })),
          startDate,
          endDate,
          deliveryAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Couldn't build quote");
      setQuote(data);
    } catch (err) {
      setQuoteError(err instanceof Error ? err.message : String(err));
      setQuote(null);
    } finally {
      setQuoteLoading(false);
    }
  }

  async function submitBooking() {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ atvSlug: ATV_SLUG, quantity }],
          addons: Object.entries(addons)
            .filter(([, qty]) => qty > 0)
            .map(([slug, qty]) => ({ addonSlug: slug, quantity: qty })),
          startDate,
          endDate,
          deliveryAddress,
          deliveryWindow: deliveryWindow || undefined,
          customer: { name, email, phone },
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Booking failed");

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      // Stripe wasn't configured — land on the booking detail page anyway
      window.location.href = `/bookings/${data.bookingNumber}`;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  const canQuote =
    datesValid &&
    quantity >= 1 &&
    quantity <= 4 &&
    deliveryAddress.trim().length > 3 &&
    (avail?.available ?? false);

  const canBook =
    quote != null &&
    !quote.outOfZone &&
    name.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(email) &&
    phone.trim().length >= 7 &&
    agreeAge &&
    agreeWaiver;

  return (
    <div className="space-y-8">
      <Section title="1. Dates and group size">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date">
            <input
              type="date"
              value={startDate}
              min={todayPlus(0)}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
            />
          </Field>
        </div>
        <Field label="How many ATVs?">
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setQuantity(n)}
                className={`h-12 w-14 rounded-lg border text-lg font-semibold transition-colors ${
                  quantity === n
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              We have 4 brand-new Kawasaki ATVs.
            </span>
          </div>
        </Field>

        <AvailabilityNote loading={availLoading} avail={avail} />
      </Section>

      <Section title="2. Delivery">
        <Field label="Delivery address" hint="Where should we drop the ATVs? Address, campsite, or trailhead.">
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="e.g. 1234 Cleveland Ave, Squamish, BC"
            className="form-input"
          />
        </Field>
        <Field label="Preferred delivery window (optional)">
          <input
            type="text"
            value={deliveryWindow}
            onChange={(e) => setDeliveryWindow(e.target.value)}
            placeholder="e.g. 8:00–9:00 AM"
            className="form-input"
          />
        </Field>
      </Section>

      <Section title="3. Add-ons (optional)">
        <ul className="space-y-2">
          {ADDON_OPTIONS.map((a) => (
            <li
              key={a.slug}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="font-medium text-sm">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.priceLabel}</p>
              </div>
              <Stepper
                value={addons[a.slug] ?? 0}
                onChange={(v) =>
                  setAddons((prev) => ({ ...prev, [a.slug]: v }))
                }
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="4. Quote">
        {!quote && !quoteLoading && (
          <button
            type="button"
            onClick={getQuote}
            disabled={!canQuote}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get a quote
          </button>
        )}
        {quoteLoading && <p className="text-sm text-muted-foreground">Building your quote…</p>}
        {quoteError && (
          <p className="rounded-md border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
            {quoteError}
          </p>
        )}
        {quote && (
          <QuoteSummary quote={quote} onReset={() => setQuote(null)} />
        )}
      </Section>

      <Section title="5. Your details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              autoComplete="name"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
            />
          </Field>
        </div>
        <Field label="Phone">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (604) 000-0000"
            className="form-input"
            autoComplete="tel"
          />
        </Field>
        <Field label="Anything we should know? (optional)" hint="Gate codes, dietary stuff, group context.">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="form-input resize-none"
          />
        </Field>

        <div className="space-y-2 mt-4">
          <Checkbox
            checked={agreeAge}
            onChange={setAgreeAge}
            label="All riders are 19 or older with a valid driver's licence."
          />
          <Checkbox
            checked={agreeWaiver}
            onChange={setAgreeWaiver}
            label={
              <>
                I've read the{" "}
                <a href="/legal/waiver" target="_blank" className="text-primary underline">
                  rental waiver
                </a>{" "}
                and{" "}
                <a href="/legal/terms" target="_blank" className="text-primary underline">
                  terms
                </a>
                . I'll sign the digital waiver at delivery.
              </>
            }
          />
        </div>
      </Section>

      <div className="border-t border-border pt-8 sticky bottom-0 bg-bg pb-2">
        {submitError && (
          <p className="rounded-md border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger mb-4">
            {submitError}
          </p>
        )}
        <button
          type="button"
          onClick={submitBooking}
          disabled={!canBook || submitting}
          className="btn-accent w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Creating your hold…"
            : quote
              ? `Confirm and pay ${formatCAD(quote.grandTotal)}`
              : "Confirm and pay"}
        </button>
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Hold lasts 15 minutes once payment starts. A refundable damage deposit
          {quote && quote.depositTotal > 0
            ? ` of ${formatCAD(quote.depositTotal)} `
            : " "}
          is pre-authorized at delivery.
        </p>
      </div>
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
      {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Stepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-8 w-8 rounded-md border border-border hover:border-primary text-lg font-semibold"
      >
        −
      </button>
      <span className="w-6 text-center font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="h-8 w-8 rounded-md border border-border hover:border-primary text-lg font-semibold"
      >
        +
      </button>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-primary"
      />
      <span className="text-sm leading-relaxed">{label}</span>
    </label>
  );
}

function AvailabilityNote({
  loading,
  avail,
}: {
  loading: boolean;
  avail: AvailResult | null;
}) {
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Checking availability…</p>
    );
  }
  if (!avail) return null;

  if (avail.available) {
    return (
      <p className="text-sm text-success font-medium">
        ✓ All {avail.unitsRequested} requested ATV{avail.unitsRequested === 1 ? "" : "s"} available for these dates.
      </p>
    );
  }
  return (
    <div className="rounded-md border border-warning/40 bg-warning/5 px-4 py-3 text-sm">
      <p className="font-medium text-warning">
        Only {avail.unitsAvailable} of our {avail.unitsOwned} ATVs are open for those dates.
      </p>
      {avail.alternativeDates && avail.alternativeDates.length > 0 && (
        <p className="mt-1 text-muted-foreground">
          Open alternatives:{" "}
          {avail.alternativeDates
            .map((a) => `${a.startDate} → ${a.endDate}`)
            .join(", ")}
        </p>
      )}
    </div>
  );
}

function QuoteSummary({
  quote,
  onReset,
}: {
  quote: Quote;
  onReset: () => void;
}) {
  if (quote.outOfZone) {
    return (
      <div className="rounded-md border border-warning/40 bg-warning/5 px-4 py-3 text-sm">
        <p className="font-medium text-warning">Out-of-zone delivery</p>
        <p className="mt-1 text-muted-foreground">
          That address is outside our standard zones. Open a chat and we'll
          quote it manually.
        </p>
        <a href="/chat" className="btn-primary text-sm mt-3 inline-block">
          Open chat for a custom quote
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <dl className="text-sm divide-y divide-border border-y border-border">
        {quote.itemLines.map((l, i) => (
          <Row
            key={i}
            label={`${l.quantity} × ${l.label} (${quote.numDays} day${quote.numDays === 1 ? "" : "s"})`}
            value={formatCAD(l.subtotal)}
          />
        ))}
        {quote.addonLines.map((l, i) => (
          <Row
            key={`addon-${i}`}
            label={`${l.quantity} × ${l.label}`}
            value={formatCAD(l.subtotal)}
          />
        ))}
        <Row
          label={
            quote.deliveryZoneName
              ? `Delivery (${quote.deliveryZoneName})`
              : "Delivery"
          }
          value={
            quote.deliveryFee === 0 ? "Free" : formatCAD(quote.deliveryFee)
          }
        />
        <Row label="GST + PST" value={formatCAD(quote.taxAmount)} />
        <Row
          label="Refundable damage deposit"
          value={formatCAD(quote.depositTotal)}
          muted
        />
        <div className="flex justify-between font-semibold py-3 text-base">
          <span>Total</span>
          <span>{formatCAD(quote.grandTotal)}</span>
        </div>
      </dl>
      <button
        type="button"
        onClick={onReset}
        className="text-xs text-muted-foreground hover:text-fg"
      >
        Change details and re-quote
      </button>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className={`flex justify-between py-2 ${muted ? "text-muted-foreground" : ""}`}>
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
