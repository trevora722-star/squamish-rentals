import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { customers, bookings } from "@/db/schema";
import { formatCurrencyDetailed, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  const rows = await db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      city: customers.city,
      createdAt: customers.createdAt,
      bookingCount: sql<number>`count(${bookings.id})::int`,
      totalSpent: sql<string>`coalesce(sum(case when ${bookings.status} in ('confirmed','in_progress','completed') then ${bookings.totalAmount} else 0 end), 0)::text`,
      lastBookingDate: sql<string | null>`max(${bookings.startDate})`,
    })
    .from(customers)
    .leftJoin(bookings, eq(bookings.customerId, customers.id))
    .groupBy(customers.id)
    .orderBy(desc(sql`max(${bookings.createdAt})`));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1>Customers</h1>
        <p className="text-sm text-muted-foreground">{rows.length} total</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-right px-4 py-3">Bookings</th>
              <th className="text-right px-4 py-3">Total spent</th>
              <th className="text-left px-4 py-3">Last trip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No customers yet.
                </td>
              </tr>
            )}
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {c.name}
                  </Link>
                  {c.city && (
                    <div className="text-xs text-muted-foreground mt-0.5">{c.city}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">{c.email}</td>
                <td className="px-4 py-3">{c.phone ?? "—"}</td>
                <td className="px-4 py-3 text-right font-medium">{c.bookingCount}</td>
                <td className="px-4 py-3 text-right">
                  {formatCurrencyDetailed(parseFloat(c.totalSpent))}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {c.lastBookingDate ? formatDate(c.lastBookingDate) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
