export type SourceRecord = { identifier: string; [key: string]: string };
export type ReconciliationRow = { identifier: string; result: "matched" | "app_only" | "sheet_only" | "conflict" | "duplicate" | "invalid"; differences: string[] };

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && quoted && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { cells.push(value.trim()); value = ""; }
    else value += char;
  }
  cells.push(value.trim());
  return cells;
}

export function parseExport(text: string): SourceRecord[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed) as unknown;
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    return rows.map((row) => Object.fromEntries(Object.entries(row as Record<string, unknown>).map(([key, value]) => [normalizeHeader(key), value == null ? "" : String(value).trim()])) as SourceRecord);
  }
  const lines = trimmed.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0]).map(normalizeHeader);
  return lines.slice(1).map((line) => Object.fromEntries(splitCsvLine(line).map((value, index) => [headers[index] ?? `column_${index + 1}`, value])) as SourceRecord);
}

function identifierOf(row: SourceRecord) {
  return String(row.identifier ?? row.id ?? row.item_identifier ?? "").trim();
}

export function reconcile(appRows: SourceRecord[], sheetRows: SourceRecord[]): ReconciliationRow[] {
  const appGroups = Map.groupBy(appRows, identifierOf);
  const sheetGroups = Map.groupBy(sheetRows, identifierOf);
  const identifiers = [...new Set([...appGroups.keys(), ...sheetGroups.keys()])].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return identifiers.map((identifier) => {
    const app = appGroups.get(identifier) ?? [];
    const sheet = sheetGroups.get(identifier) ?? [];
    if (!identifier) return { identifier: "(missing)", result: "invalid", differences: ["Identifier is blank"] };
    if (app.length > 1 || sheet.length > 1) return { identifier, result: "duplicate", differences: [`App: ${app.length}, Sheet: ${sheet.length}`] };
    if (!app.length) return { identifier, result: "sheet_only", differences: [] };
    if (!sheet.length) return { identifier, result: "app_only", differences: [] };
    const ignored = new Set(["created_at", "updated_at", "date_added"]);
    const keys = new Set([...Object.keys(app[0]), ...Object.keys(sheet[0])]);
    const differences = [...keys].filter((key) => !ignored.has(key) && String(app[0][key] ?? "").trim() !== String(sheet[0][key] ?? "").trim());
    return { identifier, result: differences.length ? "conflict" : "matched", differences };
  });
}
