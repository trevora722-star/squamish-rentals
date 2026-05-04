import Link from "next/link";

export const metadata = { title: "Admin · Squamish Adventure Rentals" };

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/fleet", label: "Fleet" },
  { href: "/admin/chats", label: "Chat transcripts" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border bg-card">
        <div className="container-x mx-auto max-w-7xl flex h-14 items-center justify-between">
          <Link href="/admin" className="font-display font-semibold">
            SAR · Admin
          </Link>
          <nav className="flex gap-5 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-fg">
                {n.label}
              </Link>
            ))}
            <Link href="/" className="hover:text-fg">
              View site →
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container-x mx-auto max-w-7xl py-10">
        {children}
      </main>
    </div>
  );
}
