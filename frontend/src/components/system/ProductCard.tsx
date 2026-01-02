import type { User } from "../../types/User";
import type { UIFlags } from "../../types/UIFlags";
import type { ProductAPI } from "../../types/ProductAPI";

import { dateTime } from "../../utils/formatation/dateTime";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useToast } from "../../context/ToastContext";
import { TbCurrencyDollarOff } from "react-icons/tb";
import { FaCashRegister, FaCircleArrowRight } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { CiTextAlignLeft } from "react-icons/ci";
import { MdOutlineBlock, MdPeopleAlt } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { GiCardboardBox } from "react-icons/gi";
import { BiCheckCircle } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";
import { FaWallet } from "react-icons/fa6";
import { BiDollar } from "react-icons/bi";
import { LuBoxes } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

import XCloseTopRight from "../ui/XCloseTopRight";
import ProceedActionButton from "../ui/ProceedActionButton";
import ReturnActionButton from "../ui/ReturnActionButton";
import ConfirmDecision from "../ui/ConfirmDecision";
import CategoryIcon from "../ui/CategoryIcon";
import RatingStars from "../ui/RatingStars";
import RatingCount from "../ui/RatingCount";
import SoldAmount from "../ui/SoldAmount";
import Money from "../ui/Money";
import Stock from "../ui/Stock";
import GoBackArrow from "../ui/ProductCardGoBackArrow";
import CardFocusOverlay from "../ui/CardFocusOverlay";

type Actions = {
  setFlags: React.Dispatch<React.SetStateAction<UIFlags>>;
  setProduct: React.Dispatch<React.SetStateAction<ProductAPI | null>>;
  handleBuySubmit?: (e:React.FormEvent<HTMLFormElement>) => Promise<void>;
};

type ProductCard = {
  product: ProductAPI | null;
  actions: Actions;
  flags: UIFlags;
  user: User | null;
}

const ProductCard = ({
  flags,
  product,
  actions,
  user,
}:ProductCard) => {

  const { addToCart, cart } = useCart();

  const cartProductAmount = cart.find(c => c.productId === product?.id); 
  
  const cartAmount = cartProductAmount?.amount ?? 0;
  const selectedAmount = product?.selectedAmount ?? 1;
  const stock = product?.amount ?? 0;

  const exceedsStock = cartAmount + selectedAmount > stock;

  const { showToast } = useToast();

  const formattedTotalPrice = product ? BRLmoney(product.price * (product.selectedAmount ?? 1)): 0;
  const totalPrice = product ? product.price * (product.selectedAmount ?? 1): 0;
  const userWalletIfProductBought = BRLmoney(Number(user?.wallet) - Number(product ? product.price * (product.selectedAmount ?? 1) : 0));
  
  const [addToCartConfirm, setAddToCartConfirm] = useState<boolean>(false); 

  return (
    <div className="flex lg:flex-row flex-col lg:gap-3 fixed top-1/2 lg:w-[1000px] w-[450px] z-50 lg:py-1 left-1/2 translate-[-50%] border-y-4 border-double border-cyan-500 bg-gray-100">
      <figure className="flex-[1] max-h-[400px] lg:ml-3 m-2 flex items-center justify-center">
        <img className="h-full w-full border-2 border-gray-200 lg:p-1 p-1 lg:my-1 lg:ml-1.5" src={product?.image_url} alt={product?.name} />
      </figure>
      <div className="flex flex-col lg:mt-0 mt-[-5px] lg:px-0 px-2 lg:mt-2 lg:ml-[-5px] justify-between flex-[1.5] lg:mr-[16px]">
        <div>
          <div>
            {flags.showProductAmount && <GoBackArrow onClick={() => actions.setFlags(prev => ({...prev, showProductAmount: false}))}/>}
            <XCloseTopRight closeSetter={() => {
              actions.setFlags(prev => ({...prev, showProductInfo: false}));
              actions.setFlags(prev => ({...prev, showProductAmount: false}));
            }}/>
          </div>
          <h4 className="text-xl font-semibold text-orange-800">{product?.name}</h4>
          <div className="flex lg:flex-row text-sm flex-col lg:items-center font-normal text-[#104E64] mt-[-5px] gap-1 pt-2">
            <CategoryIcon style="lg:!text-sm !text-base lg:mt-0 mt-[-5px]" category={product?.category ?? 'Artesanal'}/>
            <span className="text-[10px] lg:block hidden">●</span>
            <div className="flex lg:mt-0 mt-[-5px] gap-1">
              <p className="flex text-xs items-center gap-[3px]"><FaCalendarAlt/> Foi à venda - {(dateTime(product?.created_at))}</p>
              {product?.created_at !== product?.updated_at && (<p className="flex text-xs items-center gap-[1px] border-l-2 border-gray-300 pl-1"><AiFillEdit/> Sofreu alteração - {(dateTime(product?.updated_at))}</p>)}
            </div>
          </div>
          <label className="flex items-center gap-1"><CiTextAlignLeft className="mt-[2px]"/>Decrição:</label>
          <p className="custom-scroll lg:mb-0 mb-1.5 text-gray-700 text-[13px] border-gray-400 col max-h-30  overflow-y-auto">{product?.description}</p>
        </div>
        
        {!flags.showProductAmount ? (
          <div className="mb-3">
            <div className="flex items-center border-t-1 border-gray-500 justify-between">
              <div className="flex lg:text-base text-sm gap-1 my-[5px] border-gray-400 mx-1 py-1 font-semibold">
                <Money value={product?.price}/>
                <Stock border="left" stock={product?.amount}/>
                <SoldAmount border="left" soldAmount={product?.orders_sum_quantity}/>
              </div>
              <div className="flex lg:text-base text-sm items-center">
                <RatingStars
                  elements={{
                    name: `${!product?.product_rate_avg_rating ? 'N/A' : '' + product.product_rate_avg_rating.toFixed(1).replace('.',',')}`,
                    rating: product?.product_rate_avg_rating ?? 0,
                  }}
                  flags={{hovering: false}}
                />
                <RatingCount border="left" rateCount={product?.product_rate_count}/>
              </div>
            </div>
            <div className="flex gap-2">
              {product && !user?.admin && (
                product && Number(user?.wallet) < product.price ? (
                  <ProceedActionButton
                    iconButton={TbCurrencyDollarOff}
                    iconButtonSize={20}
                    styles="text-red-500 bg-red-100 border-red-500 hover:brightness-[.9] cursor-not-allowed"
                    buttonLabel={"Saldo Insuficiente para a compra"}
                    disable={true}
                  />
                ) : product.amount > 0 ? (
                  <ProceedActionButton
                    onClick={() => actions.setFlags(prev => ({...prev, showProductAmount: true}))}
                    iconButton={FaCircleArrowRight}
                    iconButtonSize={20}
                    buttonLabel={"Prosseguir"}
                  />
                ) : (
                  <ProceedActionButton
                    onClick={() => actions.setFlags(prev => ({...prev, showProductAmount: true}))}
                    iconButton={GiCardboardBox}
                    iconButtonSize={20}
                    styles="text-red-500 bg-red-100 hover:brightness-[.9] cursor-not-allowed"
                    buttonLabel={"Produto Fora de Estoque"}
                    disable={true}
                  />
                )
              )}
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <div className="flex justify-between border-t-1 gap-2 my-[5px] border-gray-400 mx-1 py-1 font-semibold">
              {product && (
                <>
                  <div className="flex gap-3">
                    <p title="$ Preço total pelas unidades" className="text-green-800 flex items-center border-r-1 pr-3 gap-1"><FaMoneyBill/>R$ {totalPrice !== 0 ? formattedTotalPrice : BRLmoney(product.price)} <IoClose color="gray"/> <span className="text-orange-500">{product.selectedAmount ?? 1}</span></p>
                    <p title="⁂ Unidades" className={`flex items-center gap-1 text-orange-500 ${(product.selectedAmount && product.amount - product.selectedAmount === 0 ) ? 'text-red-500 bg-gradient-to-r pr-1 from-transparent via-red-200 to-red-200' : ''}`}><LuBoxes/>{(product.selectedAmount ? (product.amount - product.selectedAmount) : product.amount - 1)}</p>
                  </div>
                  <p title="-$ Saldo após compra" className={`flex items-center text-sm gap-1 ${totalPrice > Number(user?.wallet) ? 'text-red-500' : 'text-green-800'}`}><FaWallet size={15}/>R$ {BRLmoney(Number(user?.wallet) - totalPrice)}</p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <label className="flex items-center gap-1 text-gray-600" htmlFor="units"><LuBoxes color="#FF6900"/>Unidades</label>
                <input onChange={(e) => {
                  let value = Number(e.target.value);
  
                  if (value <= 0) {
                    value = 1;
                  }

                  if (product && (value > product?.amount)) {
                    value = product.amount;
                  }
                  
                  actions.setProduct(prev => prev ? 
                  { ...prev, selectedAmount: value} : prev,

                )}} min={1} value={product?.selectedAmount ?? 1} max={product?.amount} className="text-center bg-gray-200 pl-3 font-bold text-[#FF6900] border-x-2 border-cyan-600 h-full w-15 focus:outline-none" type="number" />
              </div>
              {totalPrice < Number(user?.wallet) ? (
                <>
                  <ProceedActionButton
                    onClick={() => actions.setFlags(prev => ({...prev, showConfirmPurchase: true}))}
                    iconButton={BiDollar}
                    iconButtonSize={20}
                    buttonLabel={"Comprar"}
                  />       
                  <button disabled={exceedsStock} title={exceedsStock ? '∅ A quantidade selecionada excede o estoque disponível considerando o carrinho' : ''} onClick={() => setAddToCartConfirm(true)} className={`transition flex justify-center items-center flex-[.25] rounded border-y-4  border-double font-semibold ${exceedsStock ? 'bg-red-200 border-red-500 text-red-600 cursor-not-allowed' : 'bg-cyan-200 border-cyan-500 text-cyan-600 cursor-pointer hover:brightness-[1.1]'}`}>{exceedsStock ? <><MdOutlineBlock size={20}/><TiShoppingCart size={20}/></> : <TiShoppingCart size={20}/>}</button>               
                </>
              ) : (
                <ProceedActionButton
                  iconButton={TbCurrencyDollarOff}
                  iconButtonSize={20}
                  styles="text-red-500 border-red-500 bg-red-100 hover:brightness-[.9] cursor-not-allowed"
                  buttonLabel={"Saldo Insuficiente para a compra"}
                  disable={true}
                />
              )}
            </div>
          </div>
        )}

        {flags.showConfirmPurchase && 
          <>
            <CardFocusOverlay onClick={() => actions.setFlags(prev => ({...prev, showConfirmPurchase: false}))}/>
            <form onSubmit={actions.handleBuySubmit} className="fixed max-w-[550px] md:w-full w-[450px] border-x-5 border-cyan-500 translate-[-50%] p-3 border-double z-50 bg-gray-100 top-1/2 left-1/2">
              <h3 className="text-xl font-semibold text-orange-800 mb-2 flex items-center gap-1">Confirmar compra</h3>
              <p className="text-sm mb-2 flex gap-2">Confirma a compra de {product?.selectedAmount ?? 1} unidade(s) do {product?.name} por R$ {formattedTotalPrice}?</p>
              <small className="flex gap-2">Seu saldo após compra será de <span className="flex items-center gap-1 text-green-800 font-bold"><FaWallet className="mt-[2px]" size={15}/>R$ {userWalletIfProductBought}</span></small>
              <div className="flex gap-3 mt-2">
                <ProceedActionButton
                  actionType="submit"
                  iconButton={BiCheckCircle}
                  iconButtonSize={20}
                  buttonLabel="Sim"
                  styles="bg-green-500 cursor-pointer border-green-800 text-green-800 hover:brightness-[1.1]"
                  processingState={flags.processingState}
                  disable={flags.processingState}
                  buttonLabelWhileProcessing="Comprando"
                />
                <ReturnActionButton
                  onClick={() => actions.setFlags(prev => ({...prev, showConfirmPurchase: false}))}
                  iconButton={IoIosCloseCircleOutline}
                  iconButtonSize={20}
                  buttonLabel={"Não"}
                  processingState={flags.processingState}
                />
              </div>
            </form>
          </>
        }

        {product && addToCartConfirm && (
          <ConfirmDecision
            decisionTitle={'Confirmar adicionar ao carrinho ?'}
            formRequired={false}
            decisionDescription={`Tem certeza que deseja adicionar ao carrinho o produto: ${product?.name}`}
            processingState={flags.processingState}
            processingLabel={'Adicionando'}
            onAcceptWithoutForm={() => {
              addToCart(product.id, product.selectedAmount ?? 1, product.price);
              setAddToCartConfirm(false);
              showToast('Produto adicionado ao carrinho');
            }}
            addToCart={{
              amount: product.selectedAmount ?? 1,
              totalPrice: totalPrice,
              pricePerUnit: product.price,
            }}
            onCancel={() => setAddToCartConfirm(false)}
          />
        )}
      </div>
    </div>
  )
}

export default ProductCard