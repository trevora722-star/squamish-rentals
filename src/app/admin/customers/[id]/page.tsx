import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { customers, bookings } from "@/db/schema";
import { formatCurrencyDetailed, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);
  if (!customer) notFound();

  const customerBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.customerId, id))
    .orderBy(desc(bookings.createdAt));

  const totalSpent = customerBookings
    .filter((b) => ["confirmed", "in_progress", "completed"].includes(b.status))
    .reduce((acc, b) => acc + parseFloat(b.totalAmount), 0);

  return (
    <div className="max-w-4xl">
      <Link href="/admin/customers" className="text-sm text-muted-foreground hover:text-fg">
        ← All customers
      </Link>

      <h1 className="mt-3">{customer.name}</h1>
      <p className="mt-1 text-muted-foreground">{customer.email}</p>

      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
        <Stat label="Bookings" value={customerBookings.length} />
        <Stat
          label="Total spent"
          value={formatCurrencyDetailed(totalSpent)}
        />
        <Stat
          label="Customer since"
          value={new Date(customer.createdAt).toLocaleDateString("en-CA", {
            month: "short",
            year: "numeric",
          })}
        />
        <Stat
          label="Last activity"
          value={
            customerBookings[0]
              ? new Date(customerBookings[0].createdAt).toLocaleDateString("en-CA", {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="Contact">
          <Field label="Email" value={customer.email} />
          {customer.phone && <Field label="Phone" value={customer.phone} />}
          {customer.dob && (
            <Field
              label="DOB"
              value={new Date(customer.dob).toLocaleDateString("en-CA")}
            />
          )}
        </Card>

        <Card title="Driver's license">
          {customer.driverLicenseNumber ? (
            <>
              <Field
                label="Number"
                value={`${customer.driverLicenseProvince ?? ""} ${customer.driverLicenseNumber}`.trim()}
              />
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Not on file.</p>
          )}
        </Card>

        <Card title="Address">
          {customer.addressLine1 ? (
            <p className="text-sm">
              {customer.addressLine1}
              {customer.addressLine2 ? `, ${customer.addressLine2}` : ""}
              <br />
              {[customer.city, customer.province, customer.postalCode]
                .filter(Boolean)
                .join(", ")}
              <br />
              {customer.country ?? ""}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Not on file.</p>
          )}
        </Card>

        {customer.notes && (
          <Card title="Notes">
            <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
          </Card>
        )}
      </div>

      <h2 className="mt-12">Bookings</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Booking</th>
              <th className="text-left px-4 py-3">Dates</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customerBookings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No bookings yet.
                </td>
              </tr>
            )}
            {customerBookings.map((b) => (
              <tr key={b.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-mono">
                  <Link
                    href={`/admin/bookings/${b.bookingNumber}`}
                    className="text-primary hover:underline"
                  >
                    {b.bookingNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{formatDateRange(b.startDate, b.endDate)}</td>
                <td className="px-4 py-3">{b.status}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrencyDetailed(parseFloat(b.totalAmount))}
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

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="mt-4 space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
