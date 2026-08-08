"use client";

import { useFormStatus } from "react-dom";

export function GenerateContentButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary" type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Generating Content…" : "Generate Content and Prompt"}
    </button>
  );
}
