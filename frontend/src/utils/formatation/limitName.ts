export function limitName(name: string | undefined, maxParts: number) {
  if (!name)return;
  return name
    .trim()
    .split(/\s+/)  
    .slice(0, maxParts)
    .join(' ');
}
