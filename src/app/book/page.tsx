import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/site/ChatWidget";
import { PageBanner } from "@/components/site/PageBanner";
import { BookingForm } from "@/components/book/BookingForm";

export const metadata = {
  title: "Book your ATVs",
  description:
    "Pick your dates, your group size, and your delivery address. Secure your machines in under two minutes.",
};

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageBanner
          imageSrc="/images/kawasaki-atv.webp"
          eyebrow="Book online"
          headline="Lock in your dates."
          subhead="Pick your dates, how many ATVs you want, and where to deliver. We'll quote you and take you straight to checkout."
          height="md"
        />

        <section className="container-x mx-auto max-w-3xl pt-10 pb-6">
          <p className="text-sm text-muted-foreground">
            Prefer to chat through it instead?{" "}
            <a href="/chat" className="text-primary underline underline-offset-2">
              Talk to our booking assistant
            </a>{" "}
            — same outcome, fewer clicks.
          </p>
        </section>

        <section className="container-x mx-auto max-w-3xl pb-24">
          <BookingForm />
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
