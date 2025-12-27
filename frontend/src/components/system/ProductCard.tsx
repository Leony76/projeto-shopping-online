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
    <div className="flex gap-3 fixed top-1/2 w-[1000px] z-50 py-1 left-1/2 translate-[-50%] border-y-4 border-double border-cyan-500 bg-gray-100">
      <figure className="flex-[1] max-h-[400px] ml-1 flex items-center justify-center">
        <img className="h-full w-full border-2 border-gray-200 p-1 my-1 ml-1.5" src={product?.image_url} alt={product?.name} />
      </figure>
      <div className="flex flex-col justify-between flex-[1.5] mr-[16px]">
        <div>
          <div>
            <XCloseTopRight closeSetter={() => {
              actions.setFlags(prev => ({...prev, showProductInfo: false}));
              actions.setFlags(prev => ({...prev, showProductAmount: false}));
            }}/>
          </div>
          <h4 className="text-xl font-semibold text-orange-800">{product?.name}</h4>
          <div className="flex items-center font-normal text-[#104E64] mt-[-5px] gap-1 py-1">
            <CategoryIcon category={product?.category ?? 'Artesanal'}/>
            <span className="text-[10px]">●</span>
            <p className="flex text-xs items-center gap-[3px]"><FaCalendarAlt/> Foi à venda - {(dateTime(product?.created_at))}</p>
            {product?.created_at !== product?.updated_at && (<p className="flex text-xs items-center gap-[1px] border-l-2 border-gray-300 pl-1"><AiFillEdit/> Sofreu alteração - {(dateTime(product?.updated_at))}</p>)} 
          </div>
          <label className="flex items-center gap-1"><CiTextAlignLeft className="mt-[2px]"/>Decrição:</label>
          <p className="custom-scroll text-gray-700 text-[13px] border-gray-400 col max-h-30  overflow-y-auto">{product?.description}</p>
        </div>
        
        {!flags.showProductAmount ? (
          <div className="mb-3">
            <div className="flex items-center border-t-1 border-gray-500 justify-between">
              <div className="flex gap-1 my-[5px] border-gray-400 mx-1 py-1 font-semibold">
                <p title="Preço" className="text-green-800 flex items-center gap-1"><FaMoneyBill/>R$ {BRLmoney(product?.price)}</p>
                <p title="No Estoque" className={`flex items-center gap-1 border-l-2 pl-2 ml-2 border-gray-400 text-orange-500 ${product && product?.amount > 0 ? 'text-orange-500' : 'text-red-500 bg-gradient-to-r pr-1 from-transparent via-red-200 to-red-200'}`}><LuBoxes/>{product?.amount}</p>
                <p title="$ Vendas" className={`flex items-center gap-1 border-l-2 pl-2 ml-2 border-gray-400 text-blue-400`}><FaCashRegister />{product?.orders_sum_quantity ?? 0}</p>
              </div>
              <div className="flex items-center">
                <RatingStars
                  elements={{
                    name: `${!product?.product_rate_avg_rating ? 'Nenhuma avaliação' : '' + product.product_rate_avg_rating.toFixed(1).replace('.',',')}`,
                    rating: product?.product_rate_avg_rating,
                  }}
                  flags={{
                    hovering: false,
                  }}
                />
                <p className="flex items-center gap-1 font-semibold border-l-2 border-yellow-600 ml-1 pl-1 text-yellow-600"><MdPeopleAlt size={18}/>{product?.product_rate_count}</p>
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
                    <p className="text-green-800 flex items-center border-r-1 pr-3 gap-1"><FaMoneyBill/>R$ {totalPrice !== 0 ? formattedTotalPrice : BRLmoney( product.price)} <IoClose color="gray"/> <span className="text-orange-500">{product.selectedAmount !== 0 ? product.selectedAmount : 1}</span></p>
                    <p className={`flex items-center gap-1 text-orange-500 ${(product.selectedAmount && product.amount - product.selectedAmount === 0 ) ? 'text-red-500 bg-gradient-to-r pr-1 from-transparent via-red-200 to-red-200' : ''}`}><LuBoxes/>{(product.selectedAmount ? (product.amount - product.selectedAmount) : product.amount - 1)}</p>
                  </div>
                  <p className={`flex items-center text-sm gap-1 ${totalPrice > Number(user?.wallet) ? 'text-red-500' : 'text-green-800'}`}><FaWallet size={15}/> R$ {BRLmoney(Number(user?.wallet) - totalPrice)}</p>
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

        {flags.showConfirmPurchase && (
          <>
            <div className="inset-0 bg-black/50 fixed z-40"></div>
            <form onSubmit={actions.handleBuySubmit} className="fixed w-[700px] border-x-5 border-cyan-500 translate-[-50%] p-3 border-double z-50 bg-gray-100 top-1/2 left-1/2">
              <h3 className="text-xl font-semibold text-orange-800 mb-2 flex items-center gap-1">Confirmar compra</h3>
              <p className="text-sm mb-2 flex gap-2">Confirma a compra de <span className="flex items-center gap-1 text-orange-500 font-bold"><LuBoxes className="mt-1"/>{product?.selectedAmount ?? 1} unidade(s)</span> do {product?.name} por <span className="flex items-center gap-1 text-green-800 font-bold"><FaMoneyBill className="mt-1" size={15}/>R$ {formattedTotalPrice}</span>?</p>
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
        )}

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