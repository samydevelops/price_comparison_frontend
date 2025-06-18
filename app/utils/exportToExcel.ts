import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportResultsToExcel(amazon: any[], flipkart: any[]) {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const fileName = `price_comparison_${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.xlsx`;

  const amazonSheet = amazon.map(item => ({
    Platform: 'Amazon',
    Title: item.title || '',
    Price: item.price || '',
    Link: item.link || '',
    Image: item.image || '',
  }));
  const flipkartSheet = flipkart.map(item => ({
    Platform: 'Flipkart',
    Title: item.title || '',
    Price: item.price || '',
    Link: item.link || '',
    Image: item.image || '',
  }));

  const allData = [...amazonSheet, ...flipkartSheet];
  const ws = XLSX.utils.json_to_sheet(allData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
}
