import type React from "react"
import { BiCheckCircle } from "react-icons/bi";
import { FaMoneyBill, FaMoneyBills, FaWallet } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ProceedActionButton from "./ProceedActionButton";
import ReturnActionButton from "./ReturnActionButton";
import CardFocusOverlay from "./CardFocusOverlay";
import { LuBoxes } from "react-icons/lu";
import { BRLmoney } from "../../utils/formatation/BRLmoney";

type ConfirmDecision = {
  formRequired?: boolean;
  decisionTitle: string;
  decisionDescription: string;
  descisionConsequence?: boolean;
  processingState?: boolean;
  processingLabel: 'Removendo' | 'Editando' | 'Comprando' | 'Adicionando' | 'Efetuando compra';
  userWalletIfProductBought?: React.ReactNode;
  onAccept?: React.Dispatch<React.FormEvent<HTMLFormElement>>;
  onAcceptWithoutForm?: () => void;
  onCancel: () => void;

  addToCart?: {
    amount: number | undefined;
    totalPrice: string | number;
    pricePerUnit: number | undefined;
  }
}

const ConfirmDecision = ({
  decisionTitle,
  formRequired,
  decisionDescription,
  descisionConsequence,
  userWalletIfProductBought,
  processingState,
  processingLabel,
  addToCart,
  onAccept,
  onAcceptWithoutForm,
  onCancel,
}: ConfirmDecision) => {
  return (
    <>
      <CardFocusOverlay/>
      {formRequired ? (
        <form onSubmit={onAccept} className="fixed w-[550px] border-x-5 border-cyan-500 translate-[-50%] p-3 border-double z-50 bg-gray-100 top-1/2 left-1/2">
          <h3 className="text-xl font-semibold text-orange-800 mb-2">{decisionTitle}</h3>
          <p className="text-sm mb-2 flex gap-2">{decisionDescription}</p>
          {descisionConsequence && (
            <small className="flex gap-2">Seu saldo após compra será de <span className="flex items-center gap-1 text-green-800 font-bold"><FaWallet className="mt-[2px]" size={15}/>R$ {userWalletIfProductBought}</span></small>
          )}
          <div className="flex gap-3 mt-2">
            <ProceedActionButton
              actionType="submit"
              iconButton={BiCheckCircle}
              iconButtonSize={20}
              buttonLabel="Sim"
              styles="bg-green-500 cursor-pointer border-green-800 text-green-800 hover:brightness-[1.1]"
              processingState={processingState}
              disable={processingState}
              buttonLabelWhileProcessing={processingLabel}
            />
            <ReturnActionButton
              onClick={onCancel}
              iconButton={IoIosCloseCircleOutline}
              iconButtonSize={20}
              buttonLabel={"Não"}
              processingState={processingState}
            />
          </div>
        </form>
      ) : (
        <div className="fixed w-[550px] border-x-5 border-cyan-500 translate-[-50%] p-3 border-double z-50 bg-gray-100 top-1/2 left-1/2">
          <h3 className="text-xl font-semibold text-orange-800 mb-2">{decisionTitle}</h3>
          <p className="text-sm mb-2 flex gap-2">{decisionDescription}</p>
          {descisionConsequence && (
            <small className="flex gap-2">Seu saldo após compra será de <span className="flex items-center gap-1 text-green-800 font-bold"><FaWallet className="mt-[2px]" size={15}/>R$ {userWalletIfProductBought}</span></small>
          )}
          {addToCart && (
            <div>
              <p className="flex items-center gap-1 text-gray-500 text-[15px]"><LuBoxes className="text-orange-500"/>Quantidade: <span className="text-orange-500 font-semibold">{addToCart.amount}</span></p>
              <p className="flex items-center gap-1 text-gray-500 text-[15px]"><FaMoneyBills className="text-green-800"/>Preço Total: <span className="text-green-800 font-semibold">R$ {BRLmoney(addToCart.totalPrice)}</span></p>
              <p className="flex items-center gap-1 text-gray-500 text-[15px]"><FaMoneyBill className="text-green-800"/>Preço por unidade: <span className="text-green-800 font-semibold">R$ {BRLmoney(addToCart.pricePerUnit)}</span></p>
            </div>
          )}
          <div className="flex gap-3 mt-2">
            <ProceedActionButton
              iconButton={BiCheckCircle}
              onClick={onAcceptWithoutForm}
              iconButtonSize={20}
              buttonLabel="Sim"
              styles="bg-green-500 cursor-pointer border-green-800 text-green-800 hover:brightness-[1.1]"
              processingState={processingState}
              disable={processingState}
              buttonLabelWhileProcessing={processingLabel}
            />
            <ReturnActionButton
              onClick={onCancel}
              iconButton={IoIosCloseCircleOutline}
              iconButtonSize={20}
              buttonLabel={"Não"}
              processingState={processingState}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ConfirmDecision