import ProceedActionButton from "../ui/ProceedActionButton";
import { IoClose } from "react-icons/io5";
import { FaKitchenSet } from "react-icons/fa6";
import { BiCalendarAlt, BiDollarCircle } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa6";
import { LuBoxes } from "react-icons/lu";
import type { ProductAPI } from "../../types/ProductAPI";
import { dateTime } from "../../utils/formatation/dateTime";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import { TbTransactionDollar } from "react-icons/tb";
import '../../css/scrollbar.css';
import type { TransactionAPI } from "../../types/TransactionAPI";

type Actions = {
  setShowProductInfo: (value: boolean) => void;
  setShowProductAmount: (value: boolean) => void;
  setShowConfirmPurchase: (value: boolean) => void;
  setProcessingState: (value: boolean) => void;
  setProduct: React.Dispatch<React.SetStateAction<ProductAPI | null>>;
};

type Flags = {
  showProductAmount: boolean;
  showConfirmPurchase: boolean;
  processingState: boolean;
}

type UserProductCard = {
  product: ProductAPI | null;
  transactions: TransactionAPI[];
  actions: Actions;
  flags: Flags;
}

const UserProductCard = ({
  flags,
  product,
  actions,
  transactions,
}:UserProductCard) => {

  const totalUnits = transactions.reduce((sum, t) => sum + t.quantity, 0); 
  const totalSpent = transactions.reduce((sum, t) => sum + t.total_price, 0); 

  return (
    <div className="flex gap-3 fixed top-1/2 w-[1000px] z-50 py-1 left-1/2 translate-[-50%] border-y-4 border-double border-cyan-500 bg-gray-100">
      <figure className="flex-[1] ml-1 flex items-center justify-center">
        <img className="max-h-[400px] object-contain w-full border-2 border-gray-200 p-1 my-1 ml-1.5" src={product?.image_url} alt={product?.name} />
      </figure>
      <div className={`flex flex-col flex-[1.5] mr-[16px] ${flags.showProductAmount ? '' : 'justify-between'}`}>
        <div>
          <div>
            <button onClick={() => {
              actions.setShowProductInfo(false);
              actions.setShowProductAmount(false);
            }} className="absolute top-2 cursor-pointer right-2 text-orange-800 hover:text-orange-500 rounded hover:bg-cyan-100"><IoClose size={20}/></button>
          </div>
          <h4 className="text-xl font-semibold text-orange-800">{product?.name}</h4>
          <div className="flex items-center font-normal text-[#104E64] mt-[-5px] gap-1 py-1">
            <p className="flex text-sm items-center gap-[2px]"><FaKitchenSet/>{product?.category}</p>
            <span className="text-[10px]">●</span>
            <p className="flex text-sm items-center gap-[1px]"><BiCalendarAlt/>{(dateTime(product?.datePutToSale))}</p>
          </div>
          {!flags.showProductAmount && (
            <>
              <label>Decrição:</label>
              <p className="custom-scroll text-[13px] border-gray-400 col max-h-30  overflow-y-auto">{product?.description}</p>
            </>
          )}

        </div>
        {!flags.showProductAmount ? (
          <div className="mb-3">
            <div className="flex border-t-1 gap-4 my-[5px] border-gray-400 mx-1 py-1 font-semibold">
              <p className="text-green-800 flex items-center border-r-1 pr-3 gap-1"><FaMoneyBill/>R$ {BRLmoney(totalSpent)}</p>
              <p className="flex items-center gap-1 text-orange-500"><LuBoxes/>{totalUnits}</p>
            </div>
            <div className="flex gap-2">
              <ProceedActionButton
                onClick={() => actions.setShowProductAmount(true)}
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
                  {transactions.map((transaction) => (
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