export type ProductAPI = {
  id: number;
  name: string;
  category: "Artesanal" | "Cozinha" | "Limpeza" | "Eletrônico" | "Móveis" | "";
  description: string;
  price: number;
  amount: number;
  image: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  selectedAmount?: number;
  quantity: number;
  product_rate_avg_rating: number | null;
  product_rate_count: number | null;
  orders_sum_quantity: number | null;
  user_rating?: number | null;
};
