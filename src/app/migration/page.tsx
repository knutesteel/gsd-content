import Link from "next/link";
import { ReconciliationTool } from "./reconciliation-tool";
import styles from "./migration.module.css";

export default function MigrationPage() {
  return <main className={styles.shell}>
    <nav><Link href="/">← Dashboard</Link></nav>
    <header><p className={styles.eyebrow}>Milestone 2</p><h1>Migration Reconciliation</h1><p>Account for every V1 record before anything is written to the new source of truth.</p></header>
    <ReconciliationTool />
  </main>;
}
