import { convertPrice } from "../utils/convertPrice";
import type { CardPropsType } from "../types/CardProps";
import { 
  LuBoxes,
  GiGemNecklace, 
  FaKitchenSet,
  BiMoney,
  LiaBroomSolid,
  FaCalendarAlt,
  FiEye,
  MdEditSquare,
} from '../assets/icons';

const ProductCardFromGrid = ({
  image,
  name,
  category,
  date_put_to_sale,
  price,
  isnt_my_products_page,
  productAmount,
  admin_action,
  setVisibleBuyCard
}:CardPropsType) => {
  return (
    <>
      <div className="product-card-info">
        <img src={image ? image : '[placeholder]'} alt={name ? name : '??'} />
        <h3>{name ? name : '??'}</h3>
        <div className="category-date">
          <p className="category-label">{category === 'Limpeza' ? <LiaBroomSolid/> : category === 'Artesanal' ?  <GiGemNecklace/> : <FaKitchenSet/>}{category ? category : '??'}</p>
          <span>•</span>
          <p className="date-label"><FaCalendarAlt/>{date_put_to_sale ? date_put_to_sale : '??'}</p>
        </div>
      </div>
      <div className="price-buy">
        <div className="price-amount">
          {isnt_my_products_page && price !== undefined && (
            <p className="product-price"><BiMoney/>R$ {convertPrice(price)}</p>
          )}
          {productAmount < 1 ? (
            <p className="amount-label" style={{color: 'red'}}><LuBoxes color="red"/>{productAmount}</p>
          ) : (
            <p className="amount-label"><LuBoxes/>{productAmount}</p>
          )}
        </div>
        {admin_action === 'edit' ? (
          <button className="buy-button" style={{gap: '5px'}} onClick={() => setVisibleBuyCard(true)}><MdEditSquare/>Editar</button>
        ) : (
          <button className="buy-button" style={{gap: '5px'}} onClick={() => setVisibleBuyCard(true)}><FiEye/>Ver Informações</button>
        )}
      </div>
    </>
  )
}

export default ProductCardFromGrid