import { AiOutlineCloseCircle } from "react-icons/ai";
import { CiTextAlignLeft } from "react-icons/ci";
import { FaRegCheckCircle } from "react-icons/fa";
import type { ProductSuggest } from "../../types/SuggestProduct"
import { limitName } from "../../utils/formatation/limitName";
import CategoryIcon from "../ui/CategoryIcon";
import DateTime from "../ui/DateTime";
import Money from "../ui/Money";
import AcceptButton from "../ui/ProceedActionButton"
import DenyButton from "../ui/ProceedActionButton"
import type { UIFlags } from "../../types/UIFlags";
import ConfirmDecision from "../ui/ConfirmDecision";

type SuggestedProductCard = {
  suggestProduct: ProductSuggest;
  flags: UIFlags;
  actions: {
    setFlags: React.Dispatch<React.SetStateAction<UIFlags>>;
    setSelectedSuggestionId: React.Dispatch<React.SetStateAction<number | null>>;
  }
}

const SuggestedProductCard = ({suggestProduct,  actions, flags}:SuggestedProductCard) => {
  
  // const handleAcceptDenyProductSuggestion = async(id:number | undefined) => {

  //   const answer = flags.showConfirmSuggestion.accept ? 'accepted' : 'denied';

  //   try {
  //     const response = await api.patch(`/suggested-product-answer/${id}`, {
  //       answer: answer,
  //     });

  //     showToast(response.data.message, response.data.type);
  //   } catch (err:unknown) {
  //     catchError(err);
  //   } 
  // }

  return (
    <>
      <div className="flex border-y-8 bg-gray-100 border-double border-orange-600">
        <figure className="flex flex-2 flex-col p-1">
          <img className="border-y-2 border-gray-200 py-1 h-full" src={suggestProduct.image_url} alt={suggestProduct.name} />
          <p className="text-sm text-center">Sugerido por <i className="text-yellow-600 font-semibold">{limitName(suggestProduct.user?.name, 2)}</i></p>
          <div className="flex h-8 gap-2 mt-1">
            <AcceptButton onClick={() => {
              actions.setSelectedSuggestionId(suggestProduct.id ?? 1);
              actions.setFlags(prev => ({
                ...prev,
                showConfirmSuggestion: { accept: true, deny: false }
              }));
            }} styles="!bg-green-200 !text-green-600 !border-green-600" iconButton={FaRegCheckCircle} iconButtonSize={0} buttonLabel={"Aceitar"}/>
            <DenyButton onClick={() => {
              actions.setSelectedSuggestionId(suggestProduct.id ?? 1);
              actions.setFlags(prev => ({
                ...prev,
                showConfirmSuggestion: { accept: false, deny: true }
              }));
            }} styles="!bg-red-200 !text-red-600 !border-red-600" iconButton={AiOutlineCloseCircle} iconButtonSize={18} buttonLabel={"Recusar"}/>
          </div>
        </figure>
        <div className="flex flex-col gap-0.5 flex-3 p-1">
          <h3 className="text-orange-800">{suggestProduct.name}</h3>
          <div className="flex text-sm items-center gap-1">
            <CategoryIcon style="text-cyan-800" category={suggestProduct.category}/>
            <span className="text-[10px] text-gray-400">●</span>
            <DateTime style="text-cyan-800" timeStamp={suggestProduct.created_at}/>
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm flex items-center gap-1"><CiTextAlignLeft className="mt-[2px]"/>Descrição:</h4>
            <p className="max-h-[100px] overflow-y-auto custom-scroll border-y-1 py-0.5 text-xs leading-4.5 text-cyan-700 border-gray-200">{suggestProduct.description}</p>
          </div>
          <Money value={Number(suggestProduct.price)}/>
        </div>
      </div>
    </>
  )
}

export default SuggestedProductCard;