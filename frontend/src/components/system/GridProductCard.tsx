import { LuBoxes } from "react-icons/lu";
import { BsEyeFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa6";
import { BiCalendarAlt } from "react-icons/bi";
import type { Product } from "../../types/Product";
import type { UIFlags } from "../../types/UIFlags";
import { date } from "../../utils/formatation/date";
import { useAuth } from "../../context/AuthContext";
import type { ProductAPI } from "../../types/ProductAPI";
import { FaTrashCan } from "react-icons/fa6";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import ProceedActionButton from "../ui/ProceedActionButton";

import EditProductForm from "../form/EditProductForm";
import ConfirmDecision from "../ui/ConfirmDecision";
import CategoryIcon from "../ui/CategoryIcon";
import CardTitle from "../ui/GridProductCardTitle";
import { FaCalendarAlt } from "react-icons/fa";

type Actions = {
  setFlags:           React.Dispatch<React.SetStateAction<UIFlags>>;
  setEditProduct:     (value: boolean) => void;
  setShowProductInfo: (value: boolean) => void;
  setCloseEditModal:  React.Dispatch<React.SetStateAction<boolean>>

  handleEditProduct:   (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleImageChange:   React.ChangeEventHandler<HTMLInputElement>;
  handleRemoveProduct: () => void;

  EditProduct: React.Dispatch<React.SetStateAction<Product>>;
}

type Flags = {
  processingState: boolean;
  closeEditModal:  boolean;
}

type GridProductCard = {
  elements:        ProductAPI;
  elementsForEdit: Product;
  actions:         Actions;
  flags:           Flags;
  imagePreview:    string | null;
}

const GridProductCard = ({
  actions,
  elements,
  elementsForEdit,
  imagePreview,
  flags,
}:GridProductCard) => {

  const { user } = useAuth();

  const [showConfirmRemoveProduct, setShowConfirmRemoveProduct] = useState<boolean>();
  const [showEditProduct, setShowEditProduct] = useState<boolean>();

  useEffect(() => {
    setShowEditProduct(false);
    actions.setCloseEditModal(false);
    actions.setFlags(prev => ({...prev, processingState: false}));
  },[flags.closeEditModal])
  
  return (
    <div className="border-x-4 p-1 bg-gray-100 border-double border-cyan-800">
      <div className="py-1 h-[120px] border-y-2 border-gray-300">
        <img className="rounded h-full object-cover" src={elements.image_url} alt={'placeholder'} />
      </div>
      <div className="flex flex-col">
        <CardTitle name={elements.name}/>
        <div className="flex items-center font-normal text-[#104E64] mt-[-5px] gap-1 py-1">
          <CategoryIcon category={elements.category ?? 'Artesanal'}/>
          <span className="text-[10px]">●</span>
          <small className="flex items-center text-xs gap-[3px]"><FaCalendarAlt size={11}/>{date(elements.created_at)}</small>
        </div>
        <div className="flex justify-between mx-1 py-1 font-semibold border-y-2 border-gray-300">
          <p className="text-green-800 text-sm flex items-center gap-1"><FaMoneyBill/>R$ {BRLmoney(elements.price)}</p>
          <p className={`flex items-center text-sm gap-1 ${elements.amount > 0 ? 'text-orange-500' : 'text-red-500 bg-gradient-to-r pr-1 from-transparent via-red-200 to-red-200'}`}><LuBoxes/>{elements.amount}</p>
        </div>
        <div className="flex gap-1 mt-2 pb-2 border-b-2 border-gray-300">
          <ProceedActionButton
            iconButtonSize={20}
            buttonLabel={'Mais informações'}
            iconButton={BsEyeFill}
            onClick={() => actions.setShowProductInfo(true)}
          />
        </div>
        {user?.admin ? (
          <div className="flex justify-between">
            <button onClick={() => {
              setShowEditProduct(true),
              actions.setEditProduct(true)
            }} className="flex items-center gap-1 border-x-4 border-double mt-2 mb-1 rounded text-yellow-600 bg-yellow-100 p-1 transition cursor-pointer hover:brightness-[1.05] active:brightness-[.9]"><MdEditSquare className="mt-1"/>Editar</button>
            <button onClick={() => setShowConfirmRemoveProduct(true)} className="flex items-center gap-1 border-x-4 border-double mt-2 mb-1 rounded text-red-600 bg-red-100 p-1 transition cursor-pointer hover:brightness-[1.05] active:brightness-[.9]"><FaTrashCan className="mt-1"/>Remover</button>
          </div>
        ): (
          <></>
        )}
      </div>

      {showConfirmRemoveProduct ? (
        <ConfirmDecision
          decisionTitle={'Confirmar remover o produto?'}
          decisionDescription={'Confirma?'}
          onAcceptWithoutForm={actions.handleRemoveProduct}
          onCancel={() => setShowConfirmRemoveProduct(false)}
          processingState={flags && flags.processingState}
          formRequired={false}
          processingLabel={'Removendo'}
        />
      ) : showEditProduct ? (
        <EditProductForm
          product={elementsForEdit}
          actions={{
            handleEditProduct: actions.handleEditProduct,
            handleImageChange: actions.handleImageChange,
            EditProduct: actions.EditProduct,
          }}
          flags={{
            setShowEditProduct: setShowEditProduct,
            processingState: flags.processingState,
          }}
          extra={{imagePreview: imagePreview}}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default GridProductCard 