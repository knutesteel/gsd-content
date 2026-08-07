"use client";

import { useMemo, useState } from "react";
import { parseExport, reconcile, type SourceRecord } from "@/lib/reconciliation";
import styles from "./migration.module.css";

async function readFile(file: File | undefined, setter: (rows: SourceRecord[]) => void, setError: (message: string) => void) {
  if (!file) return;
  try { setter(parseExport(await file.text())); setError(""); }
  catch (error) { setError(error instanceof Error ? error.message : "The export could not be read."); }
}

export function ReconciliationTool() {
  const [appRows, setAppRows] = useState<SourceRecord[]>([]);
  const [sheetRows, setSheetRows] = useState<SourceRecord[]>([]);
  const [error, setError] = useState("");
  const rows = useMemo(() => reconcile(appRows, sheetRows), [appRows, sheetRows]);
  const totals = useMemo(() => Map.groupBy(rows, (row) => row.result), [rows]);

  return <>
    <div className={styles.uploads}>
      <label><span>V1 Application Export</span><small>CSV or JSON</small><input type="file" accept=".csv,.json,text/csv,application/json" onChange={(event) => readFile(event.target.files?.[0], setAppRows, setError)} /></label>
      <label><span>Google Sheet Export</span><small>CSV or JSON</small><input type="file" accept=".csv,.json,text/csv,application/json" onChange={(event) => readFile(event.target.files?.[0], setSheetRows, setError)} /></label>
    </div>
    {error && <p className={styles.error}>{error}</p>}
    <div className={styles.summary}>
      {(["matched", "app_only", "sheet_only", "conflict", "duplicate", "invalid"] as const).map((type) => <div key={type}><strong>{totals.get(type)?.length ?? 0}</strong><span>{type.replace("_", " ")}</span></div>)}
    </div>
    {!rows.length ? <p className={styles.empty}>Upload both exports to produce the reconciliation report. Files are analyzed in your browser and are not imported into the database.</p> :
      <div className={styles.tableWrap}><table><thead><tr><th>Identifier</th><th>Result</th><th>Differences</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.identifier}-${index}`}><td>{row.identifier}</td><td><span data-result={row.result}>{row.result.replace("_", " ")}</span></td><td>{row.differences.join(", ") || "—"}</td></tr>)}</tbody></table></div>}
  </>;
}
