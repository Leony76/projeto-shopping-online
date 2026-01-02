import { FaTrashAlt } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import ClearCart from "../ui/ProceedActionButton";
import PageTitle from "../ui/PageTitle";
import { BsBoxSeamFill } from "react-icons/bs";
import RemoveProduct from "../ui/ReturnActionButton";
import { FaSackDollar, FaTrashCan } from "react-icons/fa6";
import { GiCash } from "react-icons/gi";
import EmptyCardGrid from "../ui/EmptyCardGrid";
import { TiShoppingCart } from "react-icons/ti";
import BuyProductsFromCart from "../ui/ProceedActionButton";
import { useState } from "react";
import WarnError from "../ui/WarnError";
import { useCatchError } from "../../utils/ui/useCatchError";
import { api, getCsrf } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import ConfirmDecision from "../ui/ConfirmDecision";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import ProceedActionButton from "../ui/ProceedActionButton";
import { TbCurrencyDollarOff } from "react-icons/tb";
import '../../css/scrollbar.css';
import PageSectionTitle from "../ui/PageSectionTitle";
import XCloseTopRight from "../ui/XCloseTopRight";
import { createPortal } from "react-dom";

const ProductCartModal = ({setShowCart}:{setShowCart: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();

  const catchError = useCatchError(); 
  
  const { setProducts } = useProducts();

  const { showToast } = useToast();
  const { user, setUser } = useAuth();

  const [processingState, setProcessingState] = useState<boolean>(false);
  const [confirmCartPurchase, setConfirmCartPurchase] = useState<boolean>(false);
  const [flags, setFlags] = useState<{
    confirmClearCart: boolean;
  }>({
    confirmClearCart: false,
  })

  const [error, setError] = useState<string>('');

  const handleBuyProductFromCart = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (processingState)return;
    setProcessingState(true);

    if (cart.length === 0) {
      setError('A compra não pode ser efetuada com o carrinho vazio')
      setProcessingState(false);
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        product_id: item.productId,
        amount: item.amount,
      })),
    };

    try {
      await getCsrf();

      const response = await api.post('/cart-products', payload);

      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          wallet: response.data.wallet,
        }
      });

      setProducts(prev =>
        prev.map(product => {
          const updated = response.data.products.find(
            (p: any) => p.id === product.id
          );

          return updated ? updated : product;
        })
      );

      showToast(response.data.message, response.data.type);
      clearCart();
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setProcessingState(false);
    }
  }

  return (
    <div className="fixed z-50 top-18 sm:right-3 right-1/2 sm:translate-x-[0] translate-x-[50%] p-4 w-[450px] bg-white shadow-lg border-x-6 border-double border-green-600 rounded">
      <XCloseTopRight closeSetter={() => setShowCart(false)}/>
      {cart.length === 0 ? (
        <EmptyCardGrid 
          text="Nenhum produto no carrinho!"
          icon={TiShoppingCart}
          container={{style: '!mt-0'}}
        />
      ) : (
        <>
          <PageSectionTitle textSize="text-2xl" iconSize={30} title="Carrinho" icon={TiShoppingCart}/>
          <div className="max-h-[250px] overflow-y-auto mt-2 custom-scroll pr-4">
            {cart.map(item => (
              <div key={item.productId} className="flex items-center items-center justify-between mb-2 border-b border-cyan-300 pb-2">
                <figure className="h-[70px] w-[130px]">
                  <img className="rounded w-full h-full" src={item.image} alt={item.name} />
                </figure>
                <div className="flex h-[35px] mb-4 flex-col justify-between">
                  <p className="font-semibold text-md flex items-center gap-1 text-yellow-600"><BsBoxSeamFill/>{item.name.length > 10 ? item.name.slice(0,10) : item.name}</p>
                  <p className="text-md text-gray-500 font-semibold"><span className="text-green-700">R$ {BRLmoney(item.price)}</span> x <span className="text-orange-600">{item.amount}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.amount}
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                    className="text-center bg-gray-100 pl-3 font-bold text-[#FF6900] border-x-2 border-cyan-600 w-15 h-10 focus:outline-none"
                  />
                  <RemoveProduct
                    iconButtonSize={20}
                    style="!pl-2"
                    buttonLabel={''}
                    iconButton={FaTrashCan}
                    onClick={() => removeFromCart(item.productId)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center text-green-700 gap-1 font-bold"><span className="flex items-center gap-1 text-yellow-600">
            <GiCash size={20}/>Total:
          </span> R$ {BRLmoney(total)}</div>
          {error && (<WarnError error={error}/>)}
          <div className="flex gap-4 mt-3">
            {Number(user?.wallet) > total ? (
              <>
                <BuyProductsFromCart
                  iconButtonSize={20}
                  buttonLabel={'Efetuar Compra'}
                  processingState={processingState}
                  styles={'!bg-green-400 !border-green-700 !text-green-700'}
                  buttonLabelWhileProcessing={'Comprando'}
                  iconButton={FaSackDollar}
                  onClick={() => setConfirmCartPurchase(true)}
                  actionType={'button'}
                />
                <ClearCart
                  styles="bg-red-200 text-red-500 border-red-400"
                  iconButtonSize={20}
                  buttonLabel={'Limpar Carrinho'}
                  iconButton={FaTrashAlt }
                  actionType={'button'}
                  onClick={() => setFlags(prev => ({...prev, confirmClearCart: true}))}
                />
              </>
            ) : (
              <ProceedActionButton
                iconButton={TbCurrencyDollarOff}
                iconButtonSize={20}
                styles="text-red-500 bg-red-100 border-red-500 hover:brightness-[.9] cursor-not-allowed"
                buttonLabel={"Saldo Insuficiente para a compra"}
                disable={true}
              />
            )}
          </div>

          {confirmCartPurchase &&  
            createPortal(
              <ConfirmDecision
                decisionTitle={'Efetuar compra do carrinho?'}
                formRequired={true}
                style={{procced: '!bg-green-400 !border-green-700 !text-green-700'}}
                decisionDescription={`Tem certeza que deseja efetuar a compra dos items no carrinho?`}
                descisionConsequence={true}
                userWalletIfProductBought={BRLmoney(Number(user?.wallet) - total)}
                processingState={processingState}
                processingLabel={'Efetuando compra'}
                onAccept={handleBuyProductFromCart}
                onCancel={() => setConfirmCartPurchase(false)}
              />
              , window.document.body
            )
          }

          {flags.confirmClearCart && 
            createPortal(
              <ConfirmDecision 
                decisionTitle={"Confirmar excluir produtos do carrinho"} 
                decisionDescription={"Tem certeza que deseja excluir todos os produtos do carrinho?"} 
                onCancel={() => setFlags(prev => ({...prev, confirmClearCart: false}))}
                onAcceptWithoutForm={clearCart}
              />
              , window.document.body
            )
          }
        </>
      )}
    </div>
  );
}

export default ProductCartModal;
