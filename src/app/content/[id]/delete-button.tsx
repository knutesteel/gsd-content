"use client";

import { deleteItem } from "@/app/actions";

export function DeleteButton({ id, identifier }: { id: string; identifier: string }) {
  return <form action={deleteItem} onSubmit={(event) => {
    if (!window.confirm(`Permanently delete item ${identifier}? This cannot be undone.`)) event.preventDefault();
  }}>
    <input type="hidden" name="id" value={id} />
    <button className="danger">Delete</button>
  </form>;
}
