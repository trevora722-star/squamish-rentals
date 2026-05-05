"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteBlackoutButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Remove this blackout? Customers will be able to book those dates again.")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blackouts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Couldn't remove: ${data.error ?? res.statusText}`);
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      className="text-xs font-medium text-danger hover:underline disabled:opacity-50"
    >
      {busy ? "Removing…" : "Remove"}
    </button>
  );
}
