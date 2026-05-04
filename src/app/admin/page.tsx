import { sql, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { bookings, atvs, chatSessions } from "@/db/schema";
import { formatCurrencyDetailed } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [stats] = await db
    .select({
      totalBookings: sql<number>`count(*)::int`,
      paidBookings: sql<number>`count(*) filter (where status = 'confirmed')::int`,
      heldBookings: sql<number>`count(*) filter (where status = 'hold')::int`,
      revenueCad: sql<string>`coalesce(sum(case when status = 'confirmed' then total_amount else 0 end), 0)::text`,
    })
    .from(bookings);

  const [fleetCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(atvs)
    .where(eq(atvs.active, true));

  const [activeChats] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(chatSessions)
    .where(gte(chatSessions.lastMessageAt, sql`now() - interval '24 hours'`));

  return (
    <div>
      <h1>Overview</h1>
      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
        <Stat label="Total bookings" value={stats?.totalBookings ?? 0} />
        <Stat label="Confirmed" value={stats?.paidBookings ?? 0} />
        <Stat label="In hold" value={stats?.heldBookings ?? 0} />
        <Stat
          label="Confirmed revenue"
          value={formatCurrencyDetailed(parseFloat(stats?.revenueCad ?? "0"))}
        />
        <Stat label="Active fleet" value={fleetCount?.count ?? 0} />
        <Stat label="Chats (24h)" value={activeChats?.count ?? 0} />
      </div>

      <p className="mt-12 text-sm text-muted-foreground max-w-2xl">
        This is the admin overview. Use the nav to manage bookings, the fleet,
        or review chat transcripts. Real auth (Auth.js with magic links) is on
        the to-do list — for now this is gated by HTTP Basic against
        <code className="font-mono mx-1.5">ADMIN_USER</code>/
        <code className="font-mono mx-1.5">ADMIN_PASSWORD</code> in your env.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl text-primary">{value}</p>
    </div>
  );
}
