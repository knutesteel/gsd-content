"use client";

import { recordPublishingHandoff } from "@/app/actions";

export function PublishingButton({ id, caption }: { id: string; caption: string }) {
  return <form action={recordPublishingHandoff} onSubmit={() => {
    void navigator.clipboard.writeText(caption);
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  }}>
    <input type="hidden" name="id" value={id} />
    <button className="primary" disabled={!caption}>Generate Post</button>
  </form>;
}
