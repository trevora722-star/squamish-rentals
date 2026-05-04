export default function RootLoading() {
  return (
    <div className="flex-1 container-x mx-auto max-w-7xl py-20">
      <div className="h-12 w-64 rounded-md bg-muted animate-pulse" />
      <div className="mt-6 h-4 w-96 rounded bg-muted animate-pulse" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 animate-pulse"
          >
            <div className="aspect-[16/10] rounded-lg bg-muted" />
            <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
