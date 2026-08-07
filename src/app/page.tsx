import styles from "./page.module.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./login/actions";

const milestones = [
  { label: "Foundation", detail: "Next.js, schema, security, and environment contract", state: "Active" },
  { label: "Migration", detail: "Reconcile application and Google Sheet records", state: "Queued" },
  { label: "Workflow Parity", detail: "Discovery, generation, publishing, and archive", state: "Queued" },
  { label: "Cutover", detail: "Parallel validation and production promotion", state: "Queued" },
];

const capabilities = [
  "Single authoritative content record",
  "Numeric identifiers and numbered variants",
  "Version-safe generation and regeneration",
  "Status, activity, and processing history",
  "Sources, assets, metrics, and scheduled jobs",
  "CSV export without operational spreadsheet sync",
];

export default async function Home() {
  const supabase = await createClient();
  const { count } = await supabase.from("content_items").select("id", { count: "exact", head: true });
  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>GSD Content · V2</p>
        <h1>One source of truth.<br />Zero spreadsheet drama.</h1>
        <p className={styles.lede}>
          The new content operating system is being built on PostgreSQL while preserving the workflows that already run the Hank and the Squirrel brand.
        </p>
        <div className={styles.actions}><Link href="/migration">Open Reconciliation Tool</Link><form action={logout}><button>Sign Out</button></form></div>
        <div className={styles.status}><span /> Supabase connected · {count ?? 0} content records</div>
      </section>

      <section className={styles.grid} aria-label="Migration milestones">
        {milestones.map((milestone, index) => (
          <article className={styles.card} key={milestone.label}>
            <div className={styles.cardTop}><span>0{index + 1}</span><small data-active={milestone.state === "Active"}>{milestone.state}</small></div>
            <h2>{milestone.label}</h2>
            <p>{milestone.detail}</p>
          </article>
        ))}
      </section>

      <section className={styles.foundation}>
        <div>
          <p className={styles.eyebrow}>Foundation Scope</p>
          <h2>Built to prevent the failures V1 could not.</h2>
        </div>
        <ul>{capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
      </section>
    </main>
  );
}
