import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, customers } from "@/db/schema";
import { formatCurrencyDetailed } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPayments() {
  // All paid bookings, newest first
  const rows = await db
    .select({
      booking: bookings,
      customer: customers,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .where(sql`${bookings.paidAt} is not null`)
    .orderBy(desc(bookings.paidAt))
    .limit(200);

  // Monthly totals
  const monthlyTotals = await db
    .select({
      month: sql<string>`to_char(${bookings.paidAt}, 'YYYY-MM')`,
      total: sql<string>`sum(${bookings.totalAmount})::text`,
      count: sql<number>`count(*)::int`,
    })
    .from(bookings)
    .where(sql`${bookings.paidAt} is not null`)
    .groupBy(sql`to_char(${bookings.paidAt}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${bookings.paidAt}, 'YYYY-MM') desc`)
    .limit(12);

  const allTimeTotal = monthlyTotals.reduce(
    (acc, m) => acc + parseFloat(m.total),
    0,
  );
  const refundedCount = rows.filter((r) => r.booking.status === "refunded").length;
  const cancelledCount = rows.filter((r) => r.booking.status === "cancelled").length;

  return (
    <div>
      <h1>Payments</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        All Stripe-paid bookings, newest first. Refunds are processed in Stripe directly.
      </p>

      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
        <Stat
          label="All-time revenue"
          value={formatCurrencyDetailed(allTimeTotal)}
        />
        <Stat label="Paid bookings" value={rows.length} />
        <Stat label="Cancelled" value={cancelledCount} />
        <Stat label="Refunded" value={refundedCount} />
      </div>

      <h2 className="mt-12 text-2xl">By month</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Month</th>
              <th className="text-right px-4 py-3">Bookings</th>
              <th className="text-right px-4 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {monthlyTotals.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                  No paid bookings yet.
                </td>
              </tr>
            )}
            {monthlyTotals.map((m) => {
              const date = new Date(m.month + "-01");
              return (
                <tr key={m.month}>
                  <td className="px-4 py-3 font-medium">
                    {date.toLocaleDateString("en-CA", {
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">{m.count}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrencyDetailed(parseFloat(m.total))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl">Recent payments</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Booking</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Paid at</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.booking.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-mono">
                  <Link
                    href={`/admin/bookings/${r.booking.bookingNumber}`}
                    className="text-primary hover:underline"
                  >
                    {r.booking.bookingNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {r.customer ? (
                    <>
                      <div className="font-medium">{r.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{r.customer.email}</div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {r.booking.paidAt
                    ? new Date(r.booking.paidAt).toLocaleString("en-CA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={r.booking.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrencyDetailed(parseFloat(r.booking.totalAmount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl text-primary">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    confirmed: "bg-primary-soft text-primary",
    in_progress: "bg-accent-soft text-accent",
    completed: "bg-success/10 text-success",
    cancelled: "bg-danger/10 text-danger",
    refunded: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? "bg-muted"}`}
    >
      {status}
    </span>
  );
}
