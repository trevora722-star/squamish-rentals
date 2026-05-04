import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, customers } from "@/db/schema";
import { formatCurrencyDetailed, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  hold: "bg-accent-soft text-accent",
  confirmed: "bg-primary-soft text-primary",
  in_progress: "bg-primary-soft text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
  refunded: "bg-muted text-muted-foreground",
};

export default async function AdminBookings() {
  const rows = await db
    .select({
      booking: bookings,
      customer: customers,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .orderBy(desc(bookings.createdAt))
    .limit(100);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1>Bookings</h1>
        <p className="text-sm text-muted-foreground">{rows.length} most recent</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Booking</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Dates</th>
              <th className="text-left px-4 py-3">Delivery</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No bookings yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.booking.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-mono">
                  <Link
                    href={`/bookings/${r.booking.bookingNumber}`}
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
                <td className="px-4 py-3">{formatDateRange(r.booking.startDate, r.booking.endDate)}</td>
                <td className="px-4 py-3 max-w-[18rem] truncate" title={r.booking.deliveryAddress}>
                  {r.booking.deliveryAddress}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrencyDetailed(parseFloat(r.booking.totalAmount))}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[r.booking.status] ?? "bg-muted"
                    }`}
                  >
                    {r.booking.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.booking.createdAt).toLocaleString("en-CA", {
                    year: "numeric",
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
