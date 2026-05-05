import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blackoutDates, atvs } from "@/db/schema";
import { formatDateRange } from "@/lib/utils";
import { BlackoutForm } from "./BlackoutForm";
import { DeleteBlackoutButton } from "./DeleteBlackoutButton";

export const dynamic = "force-dynamic";

export default async function AdminBlackoutsPage() {
  const today = new Date().toISOString().slice(0, 10);

  const rows = await db
    .select({
      id: blackoutDates.id,
      startDate: blackoutDates.startDate,
      endDate: blackoutDates.endDate,
      reason: blackoutDates.reason,
      atvId: blackoutDates.atvId,
      atvName: atvs.name,
      createdAt: blackoutDates.createdAt,
    })
    .from(blackoutDates)
    .leftJoin(atvs, eq(blackoutDates.atvId, atvs.id))
    .orderBy(asc(blackoutDates.startDate));

  const upcoming = rows.filter((r) => r.endDate >= today);
  const past = rows.filter((r) => r.endDate < today);

  const fleet = await db.select({ id: atvs.id, name: atvs.name }).from(atvs);

  return (
    <div className="max-w-4xl">
      <h1>Blackout dates</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Block date ranges so customers can&apos;t book them — for time off, group
        events, maintenance, weather. The booking form, the chat agent, and the
        operator app all respect these blocks.
      </p>

      <BlackoutForm fleet={fleet} />

      <h2 className="mt-12 text-2xl">Upcoming blocks</h2>
      <div className="mt-4 space-y-2">
        {upcoming.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-5 py-6 text-center text-muted-foreground text-sm">
            No upcoming blackouts. The fleet is fully available.
          </div>
        )}
        {upcoming.map((r) => (
          <BlackoutRow
            key={r.id}
            id={r.id}
            label={formatDateRange(r.startDate, r.endDate)}
            scope={r.atvName ? `${r.atvName} only` : "Whole fleet"}
            reason={r.reason}
          />
        ))}
      </div>

      {past.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl text-muted-foreground">Past blocks</h2>
          <div className="mt-4 space-y-2 opacity-60">
            {past.slice(0, 20).map((r) => (
              <BlackoutRow
                key={r.id}
                id={r.id}
                label={formatDateRange(r.startDate, r.endDate)}
                scope={r.atvName ? `${r.atvName} only` : "Whole fleet"}
                reason={r.reason}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BlackoutRow({
  id,
  label,
  scope,
  reason,
}: {
  id: string;
  label: string;
  scope: string;
  reason: string | null;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-5 py-3 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {scope}
          {reason ? ` · ${reason}` : ""}
        </div>
      </div>
      <DeleteBlackoutButton id={id} />
    </div>
  );
}
