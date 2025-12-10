import type React from "react";
import type { CardPropsType } from "../types/CardProps";
import type { User } from "../types/User";
import { IoCloseCircle } from "react-icons/io5";
import { BiMoney } from "react-icons/bi";
import { convertPrice } from "../utils/convertPrice";
import { BiWallet } from "react-icons/bi";
import { LuBoxes } from "react-icons/lu";
import { PiEmptyBold } from "react-icons/pi";
import Loading from "./Loading";
import { TiShoppingCart } from "react-icons/ti";
import { ImBlocked } from "react-icons/im";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

interface PropsType extends CardPropsType {
  purchase_dates: string[] | undefined;
  purchase_dates_prices: number[] | undefined;
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

const ProductCardFromFocus = ({
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
  user,
  defineQuantityBeforeBuy,
  productAmountInput,
  purchaseConfirmModal,
  buyingState,
  setVisibleBuyCard,
  setDefineQuantityBeforeBuy,
  handleBuy,
  setProductAmountInput,
  setPurchaseConfirmModal,
}:PropsType) => {
  return (
    <>
      <div className="modal-overlay"></div>
      <div className="buy-card">
        <img src={image} alt={name} />
        <div className="buy-card-info">
          <div className="buy-card-main-info">
            <div className="name-close">
              <h3>{name}</h3>
              <button type="button" className="close-buy-card" onClick={() => {
                setVisibleBuyCard(false); 
                setDefineQuantityBeforeBuy(false);
                setProductAmountInput(1);
              }}><IoCloseCircle size={30}/></button>
            </div>
            <div className="category-date">
              <p>{category}</p>
              <span>•</span>
              <p>{date_put_to_sale}</p>
            </div>
            <p style={{fontWeight: "700"}}>Descrição:</p>
            <p className="product-description">{description}</p>
          </div>
          <div className="price-buy">
            <div className="price-amount">
            {isnt_my_products_page ? (
              !defineQuantityBeforeBuy ? (
                <p className="product-price"><BiMoney/> R$ {price ? convertPrice(price) : '?'}</p>
              ) : (
                price && user && (
                  <p className="product-price" style={(price * productAmountInput) > user?.wallet ? {color: 'red'} : {}}><BiMoney/> R$ {convertPrice(price * productAmountInput)} <span className="x">x</span> <span className="amount">{productAmountInput}</span></p>
                )
              )
            ) : (
              <div>
                <div className="transaction-dates">
                  <span className="title">Transações:</span>
                  <span>
                  {purchase_dates && purchase_dates?.length > 0 ? (
                    <ul  className="transaction-list-container">
                      {purchase_dates.map((date: string, index: number) => (
                        <li key={index}>
                          <span className="date">
                            {new Date(date).toLocaleString('pt-BR', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </span>
                          <span className="dot">
                            {'•'}
                          </span>
                          <span className="spent">
                            -R$ {purchase_dates_prices?.[index]?.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2
                            })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'Nenhuma transação realizada'
                  )}
                  </span>
                </div>
              </div>
            )}
            {productAmount < 1 ? (
              <p style={{color: 'red', fontSize: '20px'}} className={`amount-label ${!isnt_my_products_page ? 'big-box' : ''}`}><LuBoxes color="red"/>{productAmount}</p>
            ) : (
              <p style={{fontSize: '20px'}} className={`amount-label ${!isnt_my_products_page ? 'big-box' : ''}`}><LuBoxes/>{productAmount}</p>
            )}
            </div>
            {isnt_my_products_page && !user?.admin && (
              <p className="user-wallet"><BiWallet/>R$ {user ? convertPrice(user.wallet) : '??'}</p>
            )}
            {isnt_my_products_page && (
              !user?.admin && (
                productAmount > 0 ? (
                  !defineQuantityBeforeBuy ? (
                    <button className="buy-button" onClick={() => setDefineQuantityBeforeBuy(true)} type="button"><TiShoppingCart size={22}/>Comprar</button>
                  ) : (
                    <div className="product-amount-before-buy">
                      <div className="label-amount">
                        <label htmlFor="product_amount"><LuBoxes/>Quantidade:</label>
                        <input onChange={(e) => {
                          const number = Number(e.target.value);

                          if (number > productAmount)return;

                          setProductAmountInput(number);
                        }} onBlur={() => {
                          if (!productAmountInput || productAmountInput < 1) {
                            setProductAmountInput(1);
                          }
                        }} type="number" name="product_amount" id="product_amount" value={productAmountInput} min={1} max={productAmount} required/>
                      </div>
                      {price && user && (productAmountInput * price) > user.wallet ? (
                        <button disabled style={{filter: 'brightness(0.8)', cursor: 'not-allowed'}} className="buy" onClick={() => setPurchaseConfirmModal(true)}  type="button"><TiShoppingCart/>Comprar</button>
                      ) : (
                        <button className="buy-button buy" onClick={() => setPurchaseConfirmModal(true)}  type="button"><TiShoppingCart/>Comprar</button>
                      )}
                      <button className="cancel cancel-button" type="button" onClick={() => {
                        setDefineQuantityBeforeBuy(false); 
                        setProductAmountInput(1)
                      }}><ImBlocked size={18}/>Cancelar</button>
                    </div>
                  )
                ) : (
                  <div className="outta-stock"><PiEmptyBold/> Fora de Estoque!</div>
                )
              )  
            )}
            {purchaseConfirmModal && (
              <>
                <div className="purchase-modal-overlay"></div>
                <form className="purchase-confirm-card" onSubmit={handleBuy}>
                  <h3>Confirmar Compra</h3>
                  <p>Deseja mesmo comprar <span style={{color: 'tomato'}}>{productAmountInput}</span> unidade(s) desse produto por <span style={{color: 'rgb(0, 114, 0)'}}>R$ {price ? convertPrice(price * productAmountInput): '?'}</span> ?</p>
                  <p>Seu saldo será de <span style={{color: 'rgb(0, 175, 0)'}}>R$ {user && price ? convertPrice(user.wallet - (price * productAmountInput)) : '?'}</span> após a compra.</p>
                  <div className="buttons">
                    <button className="buy-button" type="submit">{buyingState  ? <Loading/> : <FaCheck/>}{buyingState ? 'Comprando' : 'Sim'}</button>
                    <button className="cancel-button" type="button" onClick={() => setPurchaseConfirmModal(false)}><RxCross2 size={25}/>Não</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCardFromFocus