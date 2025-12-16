export type ProductEdit = {
  productName: string;
  productCategory: string;
  productDescription: string;
  productPrice: string;
  productQuantity: string;
};

export function validateProductInfoBeforeEdit(product: ProductEdit): string | null {
  const { 
    productName, productCategory, productDescription, productPrice, productQuantity
   } = product;

  if (!productName) return "Insira o nome do produto";
  if (!productCategory) return "Selecione a categoria do produto";
  if (!productDescription) return "Insira a descrição do produto";
  if (!productPrice) return "Insira o preço do produto";
  if (!productQuantity) return "Insira a quantidade do produto";

  return null;
}
