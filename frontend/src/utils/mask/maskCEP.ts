export function maskCEP(value: string) {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 5) {
    return numbers;
  }

  return numbers
    .replace(/(\d{5})(\d+)/, '$1-$2')
    .slice(0, 9);
}
