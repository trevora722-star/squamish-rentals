import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import { lookupGiftCard } from "@/lib/services/giftCards";
import { formatCurrencyDetailed } from "@/lib/utils";

export const metadata = {
  title: "Gift card created",
};

export const dynamic = "force-dynamic";

export default async function GiftSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const card = code ? await lookupGiftCard(code) : null;

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x mx-auto max-w-2xl py-20">
          {!card ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <h1>Couldn&apos;t find that gift card</h1>
              <p className="mt-3 text-muted-foreground">
                Double-check the link, or open the chat for help.
              </p>
              <Link href="/gift" className="btn-primary mt-6 inline-block">
                Try again
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Gift card{" "}
                  {card.giftCard.status === "pending" ? "pending" : "ready"}
                </p>
                <h1 className="mt-2">
                  {card.giftCard.status === "pending"
                    ? "Almost there."
                    : "Done — they're going to love it."}
                </h1>
              </div>

              <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary-soft to-bg p-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Gift code
                </p>
                <p className="mt-3 font-mono text-2xl sm:text-3xl font-bold tracking-wider text-primary break-all">
                  {card.giftCard.code}
                </p>
                <p className="mt-4 font-display text-3xl font-semibold">
                  {formatCurrencyDetailed(parseFloat(card.giftCard.amountCad))}{" "}
                  on us
                </p>
                {card.giftCard.recipientName && (
                  <p className="mt-1 text-sm text-fg/80">
                    For {card.giftCard.recipientName}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Valid until{" "}
                  {new Date(card.giftCard.expiresAt).toLocaleDateString("en-CA", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground space-y-2">
                <p className="font-semibold text-fg">What happens next?</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    A receipt and the gift code have been emailed to{" "}
                    <span className="font-medium text-fg">
                      {card.giftCard.purchaserEmail}
                    </span>
                    .
                  </li>
                  {card.giftCard.recipientEmail && (
                    <li>
                      A note for the recipient has been sent to{" "}
                      <span className="font-medium text-fg">
                        {card.giftCard.recipientEmail}
                      </span>
                      .
                    </li>
                  )}
                  <li>
                    The recipient enters the code at the booking form when
                    they&apos;re ready to ride. Any unused balance stays on the
                    card.
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/" className="btn-primary">
                  Back to home
                </Link>
                <Link href="/gift" className="btn-ghost">
                  Buy another gift
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
