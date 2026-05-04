import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import {
  bookings,
  bookingItems,
  bookingAddons,
  customers,
  atvs,
  addons,
  deliveryZones,
  chatSessions,
} from "@/db/schema";
import { formatCurrencyDetailed, formatDateRange, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBookingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db
    .select({
      booking: bookings,
      customer: customers,
      zone: deliveryZones,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .leftJoin(deliveryZones, eq(bookings.deliveryZoneId, deliveryZones.id))
    .where(eq(bookings.bookingNumber, id))
    .limit(1);

  if (!row?.booking) notFound();

  const items = await db
    .select({
      qty: bookingItems.quantity,
      unit: bookingItems.unitRate,
      days: bookingItems.numDays,
      subtotal: bookingItems.subtotal,
      atv: atvs,
    })
    .from(bookingItems)
    .innerJoin(atvs, eq(bookingItems.atvId, atvs.id))
    .where(eq(bookingItems.bookingId, row.booking.id));

  const addonRows = await db
    .select({
      qty: bookingAddons.quantity,
      perDay: bookingAddons.unitPricePerDay,
      days: bookingAddons.numDays,
      subtotal: bookingAddons.subtotal,
      addon: addons,
    })
    .from(bookingAddons)
    .innerJoin(addons, eq(bookingAddons.addonId, addons.id))
    .where(eq(bookingAddons.bookingId, row.booking.id));

  const chat = row.booking.chatSessionId
    ? await db
        .select()
        .from(chatSessions)
        .where(eq(chatSessions.id, row.booking.chatSessionId))
        .limit(1)
        .then((r) => r[0])
    : null;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/bookings" className="text-sm text-muted-foreground hover:text-fg">
        ← All bookings
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-mono">{row.booking.bookingNumber}</h1>
        <span className="rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-medium uppercase tracking-wider">
          {row.booking.status}
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="Customer">
          {row.customer ? (
            <dl className="space-y-2 text-sm">
              <Field label="Name" value={row.customer.name} />
              <Field label="Email" value={row.customer.email} />
              <Field label="Phone" value={row.customer.phone ?? "—"} />
              {row.customer.driverLicenseNumber && (
                <Field
                  label="License"
                  value={`${row.customer.driverLicenseProvince ?? ""} ${row.customer.driverLicenseNumber}`}
                />
              )}
            </dl>
          ) : (
            <p className="text-muted-foreground">No customer record</p>
          )}
        </Card>

        <Card title="Trip">
          <dl className="space-y-2 text-sm">
            <Field label="Dates" value={formatDateRange(row.booking.startDate, row.booking.endDate)} />
            <Field label="Delivery to" value={row.booking.deliveryAddress} />
            <Field label="Zone" value={row.zone?.name ?? "—"} />
            <Field
              label="Window"
              value={row.booking.deliveryWindow ?? "Not specified"}
            />
            {row.booking.notes && (
              <Field label="Notes" value={row.booking.notes} />
            )}
          </dl>
        </Card>
      </div>

      <Card title="Line items" className="mt-6">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Days</th>
              <th className="text-right py-2">Rate / day</th>
              <th className="text-right py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((it, i) => (
              <tr key={i}>
                <td className="py-2">{it.atv.name}</td>
                <td className="py-2 text-right">{it.qty}</td>
                <td className="py-2 text-right">{it.days}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(parseFloat(it.unit))}</td>
                <td className="py-2 text-right font-medium">{formatCurrencyDetailed(parseFloat(it.subtotal))}</td>
              </tr>
            ))}
            {addonRows.map((ar, i) => (
              <tr key={`addon-${i}`}>
                <td className="py-2">{ar.addon.name}</td>
                <td className="py-2 text-right">{ar.qty}</td>
                <td className="py-2 text-right">{ar.days}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(parseFloat(ar.perDay))}</td>
                <td className="py-2 text-right font-medium">{formatCurrencyDetailed(parseFloat(ar.subtotal))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Totals" className="mt-6">
        <dl className="space-y-2 text-sm max-w-md ml-auto">
          <Field label="ATV subtotal" value={formatCurrencyDetailed(parseFloat(row.booking.atvSubtotal))} />
          <Field label="Add-ons" value={formatCurrencyDetailed(parseFloat(row.booking.addonsSubtotal))} />
          <Field label="Delivery" value={formatCurrencyDetailed(parseFloat(row.booking.deliveryFee))} />
          <Field label="Tax (GST + PST)" value={formatCurrencyDetailed(parseFloat(row.booking.taxAmount))} />
          <Field
            label="Refundable deposit"
            value={formatCurrencyDetailed(parseFloat(row.booking.depositTotal))}
          />
          <div className="pt-3 mt-2 border-t border-border flex justify-between font-semibold">
            <span>Total charged</span>
            <span>{formatCurrencyDetailed(parseFloat(row.booking.totalAmount))}</span>
          </div>
        </dl>
      </Card>

      <Card title="Activity" className="mt-6">
        <dl className="space-y-2 text-sm">
          <Field label="Created" value={new Date(row.booking.createdAt).toLocaleString("en-CA")} />
          {row.booking.paidAt && (
            <Field label="Paid" value={new Date(row.booking.paidAt).toLocaleString("en-CA")} />
          )}
          {row.booking.waiverSignedAt && (
            <Field
              label="Waiver signed"
              value={new Date(row.booking.waiverSignedAt).toLocaleString("en-CA")}
            />
          )}
          {row.booking.cancelledAt && (
            <Field
              label="Cancelled"
              value={new Date(row.booking.cancelledAt).toLocaleString("en-CA")}
            />
          )}
          {chat && (
            <Field
              label="Chat"
              value={
                <Link
                  href={`/admin/chats/${chat.id}`}
                  className="text-primary underline"
                >
                  View transcript ({formatDate(chat.startedAt)})
                </Link>
              }
            />
          )}
          {row.booking.stripeSessionId && (
            <Field
              label="Stripe session"
              value={<code className="font-mono text-xs">{row.booking.stripeSessionId}</code>}
            />
          )}
        </dl>
      </Card>
    </div>
  );
}

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-6 ${className ?? ""}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground flex-shrink-0">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
