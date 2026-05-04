import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, customers } from "@/db/schema";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import { formatCurrencyDetailed, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { number } = await params;
  const sp = await searchParams;
  const justPaid = sp.paid === "1";

  const [row] = await db
    .select({ booking: bookings, customer: customers })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .where(eq(bookings.bookingNumber, number))
    .limit(1);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x mx-auto max-w-2xl py-16">
          {!row?.booking ? (
            <div className="rounded-xl border border-border bg-card p-8">
              <h1>Booking not found</h1>
              <p className="mt-3 text-muted-foreground">
                We couldn't find a booking with the number{" "}
                <code className="font-mono">{number}</code>. Double-check the number, or open the chat to look it up.
              </p>
              <Link href="/chat" className="btn-primary mt-6 inline-block">Open chat</Link>
            </div>
          ) : (
            <>
              {justPaid && (
                <div className="rounded-xl bg-primary-soft px-6 py-5 mb-6">
                  <p className="font-display text-lg font-semibold text-primary">Payment received — you're booked.</p>
                  <p className="mt-1 text-sm text-fg/80">A confirmation email is on its way.</p>
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Booking</p>
              <h1 className="mt-2 font-mono text-3xl">{row.booking.bookingNumber}</h1>

              <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
                <Row label="Status" value={row.booking.status} />
                <Row label="Dates" value={formatDateRange(row.booking.startDate, row.booking.endDate)} />
                <Row label="Delivery" value={row.booking.deliveryAddress} />
                {row.booking.deliveryWindow && (
                  <Row label="Delivery window" value={row.booking.deliveryWindow} />
                )}
                <Row label="Total" value={formatCurrencyDetailed(parseFloat(row.booking.totalAmount))} />
                {parseFloat(row.booking.depositTotal) > 0 && (
                  <Row label="Refundable deposit" value={formatCurrencyDetailed(parseFloat(row.booking.depositTotal))} />
                )}
                {row.customer && (
                  <Row label="Booked under" value={`${row.customer.name} · ${row.customer.email}`} />
                )}
              </dl>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/chat" className="btn-primary">
                  Modify or ask a question
                </Link>
                <Link href="/" className="btn-ghost">
                  Back to home
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 font-medium">{value}</dd>
    </div>
  );
}
