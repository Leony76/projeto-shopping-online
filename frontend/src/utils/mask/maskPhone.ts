export function maskPhone(value: string) {
  const numbers = value.replace(/\D/g, '');

  // DDD
  if (numbers.length <= 2) {
    return numbers.replace(/(\d{0,2})/, '($1');
  }

  // Fixo (até 10 dígitos)
  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
      .slice(0, 14); // (xx) xxxx-xxxx
  }

  // Celular (11 dígitos)
  return numbers
    .replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3')
    .slice(0, 15); // (xx) xxxxx-xxxx
}

