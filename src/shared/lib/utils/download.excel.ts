// XLSX export using SheetJS (xlsx)
import * as XLSX from 'xlsx';

export const downloadXLSX = (data: any[], filename = 'data') => {
  if (!data || data.length === 0) return;

  // Create worksheet from JSON. json_to_sheet will infer headers from keys.
  const ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });

  // Create a new workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Write workbook to array buffer
  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Create blob and download
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};