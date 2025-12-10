export type CardPropsType = {
  image: string;
  name: string;
  category: string;
  date_put_to_sale: string;
  description: string;
  isnt_my_products_page: boolean | undefined;
  price: number | undefined;
  productAmount: number;
  setVisibleBuyCard: React.Dispatch<React.SetStateAction<boolean>>
}