import * as XLSX from 'xlsx';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

function escapeCsvValue(v) {
  const s = (v ?? '').toString();
  const mustQuote = /[",\n]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return mustQuote ? `"${escaped}"` : escaped;
}

export function exportCSV(rows, filename, columns) {
  if (!rows.length) {
    const blob = new Blob([''], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
    return;
  }

  const keys = columns?.map((c) => c.key) || Object.keys(rows[0]);
  const header = columns?.map((c) => c.label) || keys.map((k) => String(k));

  const lines = [];
  lines.push(header.map(escapeCsvValue).join(','));

  for (const row of rows) {
    lines.push(keys.map((k) => escapeCsvValue(row[k])).join(','));
  }

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

export function exportExcel(rows, filename, options) {
  const columns = options?.columns;
  const keys = columns?.map((c) => c.key) || (rows[0] ? Object.keys(rows[0]) : []);
  const header = columns?.map((c) => c.label) || keys.map((k) => String(k));

  const aoa = [];
  if (header.length) {
    aoa.push(header);
  }

  for (const row of rows) {
    aoa.push(keys.map((k) => (row[k] ?? null)));
  }

  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, options?.sheetName || 'Sheet1');

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}
