import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import Link from "next/link";

export const metadata = {
  title: "Contact",
  description:
    "Reach the Squamish Adventure Rentals team — chat, email, or phone.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container-x mx-auto max-w-3xl py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Contact
          </p>
          <h1 className="mt-3">Three ways to reach us.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Chat is fastest — our assistant handles quotes and bookings around
            the clock. Email and phone go to a human (response within one
            business day).
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            <Link
              href="/chat"
              className="rounded-xl border border-border bg-card p-7 hover:border-primary hover:bg-primary-soft transition-colors"
            >
              <p className="font-display text-xl font-semibold">Chat</p>
              <p className="mt-2 text-sm text-muted-foreground">Quotes, availability, and bookings — instantly.</p>
              <p className="mt-4 text-sm font-medium text-primary">Open chat →</p>
            </Link>
            <a
              href="mailto:hello@squamishadventurerentals.com"
              className="rounded-xl border border-border bg-card p-7 hover:border-primary hover:bg-primary-soft transition-colors"
            >
              <p className="font-display text-xl font-semibold">Email</p>
              <p className="mt-2 text-sm text-muted-foreground">For longer questions or attachments.</p>
              <p className="mt-4 text-sm font-medium text-primary break-all">hello@squamishadventurerentals.com</p>
            </a>
            <a
              href="tel:+16040000000"
              className="rounded-xl border border-border bg-card p-7 hover:border-primary hover:bg-primary-soft transition-colors"
            >
              <p className="font-display text-xl font-semibold">Phone</p>
              <p className="mt-2 text-sm text-muted-foreground">For day-of-trip support.</p>
              <p className="mt-4 text-sm font-medium text-primary">+1 (604) 000-0000</p>
            </a>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card p-7">
            <p className="font-display text-lg font-semibold">Service area</p>
            <p className="mt-2 text-muted-foreground">
              Free delivery anywhere in Squamish proper. Flat-fee delivery to
              Whistler, Pemberton, the Sea-to-Sky South corridor, and Greater
              Vancouver. Out-of-zone trips on request.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
