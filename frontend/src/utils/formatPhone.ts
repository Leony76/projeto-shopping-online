export const formatPhone = (value: string | null) => {
  const digits = value ? value.replace(/\D/g, "") : 'Não Definido';

  if (digits.length <= 2) {
    return `(${digits}`;
  } if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (!value) return digits;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};