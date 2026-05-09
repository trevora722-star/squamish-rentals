import Link from "next/link";
import { listAllGiftCards } from "@/lib/services/giftCards";
import { formatCurrencyDetailed, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminGiftsPage() {
  const gifts = await listAllGiftCards();

  const issued = gifts
    .filter((g) => g.status !== "pending" && g.status !== "cancelled")
    .reduce((acc, g) => acc + parseFloat(g.amountCad), 0);
  const redeemed = gifts.reduce(
    (acc, g) => acc + parseFloat(g.redeemedCad),
    0,
  );
  const outstanding = issued - redeemed;

  return (
    <div>
      <h1>Gift cards</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        All gift cards purchased through the site, with redemption history.
      </p>

      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
        <Stat label="All-time issued" value={formatCurrencyDetailed(issued)} />
        <Stat label="Redeemed" value={formatCurrencyDetailed(redeemed)} />
        <Stat
          label="Outstanding"
          value={formatCurrencyDetailed(outstanding)}
        />
        <Stat label="Total cards" value={gifts.length} />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Buyer</th>
              <th className="text-left px-4 py-3">Recipient</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-right px-4 py-3">Used</th>
              <th className="text-right px-4 py-3">Remaining</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Expires</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {gifts.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No gift cards yet.
                </td>
              </tr>
            )}
            {gifts.map((g) => {
              const remaining =
                parseFloat(g.amountCad) - parseFloat(g.redeemedCad);
              return (
                <tr key={g.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs">{g.code}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{g.purchaserName}</div>
                    <div className="text-xs text-muted-foreground">
                      {g.purchaserEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {g.recipientName ? (
                      <>
                        <div>{g.recipientName}</div>
                        {g.recipientEmail && (
                          <div className="text-xs text-muted-foreground">
                            {g.recipientEmail}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrencyDetailed(parseFloat(g.amountCad))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrencyDetailed(parseFloat(g.redeemedCad))}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrencyDetailed(remaining)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={g.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(g.expiresAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Want to issue a comp gift? Run a SQL insert against the{" "}
        <code>gift_cards</code> table — set <code>status = active</code> and{" "}
        <code>paid_at = now()</code>. Or ask Claude Code to wire up an &quot;Issue
        comp gift&quot; button.
      </p>
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
    pending: "bg-muted text-muted-foreground",
    active: "bg-primary-soft text-primary",
    fully_redeemed: "bg-success/10 text-success",
    expired: "bg-warning/10 text-warning",
    cancelled: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? "bg-muted"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
