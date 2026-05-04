import Link from "next/link";
import { listUpcomingBookings } from "@/lib/services/bookings";
import { formatCurrencyDetailed } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCalendar() {
  const rows = await listUpcomingBookings(60);

  // Group by start date
  const byDay = new Map<
    string,
    Array<(typeof rows)[number]>
  >();
  for (const r of rows) {
    const day = r.booking.startDate;
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(r);
  }
  const days = Array.from(byDay.keys()).sort();

  return (
    <div className="max-w-4xl">
      <h1>Calendar</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Upcoming bookings for the next 60 days, grouped by trip start date.
      </p>

      <div className="mt-8 space-y-6">
        {days.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            No upcoming bookings yet.
          </div>
        )}

        {days.map((day) => {
          const items = byDay.get(day)!;
          const date = new Date(`${day}T00:00:00`);
          const isToday = day === new Date().toISOString().slice(0, 10);
          return (
            <div key={day}>
              <div className="flex items-baseline gap-3">
                <p className="font-display text-2xl">
                  {date.toLocaleDateString("en-CA", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {isToday && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                    Today
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? "booking" : "bookings"}
                </span>
              </div>
              <div className="mt-3 grid gap-2">
                {items.map((it) => (
                  <Link
                    key={it.booking.id}
                    href={`/admin/bookings/${it.booking.bookingNumber}`}
                    className="rounded-lg border border-border bg-card px-5 py-3 hover:border-primary hover:bg-primary-soft transition-colors flex items-center gap-4"
                  >
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${
                          it.booking.status === "confirmed"
                            ? "bg-primary-soft text-primary"
                            : it.booking.status === "hold"
                              ? "bg-accent-soft text-accent"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {it.booking.status}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {it.customer?.name ?? "—"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {it.booking.deliveryAddress}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-muted-foreground">
                        through {new Date(it.booking.endDate + "T00:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                      </div>
                      <div className="text-sm font-semibold">
                        {formatCurrencyDetailed(parseFloat(it.booking.totalAmount))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
