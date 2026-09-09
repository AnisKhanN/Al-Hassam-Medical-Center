/**
 * Export data to a formatted CSV file and trigger browser download
 * @param {string} filename - Filename without or with .csv extension
 * @param {Array<{ key: string, label: string, formatter?: Function }>} columns - Column definitions
 * @param {Array<Object>} rows - Data rows
 */
export const exportToCSV = (filename, columns, rows = []) => {
  if (!rows || rows.length === 0) {
    alert("No records to export.");
    return;
  }

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    if (str.includes('"') || str.includes(",") || str.includes("\n")) {
      str = `"${str.replace(/"/g, '""')}"`;
    } else {
      str = `"${str}"`;
    }
    return str;
  };

  // Header row
  const headerLine = columns.map((col) => escapeCSV(col.label)).join(",");

  // Data rows
  const dataLines = rows.map((row) => {
    return columns
      .map((col) => {
        let val;
        if (col.formatter) {
          val = col.formatter(row[col.key], row);
        } else {
          val = row[col.key];
        }
        return escapeCSV(val);
      })
      .join(",");
  });

  const csvContent = "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const cleanName = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.setAttribute("download", cleanName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Trigger window.print() for browser print/PDF export
 */
export const printReport = () => {
  window.print();
};
