import { LuBoxes } from "react-icons/lu";
import { BsEyeFill } from "react-icons/bs";
import ProceedActionButton from "../ui/ProceedActionButton";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import type { TransactionAPI } from "../../types/TransactionAPI";
import CardTitle from "../ui/GridProductCardTitle";
import CategoryIcon from "../ui/CategoryIcon";
import { GiCash } from "react-icons/gi";
import type { ProductAPI } from "../../types/ProductAPI";
import Date from "../ui/Date";

type GridProductCard = {
  product: {
    selected: ProductAPI;
    transactions?: TransactionAPI[];
  }
  actions: {
    setFlags: React.Dispatch<React.SetStateAction<{
      showProductInfo: boolean;
      showProductTransactions: boolean;
      showConfirmPurchase: boolean;
    }>>
    setSelectedProduct: React.Dispatch<React.SetStateAction<ProductAPI | null>>;
  }
}

const GridProductCard = ({
  product,
  actions,
}:GridProductCard) => {

  const productTransactions = product.transactions?.filter(t => t.product_id === product.selected.id) ?? [];

  const totalSpent = productTransactions.reduce((sum, t) => sum + t.total_price,0);
  const totalUnits = productTransactions.reduce((sum, t) => sum + t.quantity,0);

  return (
    <div className="border-x-6 lg:p-1.5 p-2 bg-gray-100 border-double shadow-[0_0_3px_#005F78] border-cyan-800">
      <figure className="py-1 aspect-square border-y-2 border-gray-300">
        <img className="rounded w-full h-full object-cover" src={product.selected.image_url} alt={product.selected.name} />
      </figure>
      <div className="flex flex-col">
        <CardTitle style="md:text-base text-xl mb-[-8px] mt-1" textLength={17} name={product.selected.name}/>
        <div className="flex xl:text-xs lg:text-sm sm:text-[13px] text-base items-center font-normal text-[#104E64] gap-1 py-1">
          <CategoryIcon category={product.selected.category ?? 'Artesanal'}/>
          <span className="text-[10px]">●</span>
          <Date timeStamp={product.selected.created_at}/>
        </div>
        <div className="flex xl:text-xs lg:text-sm md:text-sm sm:text-base text-lg justify-between mx-1 py-1 font-semibold border-y-2 border-gray-300">
          <p className="text-red-500 flex items-center gap-1"><GiCash/>-R$ {BRLmoney(totalSpent)}</p>
          <p className="flex items-center gap-1 text-orange-500"><LuBoxes/>{totalUnits}</p>
        </div>
        <div className="flex gap-1 mt-2 pb-2 border-b-2 border-gray-300">
          <ProceedActionButton
            iconButtonSize={20}
            buttonLabel={'Mais informações'}
            iconButton={BsEyeFill}
            onClick={() => {
              actions.setSelectedProduct(product.selected);
              actions.setFlags(prev => ({...prev, showProductInfo:true}));
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default GridProductCard