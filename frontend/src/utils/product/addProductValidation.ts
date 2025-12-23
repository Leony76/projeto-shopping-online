import type { Product } from "../../types/Product";

type ValidationResult = {
  valid: boolean;
  message?: string;
};

export const addProductsValidation = (product: Product): ValidationResult => {
  const validations = [
    {
      condition: product.name === "",
      message: "Nome não definido",
    },
    {
      condition: product.category === "",
      message: "Categoria não selecionada",
    },
    {
      condition: product.description === "",
      message: "Descrição não preenchida",
    },
    {
      condition: product.price === 0,
      message: "Preço não definido",
    },
    {
      condition: product.amount === 0,
      message: "Quantidade não definida",
    },
    {
      condition: !product.image,
      message: "Imagem não selecionada",
    },
  ];

  for (const { condition, message } of validations) {
    if (condition) {
      return { valid: false, message };
    }
  }

  return { valid: true };
};
