export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  created_at: string;
  amount: string;
  purchase_dates: string[];
  prices: number[];
  prices_per_unit: number[];
  amounts: number[];
  pivot: any;

  products: any[];
};
