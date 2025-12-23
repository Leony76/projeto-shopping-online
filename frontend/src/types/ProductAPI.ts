export type ProductAPI = {
  id: number;
  name: string;
  category: "Artesanal" | "Cozinha" | "Limpeza" | "";
  description: string;
  price: number;
  amount: number;
  image: string;
  image_url: string;
  datePutToSale: string;
  selectedAmount?: number;
  quantity: number;
};
