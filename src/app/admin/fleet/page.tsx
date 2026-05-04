import { asc } from "drizzle-orm";
import { db } from "@/db";
import { atvs } from "@/db/schema";
import { formatCurrencyDetailed } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminFleet() {
  const rows = await db.select().from(atvs).orderBy(asc(atvs.name));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1>Fleet</h1>
        <p className="text-sm text-muted-foreground">{rows.length} machines</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Skill</th>
              <th className="text-left px-4 py-3">Seats</th>
              <th className="text-right px-4 py-3">Daily</th>
              <th className="text-right px-4 py-3">Deposit</th>
              <th className="text-right px-4 py-3">Owned</th>
              <th className="text-left px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-mono text-xs">{a.slug}</td>
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3">{a.skillLevel}</td>
                <td className="px-4 py-3">{a.seats}</td>
                <td className="px-4 py-3 text-right">{formatCurrencyDetailed(parseFloat(a.dailyRate))}</td>
                <td className="px-4 py-3 text-right">{formatCurrencyDetailed(parseFloat(a.depositAmount))}</td>
                <td className="px-4 py-3 text-right">{a.quantityOwned}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      a.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {a.active ? "yes" : "no"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Inline editing isn't wired yet — for now, edit via Drizzle Studio
        (<code className="font-mono">npm run db:studio</code>) or the seed
        script.
      </p>
    </div>
  );
}
