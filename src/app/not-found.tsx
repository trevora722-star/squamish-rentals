import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 container-x mx-auto max-w-2xl py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          404
        </p>
        <h1 className="mt-3">This trail doesn't exist.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you're looking for moved, or was never here. Try one of these
          instead.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Home</Link>
          <Link href="/fleet" className="btn-ghost">The fleet</Link>
          <Link href="/chat" className="btn-ghost">Chat with us</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
