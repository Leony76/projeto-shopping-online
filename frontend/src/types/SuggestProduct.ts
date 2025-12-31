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
  accepted?: number;
  denied?: number;
  user?: {
    id: number;
    name: string;
  }
}