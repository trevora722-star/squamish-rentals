import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import { PageBanner } from "@/components/site/PageBanner";
import { GiftPurchaseForm } from "@/components/gift/GiftPurchaseForm";

export const metadata = {
  title: "Gift a ride",
  description:
    "Give the gift of a Sea-to-Sky ATV adventure. Choose any amount, send a personal message, recipient redeems at booking.",
};

export default function GiftPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageBanner
          imageSrc="/images/kawasaki-atv.webp"
          eyebrow="Gift a ride"
          headline="The gift of a day on the trail."
          subhead="Pick any amount from $50 up. They get a personal note, a code to redeem at booking, and 24 months to use it."
          height="md"
        />

        <section className="container-x mx-auto max-w-2xl py-16">
          <GiftPurchaseForm />

          <div className="mt-12 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground space-y-3">
            <p className="font-display text-lg font-semibold text-fg">
              How it works
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Pick the amount and add a note for the recipient.</li>
              <li>
                Pay securely with Stripe — you&apos;ll get an email with the gift
                code right away.
              </li>
              <li>
                If you added their email, we&apos;ll send them a separate note
                with the same code.
              </li>
              <li>
                They redeem it at booking by entering the code on the booking
                form. Any leftover balance stays on the card for next time.
              </li>
            </ol>
            <p className="mt-3">
              Valid for 24 months. Non-refundable. Transferable. Combinable with
              other discounts.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
