export type PropsType = {
  id: number;
  price?: number;
  amount: number;
  purchase_dates_prices?: number[];

  image: string;
  name: string;
  category: string;
  date_put_to_sale: string;
  description: string;
  purchase_dates?: string[];

  isnt_my_products_page?: boolean;
};
