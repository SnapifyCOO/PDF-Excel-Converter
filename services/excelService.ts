
import { ConversionResponse } from "../types";

// Declare global XLSX from script tag
declare const XLSX: any;

export const generateCsvFile = (data: ConversionResponse, fileName: string) => {
  if (!data.sheets || data.sheets.length === 0) {
    throw new Error("No data found to generate CSV file.");
  }

  // To preserve the "spread" and multi-sheet structure in a single CSV, 
  // we merge all sheets vertically with empty row separators.
  const allRows: any[][] = [];

  data.sheets.forEach((sheet, index) => {
    // Add a header-like row for the section name if there are multiple sheets
    if (data.sheets.length > 1) {
      if (allRows.length > 0) {
        allRows.push([]); // Empty row separator
        allRows.push([]); // Another empty row for visual space
      }
      allRows.push([`--- SECTION: ${sheet.name.toUpperCase()} ---`]);
    }
    
    // Add the actual rows from the sheet
    allRows.push(...sheet.rows);
  });

  // Create a worksheet from the combined rows
  const ws = XLSX.utils.aoa_to_sheet(allRows);
  
  // Convert worksheet to CSV string
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  
  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  link.setAttribute("href", url);
  link.setAttribute("download", `${baseName}_converted.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
