export function BRLmoney(value: number | string | undefined) {
  const number = typeof value === "string" ? Number(value) : value;

  if (!number || isNaN(number)) return "0,00";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}
