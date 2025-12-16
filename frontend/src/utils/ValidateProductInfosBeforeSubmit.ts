export type Product = {
  name: string;
  category: string;
  description: string;
  price: string;
  amount: string;
};

export function validateProductBeforeSubmit(product: Product): string | null {
  const { 
    name, category, description, price, amount,
   } = product;

  if (!name) return "Insira o nome do produto";
  if (!category) return "Selecione a categoria do produto";
  if (!description) return "Insira a descrição do produto";
  if (!price) return "Insira o preço do produto";
  if (!amount) return "Insira a quantidade do produto";

  return null;
}
