export function date(date: string | Date): string {
  const d = new Date(date);

  return `${String(d.getUTCDate()).padStart(2,'0')}/${
    String(d.getUTCMonth()+1).padStart(2,'0')
  }/${d.getUTCFullYear()}`;
}
