import { AiFillDollarCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { CiTextAlignLeft } from "react-icons/ci";
import { FaRegCheckCircle } from "react-icons/fa";
import type { ProductSuggest } from "../../types/SuggestProduct"
import { limitName } from "../../utils/formatation/limitName";
import CategoryIcon from "../ui/CategoryIcon";
import DateTime from "../ui/DateTime";
import Money from "../ui/Money";
import AcceptButton from "../ui/ProceedActionButton"
import DenyButton from "../ui/ProceedActionButton"
import { FaCircleCheck } from "react-icons/fa6";
import ProceedActionButton from "../ui/ProceedActionButton";
import { MdSell } from "react-icons/md";
import { LuBoxes } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import type { UIFlags } from "../../types/UIFlags";

type SuggestedProductCard = {
  suggestProduct: ProductSuggest;
  attributes?: {
    amount: number;
    id: number | null;
  }
  accepted?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  actions: {
    setFlag?: React.Dispatch<React.SetStateAction<UIFlags>>;
    setFlags?: React.Dispatch<React.SetStateAction<{
      isLoading: boolean;
      showPutToSellProductSuggestConfirm: boolean;
      processingState: boolean;
    }>>
    setSelectedSuggestionId?: React.Dispatch<React.SetStateAction<number | null>>;
    setSelectedSuggestedProductToSell?: React.Dispatch<React.SetStateAction<{
      amount: number;
      id: number | null;
    }>>;
  }
}

const SuggestedProductCard = ({
  suggestProduct,
  actions, 
  accepted, 
  attributes,
  isOpen,
  onClose,
  onToggle
}:SuggestedProductCard) => {
  return (
    <>
      <div className="flex border-y-8 bg-gray-100 border-double border-orange-600">
        <figure className="flex flex-2 flex-col p-1">
          <img className="p-1 rounded border border-gray-300 aspect-square object-cover" src={suggestProduct.image_url} alt={suggestProduct.name} />
          <p className="text-sm text-center">Sugerido por <i className="text-yellow-600 font-semibold">{limitName(suggestProduct.user?.name, 2)}</i></p>
          {!accepted ? (
            <div className="flex h-8 gap-2 mt-1">
              <AcceptButton onClick={() => {
                actions?.setSelectedSuggestionId?.(suggestProduct.id ?? null);
                actions?.setFlag?.(prev => ({...prev, showConfirmSuggestion: { accept: true, deny: false }}));
              }} styles="!bg-green-200 !text-green-600 !border-green-600" iconButton={FaRegCheckCircle} iconButtonSize={0} buttonLabel={"Aceitar"}/>
              <DenyButton onClick={() => {
                actions?.setSelectedSuggestionId?.(suggestProduct.id ?? null);
                actions?.setFlag?.(prev => ({...prev, showConfirmSuggestion: { accept: false, deny: true }}));
              }} styles="!bg-red-200 !text-red-600 !border-red-600" iconButton={AiOutlineCloseCircle} iconButtonSize={18} buttonLabel={"Recusar"}/>
            </div>
          ) : (
            <div className="flex lg:flex-row flex-col items-center p-1 gap-1">
              {!isOpen ? (
                <>
                  <div className={`flex flex-3 items-center justify-center gap-1 ${!suggestProduct.for_sale ? 'text-green-800 bg-gradient-to-r from-transparent via-green-200 to-transparent' : 'text-yellow-800 bg-gradient-to-r from-transparent via-yellow-200 to-transparent'}`}>{!suggestProduct.for_sale ? <FaCircleCheck/> : <AiFillDollarCircle size={18}/>}{!suggestProduct.for_sale ? 'Aceita' : 'À venda'}</div>
                  {!suggestProduct.for_sale && <ProceedActionButton onClick={onToggle} title="Pôr à venda" styles="bg-green-300 w-full text-green-700" iconButton={MdSell} iconButtonSize={0} buttonLabel={""}/>}
                </>
              ) : (
                <>
                  <LuBoxes className="h-8 mx-2 lg:block hidden" size={20} color="#FF6900"/>        
                  <input onChange={(e) => {
                    const value = Math.max(1, Number(e.target.value) || 1);
                    actions?.setSelectedSuggestedProductToSell?.(prev => ({...prev, amount: value, id: suggestProduct.id ?? null}))
                  }} value={attributes?.amount} type="number" className="text-center bg-gray-200 py-1 font-bold text-[#FF6900] border-x-2 border-cyan-600 h-full w-15 focus:outline-none"/>
                  <ProceedActionButton onClick={() => actions.setFlags?.(prev => ({...prev, showPutToSellProductSuggestConfirm: true}))} title="Pôr à venda" styles="bg-green-300 w-full ml-1 text-green-700" iconButton={MdSell} iconButtonSize={0} buttonLabel={""}/>
                  <IoClose onClick={onClose} title="Cancelar" className="text-[25px] text-red-700 hover:bg-red-100 h-full cursor-pointer rounded"/>
                </>
              )}
            </div>
          )}
        </figure>
        <div onClick={onClose} className="flex flex-col gap-0.5 flex-3 p-1">
          <h3 className="text-orange-800">{suggestProduct.name}</h3>
          <div className="flex text-sm items-center gap-1">
            <CategoryIcon style="text-cyan-800" category={suggestProduct.category}/>
            <span className="text-[10px] text-gray-400">●</span>
            <DateTime style="text-cyan-800" timeStamp={suggestProduct.created_at}/>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-sm flex items-center gap-1"><CiTextAlignLeft className="mt-[2px]"/>Descrição:</label>
            <p className="max-h-[180px] overflow-y-auto custom-scroll border-y-1 py-0.5 text-xs leading-4.5 text-cyan-700 border-gray-200">{suggestProduct.description}</p>
          </div>
          <Money value={Number(suggestProduct.price)}/>
        </div>
      </div>
    </>
  )
}

export default SuggestedProductCard;