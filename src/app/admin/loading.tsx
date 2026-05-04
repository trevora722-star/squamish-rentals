export default function AdminLoading() {
  return (
    <div className="max-w-4xl">
      <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 animate-pulse"
          >
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="mt-3 h-9 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
