import ProceedActionButton from "../ui/ProceedActionButton";
import { IoClose } from "react-icons/io5";
import { BiDollarCircle } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa6";
import { LuBoxes } from "react-icons/lu";
import type { ProductAPI } from "../../types/ProductAPI";
import { dateTime } from "../../utils/formatation/dateTime";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import { TbTransactionDollar } from "react-icons/tb";
import '../../css/scrollbar.css';
import type { TransactionAPI } from "../../types/TransactionAPI";
import { GiCash } from "react-icons/gi";
import { FaCalendarAlt } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import CategoryIcon from "../ui/CategoryIcon";
import { CiTextAlignLeft } from "react-icons/ci";
import { useState } from "react";
import { useCatchError } from "../../utils/ui/useCatchError";
import { api, getCsrf } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import RatingStars from "../ui/RatingStars";

type UserProductCard = {
  product: {
    selected: ProductAPI | null;
    transactions: TransactionAPI[];
  }
  actions: {
    setSelectedProduct: React.Dispatch<React.SetStateAction<ProductAPI | null>>;
    setFlag: React.Dispatch<React.SetStateAction<{
      showProductTransactions: boolean;
      showConfirmPurchase: boolean;
      showProductInfo: boolean;
      processingState: boolean;
    }>>
  }
  flags: {
    showProductTransactions: boolean;
    showConfirmPurchase: boolean;
  } 
}

const UserProductCard = ({
  flags,
  product,
  actions,
}:UserProductCard) => {

  const totalUnits = product.transactions.reduce((sum, t) => sum + t.quantity, 0); 
  const totalSpent = product.transactions.reduce((sum, t) => sum + t.total_price, 0); 

  const catchError = useCatchError();
  const { showToast } = useToast();

  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingSubmit = async(rating: number | null) => {
    try {
      await getCsrf();
      const response = await api.post(`product-rating/${product.selected?.id}`, {
        rating: rating,
      });

      showToast(response.data.message, response.data.type);
    } catch (err:unknown) {
      catchError(err);
    }
  }

  return (
    <div className="flex gap-3 fixed top-1/2 w-[1000px] z-50 py-1 left-1/2 translate-[-50%] border-y-4 border-double border-cyan-500 bg-gray-100">
      <figure className="flex-[1] ml-1 flex items-center justify-center">
        <img className="max-h-[400px] object-contain w-full border-2 border-gray-200 p-1 my-1 ml-1.5" src={product.selected?.image_url} alt={product.selected?.name} />
      </figure>
      <div className={`flex flex-col flex-[1.5] mr-[16px] ${flags.showProductTransactions ? '' : 'justify-between'}`}>
        <div>
          <div>
            <button onClick={() => {
              actions.setFlag(prev => ({...prev, showProductInfo:false}));
              actions.setFlag(prev => ({...prev, showProductTransactions:false}));
            }} className="absolute top-2 cursor-pointer right-2 text-orange-800 hover:text-orange-500 rounded hover:bg-cyan-100"><IoClose size={20}/></button>
          </div>
          <h4 className="text-xl font-semibold text-orange-800">{product.selected?.name}</h4>
          <div className="flex items-center font-normal text-[#104E64] mt-[-5px] gap-1 py-1">
            <CategoryIcon category={product.selected?.category ?? 'Artesanal'}/>
            <span className="text-[10px]">●</span>
            <p className="flex text-xs items-center gap-[3px]"><FaCalendarAlt/> Foi à venda - {(dateTime(product.selected?.created_at))}</p>
            {product.selected?.created_at !== product.selected?.updated_at && (<p className="flex text-xs items-center gap-[1px] border-l-2 border-gray-300 pl-1"><AiFillEdit/> Sofreu alteração - {(dateTime(product.selected?.updated_at))}</p>)} 
          </div>
          {!flags.showProductTransactions && (
            <>
            <label className="flex items-center gap-1"><CiTextAlignLeft className="mt-[2px]"/>Decrição:</label>
            <p className="custom-scroll text-gray-700 text-[13px] border-gray-400 col max-h-30  overflow-y-auto">{product.selected?.description}</p>
            </>
          )}

        </div>
        {!flags.showProductTransactions ? (
          <div className="mb-3">
            <div className="flex justify-between border-t-1 border-gray-500">
              <div className="flex gap-4 my-[5px] border-gray-400 mx-1 py-1 font-semibold">
                <p className="text-red-500 flex items-center border-r-1 pr-3 gap-1"><GiCash/>-R$ {BRLmoney(totalSpent)}</p>
                <p className="flex items-center gap-1 text-orange-500"><LuBoxes/>{totalUnits}</p>
              </div>
              <RatingStars
                elements={{
                  name: 'Avalie:',
                  hoverRating: hoverRating,
                  rating: rating ?? 0,
                }}
                actions={{
                  setHoverRating:setHoverRating,
                  setRating:setRating,
                  handleRatingSubmit:handleRatingSubmit,
                }}
                flags={{hovering: true}}
              />
            </div>
            <div className="flex gap-2">
              <ProceedActionButton
                onClick={() => actions.setFlag(prev => ({...prev, showProductTransactions:true}))}
                iconButton={TbTransactionDollar}
                iconButtonSize={20}
                buttonLabel={"Ver Transações do Produto"}
              />
            </div>
          </div>
        ) : (
          <div className="mb-1">
            <div className="border-b-2 border-orange-800"></div>
            <div className="max-h-[165px] overflow-y-auto custom-scroll">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-orange-100 text-[13px] text-orange-800">
                  <tr>
                    <th className="py-1"><div className="flex items-center justify-center gap-1"><TbTransactionDollar/>Data da transação</div></th>
                    <th className="py-1"><div className="flex items-center justify-center gap-1"><BiDollarCircle/>Preço da compra</div></th>
                    <th className="py-1"><div className="flex items-center justify-center gap-1"><LuBoxes/>Unidades</div></th>
                    <th className="py-1"><div className="flex items-center justify-center gap-1"><FaMoneyBill/>Preço por unidade</div></th>
                  </tr>
                </thead>
                <tbody>
                  {product.transactions.map((transaction) => (
                    <tr className="text-sm">
                      <td className="text-yellow-700 py-[3px] text-center">{dateTime(transaction.created_at)}</td>
                      <td className="text-red-500 text-center">-R$ {BRLmoney(transaction.total_price)}</td>
                      <td className="text-orange-500 text-center">{transaction.quantity}</td>
                      <td className="text-green-800 text-center">R$ {BRLmoney(transaction.unit_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProductCard