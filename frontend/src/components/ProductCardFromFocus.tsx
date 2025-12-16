import type { ProductCardFromFocusPropsType } from "../types/ProductCardFromFocus";
import FocusModal from "./FocusModal";

const ProductCardFromFocus = ({
  id,
  image,
  name,
  category,
  date_put_to_sale,
  description,
  price,
  isnt_my_products_page,
  productAmount,
  purchase_dates,
  purchase_dates_prices,
  purchase_dates_prices_per_unit,
  purchase_dates_amounts,
  user,
  defineQuantityBeforeBuy,
  productAmountInput,
  purchaseConfirmModal,
  buyingState,
  admin_action,
  setVisibleBuyCard,
  setDefineQuantityBeforeBuy,
  handleBuy,
  setProductAmountInput,
  setPurchaseConfirmModal,
}:ProductCardFromFocusPropsType) => {
  return (
    <>
      <div className="modal-overlay"></div>
      {admin_action === 'edit' ? (
        <FocusModal
          id={id}
          admin_action={admin_action}
          image={image}
          name={name}
          category={category}
          date_put_to_sale={date_put_to_sale}
          description={description}
          isnt_my_products_page={isnt_my_products_page}
          defineQuantityBeforeBuy={defineQuantityBeforeBuy}
          price={price}
          user={user}
          productAmountInput={productAmountInput}
          purchase_dates={purchase_dates}
          purchase_dates_prices={purchase_dates_prices}
          purchase_dates_amounts={purchase_dates_amounts}
          purchase_dates_prices_per_unit={purchase_dates_prices_per_unit}
          productAmount={productAmount}
          purchaseConfirmModal={purchaseConfirmModal}
          buyingState={buyingState}
          onChange={(e) => {const number = Number(e.target.value); if (number > productAmount) return; setProductAmountInput(number);}}
          onBlur={() => {if (!productAmountInput || productAmountInput < 1) setProductAmountInput(1)}}
          onClosureModalClick={() => {setVisibleBuyCard(false);setDefineQuantityBeforeBuy(false); setProductAmountInput(1);}}
          onSetDefineQuantityBeforeBuy={() => setDefineQuantityBeforeBuy(true)}
          onSetTruePurchaseConfirmModalClick={() => setPurchaseConfirmModal(true)}
          onSetFalsePurchaseConfirmModalClick={() => setPurchaseConfirmModal(false)}
          onPurchaseCancelClick={() => { setDefineQuantityBeforeBuy(false); setProductAmountInput(1)}}
          handleBuy={handleBuy}
        />
      ) : (
        <FocusModal
          image={image}
          name={name}
          category={category}
          date_put_to_sale={date_put_to_sale}
          description={description}
          isnt_my_products_page={isnt_my_products_page}
          defineQuantityBeforeBuy={defineQuantityBeforeBuy}
          price={price}
          user={user}
          productAmountInput={productAmountInput}
          purchase_dates={purchase_dates}
          purchase_dates_prices={purchase_dates_prices}
          purchase_dates_amounts={purchase_dates_amounts}
          purchase_dates_prices_per_unit={purchase_dates_prices_per_unit}
          productAmount={productAmount}
          purchaseConfirmModal={purchaseConfirmModal}
          buyingState={buyingState}
          onChange={(e) => { const number = Number(e.target.value); if (number > productAmount) return; setProductAmountInput(number);}}
          onBlur={() => { if (!productAmountInput || productAmountInput < 1) setProductAmountInput(1);}}
          onClosureModalClick={() => { setVisibleBuyCard(false); setDefineQuantityBeforeBuy(false); setProductAmountInput(1);}}
          onSetDefineQuantityBeforeBuy={() => setDefineQuantityBeforeBuy(true)}
          onSetTruePurchaseConfirmModalClick={() => setPurchaseConfirmModal(true)}
          onSetFalsePurchaseConfirmModalClick={() => setPurchaseConfirmModal(false)}
          onPurchaseCancelClick={() => { setDefineQuantityBeforeBuy(false); setProductAmountInput(1)}}
          handleBuy={handleBuy}
        />
      )}
    </>
  )
}

export default ProductCardFromFocus