export type Product = {
  id?: number;
  name: string;
  category: 'Artesanal' | 'Cozinha' | 'Limpeza' | '';
  description: string;
  price: number | string;
  amount: number | string;
  image: string | File | null;
  image_url?: string;
  datePutToSale?: string;
}