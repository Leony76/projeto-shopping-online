import { FaMoneyBill, FaTrashAlt } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import ClearCart from "../ui/ProceedActionButton";
import PageTitle from "../ui/PageTitle";
import { CgShoppingCart } from "react-icons/cg";
import { BsBoxSeamFill } from "react-icons/bs";
import RemoveProduct from "../ui/ReturnActionButton";
import { FaTrashCan } from "react-icons/fa6";
import { GiCash } from "react-icons/gi";

const ProductCartModal = () => {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <div className="fixed top-18 right-3 p-4 w-[420px] bg-white shadow-lg border-x-6 border-double border-green-600 rounded">
      {cart.length === 0 ? (
        <div className="p-4 text-center text-gray-500">Seu carrinho está vazio</div>
      ) : (
        <>
          <PageTitle style="!text-2xl" title={"Carrinho"} icon={CgShoppingCart}/>
          {cart.map(item => (
            <div key={item.productId} className="flex items-center items-center justify-between mb-2 border-b border-cyan-300 pb-2">
              <figure className="border-1 border-gray-400 rounded p-1 h-[70px] w-[130px]">
                <img className="w-full h-full" src={item.image} alt={item.name} />
              </figure>
              <div className="flex h-[35px] mb-4 ml-[-17px] flex-col justify-between">
                <p className="font-semibold text-lg flex items-center gap-1 text-yellow-600"><BsBoxSeamFill/>{item.name}</p>
                <p className="text-sm text-gray-500 font-semibold"><span className="text-green-700">R$ {BRLmoney(item.price)}</span> x <span className="text-orange-600">{item.amount}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.amount}
                  onChange={e => updateQuantity(item.productId, Number(e.target.value))}
                  className="text-center bg-gray-100 pl-3 font-bold text-[#FF6900] border-x-2 border-cyan-600 w-12 h-10 focus:outline-none"
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
          <div className="mt-3 flex items-center text-green-700 gap-1 font-bold"><span className="flex items-center gap-1 text-yellow-600">
            <GiCash size={20}/>Total:
          </span> R$ {BRLmoney(total)}</div>
          <ClearCart
            styles="w-full mt-2 bg-red-200 text-red-500 border-red-400"
            iconButtonSize={20}
            buttonLabel={'Limpar Carrinho'}
            iconButton={FaTrashAlt }
            actionType={'button'}
            onClick={clearCart}
          />
        </>
      )}
    </div>
  );
};

export default ProductCartModal;
