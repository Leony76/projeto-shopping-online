export function limitName(name: string, maxParts: number) {
  return name
    .trim()
    .split(/\s+/)  
    .slice(0, maxParts)
    .join(' ');
}
