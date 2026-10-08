//AI GENERATED UTIL
export function formatDateToDDMMYYYY(date: Date | string): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}