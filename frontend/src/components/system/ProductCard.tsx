import ProceedActionButton from "../ui/ProceedActionButton";
import ReturnActionButton from "../ui/ReturnActionButton";
import { IoClose } from "react-icons/io5";
import { FaCircleArrowRight, FaKitchenSet } from "react-icons/fa6";
import { BiCalendarAlt } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa6";
import { LuBoxes } from "react-icons/lu";
import { BiDollar } from "react-icons/bi";
import { TiShoppingCart } from "react-icons/ti";
import { FaWallet } from "react-icons/fa6";
import { BiCheckCircle } from "react-icons/bi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import type { ProductAPI } from "../../types/ProductAPI";
import { dateTime } from "../../utils/formatation/dateTime";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import type { User } from "../../types/User";
import type { UIFlags } from "../../types/UIFlags";
import XCloseTopRight from "../ui/XCloseTopRight";
import { useState } from "react";
import ConfirmDecision from "../ui/ConfirmDecision";
import { useCart } from "../../context/CartContext";

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

  const { addToCart } = useCart();

  const formattedTotalPrice = product ? BRLmoney(product.price * (product.selectedAmount ?? 1)): 0;
  const totalPrice = product ? product.price * (product.selectedAmount ?? 1): 0;
  const userWalletIfProductBought = BRLmoney(Number(user?.wallet) - Number(product ? product.price * (product.selectedAmount ?? 1) : 0));
  
  const [addToCartConfirm, setAddToCartConfirm] = useState<boolean>(false); 

  return (
    <div className="flex gap-3 fixed top-1/2 w-[1000px] z-50 py-1 left-1/2 translate-[-50%] border-y-4 border-double border-cyan-500 bg-gray-100">
      <figure className="flex-[1] ml-1 flex items-center justify-center">
        <img className="max-h-[400px] object-contain w-full border-2 border-gray-200 p-1 my-1 ml-1.5" src={product?.image_url} alt={product?.name} />
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
            <p className="flex text-sm items-center gap-[2px]"><FaKitchenSet/>{product?.category}</p>
            <span className="text-[10px]">●</span>
            <p className="flex text-sm items-center gap-[1px]"><BiCalendarAlt/>{(dateTime(product?.datePutToSale))}</p>
          </div>
          <label>Decrição:</label>
          <p className="custom-scroll text-[13px] border-gray-400 col max-h-30  overflow-y-auto">{product?.description}</p>
        </div>
        
        {!flags.showProductAmount ? (
          <div className="mb-3">
            <div className="flex border-t-1 gap-4 my-[5px] border-gray-400 mx-1 py-1 font-semibold">
              <p className="text-green-800 flex items-center border-r-1 pr-3 gap-1"><FaMoneyBill/>R$ {BRLmoney(product?.price)}</p>
              <p className={`flex items-center gap-1 text-orange-500 ${product && product?.amount > 0 ? 'text-orange-500' : 'text-red-500 bg-gradient-to-r pr-1 from-transparent via-red-200 to-red-200'}`}><LuBoxes/>{product?.amount}</p>
            </div>
            <div className="flex gap-2">
              {!user?.admin && (
                product && product?.amount > 0 ? (
                  <ProceedActionButton
                    onClick={() => actions.setFlags(prev => ({...prev, showProductAmount: true}))}
                    iconButton={FaCircleArrowRight}
                    iconButtonSize={20}
                    buttonLabel={"Prosseguir"}
                  />
                ) : (
                  <ProceedActionButton
                    onClick={() => actions.setFlags(prev => ({...prev, showProductAmount: true}))}
                    iconButton={BiDollar}
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
            <div className="flex border-t-1 gap-2 my-[5px] border-gray-400 mx-1 py-1 font-semibold">
              <p className="text-green-800 flex items-center border-r-1 pr-3 gap-1"><FaMoneyBill/>R$ {formattedTotalPrice} <IoClose color="gray"/> <span className="text-orange-500">{product?.selectedAmount}</span></p>
              <p className="flex items-center gap-1 text-orange-500"><LuBoxes/>{product?.amount}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <label className="flex items-center gap-1 text-gray-600" htmlFor="units"><LuBoxes color="#FF6900"/>Unidades</label>
                <input onChange={(e) => actions.setProduct(prev => prev ? 
                 { ...prev, selectedAmount: Number(e.target.value)} : prev,
                )} min={1} value={product?.selectedAmount ?? 1} max={product?.amount} className="text-center bg-gray-200 pl-3 font-bold text-[#FF6900] border-x-2 border-cyan-600 w-15 focus:outline-none" type="number" />
              </div>
              <ProceedActionButton
                onClick={() => actions.setFlags(prev => ({...prev, showConfirmPurchase: true}))}
                iconButton={BiDollar}
                iconButtonSize={20}
                buttonLabel={"Comprar"}
              />
              <button onClick={() => setAddToCartConfirm(true)} className="cursor-pointer hover:brightness-[1.1] transition flex justify-center items-center bg-cyan-200 flex-[.25] rounded border-y-4  border-double border-cyan-500 text-cyan-600 font-semibold"><TiShoppingCart size={20}/></button>
            </div>
          </div>
        )}

        {flags.showConfirmPurchase && (
          <>
            <div className="inset-0 bg-black/50 fixed z-40"></div>
            <form onSubmit={actions.handleBuySubmit} className="fixed w-[550px] border-x-5 border-cyan-500 translate-[-50%] p-3 border-double z-50 bg-gray-100 top-1/2 left-1/2">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Confirmar compra</h3>
              <p className="text-sm mb-2 flex gap-2">Confirma a compra de <span className="flex items-center gap-1 text-orange-500 font-bold"><LuBoxes className="mt-1"/>{product?.selectedAmount} unidade(s)</span> do {product?.name} por <span className="flex items-center gap-1 text-green-800 font-bold"><FaMoneyBill className="mt-1" size={15}/>R$ {formattedTotalPrice}</span>?</p>
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
              addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                amount: product.selectedAmount ?? 1,
                image: product?.image_url
              });
              setAddToCartConfirm(false);
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