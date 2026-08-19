"use client";

import { useFormStatus } from "react-dom";

export function RefreshInstagramButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="primary"
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {pending ? "Refreshing…" : "Refresh Now"}
    </button>
  );
}
