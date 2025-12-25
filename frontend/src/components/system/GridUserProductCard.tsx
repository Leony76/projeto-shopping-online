import { BiCalendarAlt } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa6";
import { LuBoxes } from "react-icons/lu";
import { BsEyeFill } from "react-icons/bs";
import ProceedActionButton from "../ui/ProceedActionButton";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import { date } from "../../utils/formatation/date";
import type { TransactionAPI } from "../../types/TransactionAPI";
import CategoryIcon from "../ui/CategoryIcon";

type Actions = {
  setShowProductInfo: (value: boolean) => void;
}

export type ProductFromApi = {
  id: number;
  image: string;
  image_url: string;
  name: string;
  category: "Artesanal" | "Cozinha" | "Limpeza" | "Eletrônico" | "Móveis" | "";
  created_at: string;
  price: number;
  amount: number;
};

type GridProductCard = {
  elements: ProductFromApi;
  transactionData?: TransactionAPI[];
  actions: Actions;
}

const GridProductCard = ({
  elements,
  actions,
  transactionData,
}:GridProductCard) => {

  const productTransactions = transactionData?.filter(
    t => t.product_id === elements.id
  ) ?? [];

  const totalSpent = productTransactions.reduce((sum, t) => sum + t.total_price,0);
  const totalUnits = productTransactions.reduce((sum, t) => sum + t.quantity,0);

  return (
    <div className="border-x-4 p-1 bg-gray-100 border-double border-cyan-800">
      <div className="py-1 border-y-2 border-gray-300">
        <img className="rounded" src={elements.image_url} alt={'placeholder'} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#7E2A0C]">{elements.name}</h3>
        <div className="flex items-center font-normal text-[#104E64] mt-[-5px] gap-1 py-1">
          <CategoryIcon category={elements.category ?? 'Artesanal'}/>
          <span className="text-[10px]">●</span>
          <small className="flex items-center text-xs gap-[1px]"><BiCalendarAlt/>{date(elements.created_at)}</small>
        </div>
        <div className="flex justify-between mx-1 py-1 font-semibold border-y-2 border-gray-300">
          <p className="text-green-800 text-sm flex items-center gap-1"><FaMoneyBill/>R$ {BRLmoney(totalSpent)}</p>
          <p className="flex items-center text-sm gap-1 text-orange-500"><LuBoxes/>{totalUnits}</p>
        </div>
        <div className="flex gap-1 mt-2 pb-2 border-b-2 border-gray-300">
          <ProceedActionButton
            iconButtonSize={20}
            buttonLabel={'Mais informações'}
            iconButton={BsEyeFill}
            onClick={() => actions.setShowProductInfo(true)}
          />
        </div>
      </div>
    </div>
  )
}

export default GridProductCard