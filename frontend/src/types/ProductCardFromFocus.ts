import type { CardPropsType } from "./CardProps";
import type { User } from "./User";

export interface ProductCardFromFocusPropsType extends CardPropsType {
  purchase_dates: string[] | undefined;
  purchase_dates_prices: number[] | undefined;
  purchase_dates_prices_per_unit: number[] | undefined;
  purchase_dates_amounts: number[] | undefined;
  user: User | null;
  amount: number;
  productAmountInput: number;
  defineQuantityBeforeBuy: boolean;
  purchaseConfirmModal: boolean;
  buyingState: boolean;
  setDefineQuantityBeforeBuy: React.Dispatch<React.SetStateAction<boolean>>;
  setProductAmountInput: React.Dispatch<React.SetStateAction<number>>;
  setPurchaseConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleBuy: (e:React.FormEvent<HTMLFormElement>) => Promise<void>;
}

