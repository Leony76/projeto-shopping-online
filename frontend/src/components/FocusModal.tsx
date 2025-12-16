import { 
  IoCloseCircle,
  BiMoney,
  BiWallet,
  LuBoxes,
  TiShoppingCart,
  ImBlocked,
  PiEmptyBold,
  FaCheck,
  RxCross2,
} from '../assets/icons';
import { convertPrice } from '../utils/convertPrice';
import Loading from './Loading2';
import type { FocusModalPropsType } from '../types/FocusModalPropsType';
import '../pages/Dashboard.css';
import { useState } from 'react';
import useImagePreview from "../components/ImagePreview";
import { validateProductInfoBeforeEdit } from '../utils/validateProductInfoBeforeEdit';
import { api } from '../services/api';

const FocusModal = ({
  id,
  image,
  name,
  category,
  date_put_to_sale,
  description,
  isnt_my_products_page,
  defineQuantityBeforeBuy,
  price,
  user,
  productAmountInput,
  purchase_dates,
  purchase_dates_prices,
  purchase_dates_amounts,
  purchase_dates_prices_per_unit,
  productAmount,
  purchaseConfirmModal,
  buyingState,
  admin_action,
  onChange,
  onBlur,
  onClosureModalClick,
  onSetDefineQuantityBeforeBuy,
  onSetTruePurchaseConfirmModalClick,
  onSetFalsePurchaseConfirmModalClick,
  onPurchaseCancelClick,
  handleBuy,
}:FocusModalPropsType) => {

  const [productName, setPorductName] = useState<string>(name);
  const [productCategory, setProductCategory] = useState<string>(category);
  const [productDescription, setProductDescription] = useState<string>(description);
  const [productPrice, setProductPrice] = useState<string>(String(price));
  const [productQuantity, setProductQuantity] = useState<string>(String(productAmount));

  const { 
    preview,
    inputRef, 
    file,
    handleChange,
    handleClick,
  } = useImagePreview();

  const handleEditSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    const error = validateProductInfoBeforeEdit({
      productName,
      productCategory,
      productDescription,
      productPrice,
      productQuantity,
    });

    if (error) {
      setToast({message: error, type: 'error'});
    }

    const editPayLoad = new FormData();

    if (id) editPayLoad.append("id", String(id));
    editPayLoad.append("name", productName);
    editPayLoad.append("category", productCategory);
    editPayLoad.append("description", productDescription);
    editPayLoad.append("price", productPrice);
    if (file) editPayLoad.append("image", file);
    editPayLoad.append("amount", productQuantity)

    try {
      const response = await api.post('/admin/update-product', editPayLoad, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      setToast({message: response.data.message, type: response.data.type})
      onClosureModalClick();
    } catch (err:any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erro desconhecido";
      setToast({ message: errorMessage, type: 'error' });
    }
  }

  return (
    <div className="buy-card">
      {admin_action === 'edit' ? (
        <form 
        className='buy-card'
        onSubmit={handleEditSubmit}
        >
          <img src={preview ? preview : image} alt={name} />
          <div className="buy-card-info">
            <div className="name-close">
              <h3 style={{visibility: 'hidden'}}>.</h3>
              <button 
                type="button" 
                className="close-buy-card" 
                onClick={onClosureModalClick}><IoCloseCircle size={30}/>
              </button>
            </div>
            <div className='name-field field'>
              <label htmlFor="name">Nome:</label>
              <input 
                type="text" 
                value={productName} 
                onChange={(e) => setPorductName(e.target.value)}
              />
            </div>
            <div className='category-field field'>
              <label htmlFor="category">Categoria:</label>
              <select
                onChange={(e) => setProductCategory(e.target.value)} 
                value={productCategory}
                name="category" 
                id="category"
               >
                <option value="Artesanal">Artesanal</option>
                <option value="Cozinha">Cozinha</option>
                <option value="Limpeza">Limpeza</option>
              </select>
            </div>
            <div className='description-field field'>
              <label htmlFor="description">Descrição:</label>
              <textarea 
                name="description" 
                id="description"
                onChange={(e) => setProductDescription(e.target.value)}
                value={productDescription}
              >                
              </textarea>
            </div>
            <div className='price-field field'>
              <label htmlFor="price">Preço: (R$)</label>
              <input
                type="number" 
                name="price" 
                id="price" 
                onChange={(e) => setProductPrice(e.target.value)}
                value={productPrice}
              />
            </div>
            <div className='image-amount-fields'>
              <div className='image-field field'>
                <label htmlFor="image">Imagem:</label>
                <input 
                  type="file" 
                  accept='image/*'
                  name="image" 
                  ref={inputRef}
                  id="file-input" 
                  onChange={handleChange}
                  hidden/>
                <button
                  onClick={handleClick}
                  type='button'
                >
                  Alterar Imagem
                </button>
              </div>
              <div className='amount-field field'>
                <label htmlFor="amount">Quantidade:</label>
                <input 
                  min="1" 
                  type="number" 
                  name="amount" 
                  id="amount" 
                  onChange={(e) => setProductQuantity(e.target.value)}
                  value={productQuantity}
                />
              </div>
            </div>
            <button
              className='edit-button'
              type='submit'
            >Editar</button>
          </div>
        </form>
      ) : (
        <>
      <img src={image} alt={name} />
      <div className="buy-card-info">
        <div className="buy-card-main-info">
          <div className="name-close">
            <h3>{name}</h3>
            <button type="button" className="close-buy-card" onClick={onClosureModalClick}><IoCloseCircle size={30}/></button>
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
                        <span className="dot">
                          {'•'}
                        </span>
                        <span className="amounts">
                          {purchase_dates_amounts?.[index]}x
                        </span>
                        <span className="right-arrow">
                          {'»'}
                        </span>
                        <span className="spent-per-unit">
                          R$ {purchase_dates_prices_per_unit?.[index]?.toLocaleString('pt-BR', {
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
                  <button className="buy-button" onClick={onSetDefineQuantityBeforeBuy} type="button"><TiShoppingCart size={22}/>Comprar</button>
                ) : (
                  <div className="product-amount-before-buy">
                    <div className="label-amount">
                      <label htmlFor="product_amount"><LuBoxes/>Quantidade:</label>
                      <input onChange={onChange} onBlur={onBlur} type="number" name="product_amount" id="product_amount" value={productAmountInput} min={1} max={productAmount} required/>
                    </div>
                    {price && user && (productAmountInput * price) > user.wallet ? (
                      <button disabled style={{filter: 'brightness(0.8)', cursor: 'not-allowed'}} className="buy" onClick={onSetTruePurchaseConfirmModalClick}  type="button"><TiShoppingCart/>Comprar</button>
                    ) : (
                      <button className="buy-button buy" onClick={onSetTruePurchaseConfirmModalClick}  type="button"><TiShoppingCart/>Comprar</button>
                    )}
                    <button className="cancel cancel-button" type="button" onClick={onPurchaseCancelClick}><ImBlocked size={18}/>Cancelar</button>
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
                  {buyingState ? (
                    <button style={{cursor: 'not-allowed', filter: 'brightness(0.8)'}} disabled className="cancel-button" type="button"><RxCross2 size={25}/>Não</button>
                  ) : (
                    <button className="cancel-button" type="button" onClick={onSetFalsePurchaseConfirmModalClick}><RxCross2 size={25}/>Não</button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  )
}

export default FocusModal