import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { HowItWorks } from "@/components/site/HowItWorks";
import { FleetPreview } from "@/components/site/FleetPreview";
import { TrailHighlights } from "@/components/site/TrailHighlights";
import { Testimonials } from "@/components/site/Testimonials";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { ChatWidget } from "@/components/site/ChatWidget";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <HowItWorks />
        <FleetPreview />
        <TrailHighlights />
        <Testimonials />
        <ClosingCTA />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
