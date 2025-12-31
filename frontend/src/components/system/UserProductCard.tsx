import ProceedActionButton from "../ui/ProceedActionButton";
import { BiDollarCircle } from "react-icons/bi";
import { FaCommentDots, FaMoneyBill } from "react-icons/fa6";
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
import Loading from "../ui/Loading";
import CardFocusOverlay from "../ui/CardFocusOverlay";
import InputForm from "../form/InputForm";
import XCloseTopRight from "../ui/XCloseTopRight";
import WarnError from "../ui/WarnError";
import GoBackArrow from "../ui/ProductCardGoBackArrow";

type UserProductCard = {
  product: {
    selected: ProductAPI | null;
    transactions: TransactionAPI[];
  }

  actions: {
    setSelectedProduct: React.Dispatch<React.SetStateAction<ProductAPI | null>>;
    setProduct: React.Dispatch<React.SetStateAction<ProductAPI[]>>;
    setFlags: React.Dispatch<React.SetStateAction<{
      showProductTransactions: boolean;
      showConfirmPurchase: boolean;
      showProductInfo: boolean;
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

  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState<string>('');
  const [commentary, setCommentary] = useState<string>('');

  const [flag, setFlag] = useState({
    processing: false,
    showCommentModal: false,
    processingState: false,
  });

  const handleRatingSubmit = async(rating: number) => {

    if(flag.processing)return;
    setFlag(prev => ({...prev, processing:true}));

    try {
      await getCsrf();

      const response = await api.post(
        `product-rating/${product.selected?.id}`,
        { rating }
      );

      actions.setProduct(prev =>
        prev.map(p =>
          p.id === product.selected?.id
            ? { ...p, user_rating: rating }
            : p
        )
      );

      actions.setSelectedProduct(prev =>
        prev ? { ...prev, user_rating: rating } : prev
      );

      showToast(response.data.message, response.data.type);
    } catch (err) {
      catchError(err);
    } finally {
      setFlag(prev => ({...prev, processing: false}));
    }
  };

  const handleCommentarySubmit = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (flag.processing) return;
    setFlag(prev => ({...prev, processing: true}));

    if (!commentary) {
      setError('O comentário não pode ser vazio');
      setFlag(prev => ({...prev, processing: false}));
      return;
    }

    if (commentary.length < 2) {
      setError('O comentário deve ter no mínimo 2 caractéres');
      setFlag(prev => ({...prev, processing: false}));
      return;
    }

    try {
      await getCsrf();
      const response = await api.post(`/user-review/${product.selected?.id}`, {
        commentary: commentary,
        rate: product.selected?.user_rating ?? 0,
      });

      showToast(response.data.message, response.data.type);
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setFlag(prev => ({...prev, processing: false}));
      setFlag(prev => ({...prev, showCommentModal: false}));
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
            <XCloseTopRight 
              closeSetter={() => {
                actions.setFlags(prev => ({...prev, showProductInfo:false}));
                actions.setFlags(prev => ({...prev, showProductTransactions:false}));
              }}
            />
          {flags.showProductTransactions && <GoBackArrow onClick={() => actions.setFlags(prev => ({...prev, showProductTransactions:false}))}/>}
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
              <p className="custom-scroll text-gray-700 text-[13px] border-gray-400 max-h-30 overflow-y-auto">{product.selected?.description}</p>
            </>
          )}
        </div>

        {!flags.showProductTransactions ? (
          <div className="mb-3">
            <div className="flex justify-between border-t-1 border-gray-500">
              <div className="flex my-[5px] border-gray-400 mx-1 py-1 font-semibold">
                <p className="text-red-500 flex items-center gap-1"><GiCash/>-R$ {BRLmoney(totalSpent)}</p>
                <p className="flex items-center gap-1 border-l-2 border-gray-300 ml-2 pl-2 text-orange-500"><LuBoxes/>{totalUnits}</p>
              </div>
              <div className="flex gap-2 items-center">
                <RatingStars
                  elements={{
                    name: flag.processing ? 
                    <>
                      <Loading size={20} />
                      <span className="ml-1">Avaliando:</span>
                    </>
                    : 'Avalie:',
                    hoverRating: hoverRating,
                    rating: product.selected?.user_rating ?? 0,
                  }}
                  actions={{
                    setHoverRating,
                    onRate: handleRatingSubmit,
                  }}
                  flags={{ hovering: true }}
                />
                {product.selected?.user_rating && (
                  <>
                    <span className="text-yellow-600 text-[15px]">●</span>
                    <ProceedActionButton
                      title="◍ Comentar sobre o produto"
                      iconButton={FaCommentDots}
                      iconButtonSize={0}
                      buttonLabel={""}
                      onClick={() => setFlag(prev => ({ ...prev, showCommentModal: true }))}
                      styles="px-4 !py-1 bg-yellow-100 text-yellow-600 border-t-1 border-b-1 border-yellow-600 !border-x-10" />
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <ProceedActionButton
                onClick={() => actions.setFlags(prev => ({...prev, showProductTransactions:true}))}
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

        {flag.showCommentModal && (
          <>
            <CardFocusOverlay onClick={() => setFlag(prev => ({...prev, showCommentModal:false}))}/>
            <form onSubmit={handleCommentarySubmit} className="fixed border-x-6 border-yellow-600 border-double px-4 py-2 top-1/2 left-1/2 translate-[-50%] bg-white z-50">
              <XCloseTopRight closeSetter={() => setFlag(prev => ({...prev, showCommentModal:false}))}/>
              <h3 className="text-yellow-600 text-xl font-semibold">Comentar sobre produto</h3>
              <h5 className="text-sm text-cyan-500">Deixe um comentário sobre o que achou do produto para que outros usuários vejam sua avaliação subjetiva!</h5>
              <InputForm 
                fieldType={"textArea"}
                maxLength={1000}
                inputStyle="mt-2 border-x-8 !border-cyan-500"
                onTextArea={(e) => {
                  setCommentary(e.target.value)
                  setError('');
                }}
              />
              {error && <WarnError error={error}/>}
              <ProceedActionButton
                iconButton={FaCommentDots}
                iconButtonSize={0}
                styles="px-4 bg-yellow-100 text-yellow-600 border-yellow-600 mt-3 mb-1"
                buttonLabel={"Comentar"} 
                processingState={flag.processing}
                buttonLabelWhileProcessing="Comentando"
                actionType="submit"
              />
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default UserProductCard