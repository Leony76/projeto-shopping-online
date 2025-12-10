import { useState, useEffect } from "react";
import type { PropsType } from "../types/ProductCard";
import { buyProduct } from "../services/buyProduct";
import Toast from "./Toast";
import { useUser } from "../context/UserContext";
import CardFromGrid from "./ProductCardFromGrid";
import CardFromFocus from "./ProductCardFromFocus";

const ProductCard = ({
  image,
  name,
  category,
  date_put_to_sale,
  description,
  price,
  amount,
  id,
  purchase_dates,
  purchase_dates_prices,
  isnt_my_products_page,
}:PropsType) => {
  const { user, setUser } = useUser();

  const [visibleBuyCard, setVisibleBuyCard] = useState<boolean>(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>();
  const [productAmount, setProductAmount] = useState<number>(amount);
  const [defineQuantityBeforeBuy, setDefineQuantityBeforeBuy] = useState<boolean>(false);
  const [productAmountInput, setProductAmountInput] = useState<number>(1);
  const [purchaseConfirmModal, setPurchaseConfirmModal] = useState<boolean>(false);
  const [buyingState, setBuyingState] = useState<boolean>(false);

  const handleBuy = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buyingState)return;

    setBuyingState(true);

    try {
      const response = await buyProduct({id, productAmountInput});
      setToast({message: response.data.message, type: response.data.type});
      setUser(prev => {
        if (!prev) return prev;

          return {
            ...prev,
            wallet: response.data.wallet
          };
        }
      );
      setProductAmount(response.data.remaining_stock);
    } catch (err:any) {
      setToast({message: err.response?.data?.message, type: 'error'});
      return;
    } finally {
      setVisibleBuyCard(false);
      setDefineQuantityBeforeBuy(false);
      setPurchaseConfirmModal(false);
      setBuyingState(false);
      setProductAmountInput(1);
    }
  }

  useEffect(() => {
    if (!toast)return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="product-card">
      {toast && (
        <Toast message={toast.message} type={toast.type}/>
      )}
      <CardFromGrid
        image={image}
        name={name}
        category={category}
        date_put_to_sale={date_put_to_sale}
        description={description}
        price={price}
        isnt_my_products_page={isnt_my_products_page}
        productAmount={productAmount}
        setVisibleBuyCard={setVisibleBuyCard}
      />
      {visibleBuyCard && (
        <CardFromFocus
          image={image}
          name={name}
          category={category}
          date_put_to_sale={date_put_to_sale}
          description={description}
          price={price}
          isnt_my_products_page={isnt_my_products_page}
          productAmount={productAmount}
          purchase_dates={purchase_dates}
          purchase_dates_prices={purchase_dates_prices}
          user={user}
          amount={amount}
          setVisibleBuyCard={setVisibleBuyCard}
          handleBuy={handleBuy}
          defineQuantityBeforeBuy={defineQuantityBeforeBuy}
          setDefineQuantityBeforeBuy={setDefineQuantityBeforeBuy}
          productAmountInput={productAmountInput}
          setProductAmountInput={setProductAmountInput}
          purchaseConfirmModal={purchaseConfirmModal}
          setPurchaseConfirmModal={setPurchaseConfirmModal}
          buyingState={buyingState}
        />
      )}
    </div>
  )
}

export default ProductCard;