export function isDateFromFuture(date: string): boolean {
  if (!date) return false;

  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  return date > today;
}
