import { BsEyeFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import type { Product } from "../../types/Product";
import type { UIFlags } from "../../types/UIFlags";
import { useAuth } from "../../context/AuthContext";
import type { ProductAPI } from "../../types/ProductAPI";
import { FaTrashCan } from "react-icons/fa6";
import ProceedActionButton from "../ui/ProceedActionButton";

import EditProductForm from "../form/EditProductForm";
import ConfirmDecision from "../ui/ConfirmDecision";
import CategoryIcon from "../ui/CategoryIcon";
import CardTitle from "../ui/GridProductCardTitle";
import Price from "../ui/Money";
import Rating from "../ui/Rating";
import Stock from "../ui/Stock";
import Date from "../ui/Date";

type Actions = {
  setFlags:           React.Dispatch<React.SetStateAction<UIFlags>>;
  setEditProduct:     React.Dispatch<React.SetStateAction<Product>>
  setSelectedProduct: React.Dispatch<React.SetStateAction<ProductAPI | null>>

  handleEditProduct:   (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleImageChange:   (e: React.ChangeEvent<HTMLInputElement>, onFileSelect?: (file: File) => void) => void;
  handleRemoveProduct: (id: number) => Promise<void>;

}

type GridProductCard = {
  product:        ProductAPI;
  productForEdit: Product;
  actions:         Actions;
  flags:           Flags;
  imagePreview:    string | null;
}

type Flags = {
  processingState: boolean;
  closeEditModal:  boolean;
}


const GridProductCard = ({
  actions,
  product,
  productForEdit,
  imagePreview,
  flags,
}:GridProductCard) => {
  const { user } = useAuth();

  const [showConfirmRemoveProduct, setShowConfirmRemoveProduct] = useState<boolean>();
  const [showEditProduct, setShowEditProduct] = useState<boolean>();

  useEffect(() => {
    setShowEditProduct(false);
    actions.setFlags(prev => ({...prev, closeEditModal: false}));
    actions.setFlags(prev => ({...prev, processingState: false}));
  },[flags.closeEditModal])
  
  return (
    <div className="border-x-4 p-1 bg-gray-100 border-double border-cyan-800">
      <div className="py-1 xl:h-[120px] border-y-2 border-gray-300">
        <img className="rounded w-full h-full object-cover" src={product.image_url} alt={'placeholder'} />
      </div>
      <div className="flex flex-col">
        <CardTitle textLength={20} name={product.name}/>
        <div className="flex items-center font-normal text-[#104E64] mt-[-5px] gap-1 py-1">
          <CategoryIcon category={product.category ?? 'Artesanal'}/>
          <span className="text-[10px]">●</span>
          <Date timeStamp={product.created_at}/>
        </div>
        <div className="flex text-xs justify-between mx-1 py-1 font-semibold border-y-2 border-gray-300">
          <Price value={product.price}/>
          <Rating rate={product.product_rate_avg_rating}/>
          <Stock stock={product.amount}/>
        </div>
        <div className="flex gap-1 mt-2 pb-2 border-b-2 border-gray-300">
          <ProceedActionButton
            iconButtonSize={20}
            buttonLabel={'Mais informações'}
            iconButton={BsEyeFill}
            onClick={() => {
              actions.setSelectedProduct(product);
              actions.setFlags(prev => ({...prev, showProductInfo:true}));
            }}
          />
        </div>
        {user?.admin ? (
          <div className="flex justify-between">
            <button onClick={() => {
              setShowEditProduct(true),
              actions.setEditProduct(product)
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
          onAcceptWithoutForm={() => actions.handleRemoveProduct(product.id)}
          onCancel={() => setShowConfirmRemoveProduct(false)}
          processingState={flags && flags.processingState}
          formRequired={false}
          processingLabel={'Removendo'}
        />
      ) : showEditProduct ? (
        <EditProductForm
          product={productForEdit}
          actions={{
            handleEditProduct:actions.handleEditProduct,
            handleImageChange: (e) => actions.handleImageChange(e, (file) => actions.setEditProduct(prev => ({...prev, image: file}))),
            EditProduct:actions.setEditProduct,
          }}
          flags={{
            setShowEditProduct:setShowEditProduct,
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