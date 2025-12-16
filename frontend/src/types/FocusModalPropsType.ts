import type { User } from "./User";

export type FocusModalPropsType = {
  id?: number;
  image: string;
  name: string;
  category: string;
  date_put_to_sale: string;
  description: string;
  isnt_my_products_page: boolean | undefined;
  purchase_dates: string[] | undefined;
  purchase_dates_prices: number[] | undefined;
  purchase_dates_prices_per_unit: number[] | undefined;
  purchase_dates_amounts: number[] | undefined;
  user: User | null;
  productAmountInput: number;
  defineQuantityBeforeBuy: boolean;
  purchaseConfirmModal: boolean;
  admin_action?: 'edit' | 'remove';
  buyingState: boolean;
  price: number | undefined;
  productAmount: number;
  onClosureModalClick: () => void;
  onSetDefineQuantityBeforeBuy: () => void;
  onSetTruePurchaseConfirmModalClick: () => void;
  onSetFalsePurchaseConfirmModalClick: () => void;
  onPurchaseCancelClick: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onBlur: React.FocusEventHandler<HTMLInputElement> | undefined;
  handleBuy: (e:React.FormEvent<HTMLFormElement>) => Promise<void>;
}