type Primitive = string | number | boolean | null | undefined;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

function escapeCsvValue(v: Primitive) {
  const s = (v ?? '').toString();
  const mustQuote = /[",\n]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return mustQuote ? `"${escaped}"` : escaped;
}

export function exportCSV<T extends Record<string, Primitive>>(
  rows: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (!rows.length) {
    const blob = new Blob([''], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
    return;
  }

  const keys = (columns?.map((c) => c.key) || (Object.keys(rows[0]) as (keyof T)[])) as (keyof T)[];
  const header = (columns?.map((c) => c.label) || keys.map((k) => String(k))) as string[];

  const lines: string[] = [];
  lines.push(header.map(escapeCsvValue).join(','));

  for (const row of rows) {
    lines.push(keys.map((k) => escapeCsvValue(row[k])).join(','));
  }

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}
