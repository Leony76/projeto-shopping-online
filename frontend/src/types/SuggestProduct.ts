export type ProductSuggest = {
  name: string;
  category: "" | "Artesanal" | "Cozinha" | "Limpeza" | "Eletrônico" | "Móveis";
  image: File | null;
  imagePreview: string | null;
  description: string;
  price: string;

  id?: number;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  accepted?: boolean;
  denied?: boolean;
  for_sale?: boolean;
  user?: {
    id: number;
    name: string;
  }
}