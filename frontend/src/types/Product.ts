export type Product = {
  id?: number;
  name: string;
  category: "Artesanal" | "Cozinha" | "Limpeza" | "Eletrônico" | "Móveis" | "";
  description: string;
  price: number | string;
  amount: number | string;
  image: string | File | null;
  image_url?: string;
  created_at: string;
  updated_at: string;
}