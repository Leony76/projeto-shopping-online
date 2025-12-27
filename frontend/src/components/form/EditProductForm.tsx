import { BiCategory, BiImage } from "react-icons/bi"
import { CgNametag } from "react-icons/cg"
import { IoClose } from "react-icons/io5"
import { LuBoxes } from "react-icons/lu"
import { MdDescription, MdEditSquare } from "react-icons/md"
import type { Product } from "../../types/Product"
import CardFocusOverlay from "../ui/CardFocusOverlay"
import PageTitle from "../ui/PageTitle"
import ProceedActionButton from "../ui/ProceedActionButton"
import Input from "./InputForm"
import ImagePreview from "../ui/ImagePreviewContainer"
import { FaMoneyBill } from "react-icons/fa6"

type EditProductForm = {
  actions: {
    handleEditProduct: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleImageChange: React.ChangeEventHandler<HTMLInputElement>;
    EditProduct: (value: React.SetStateAction<Product>) => void;
  },
  flags: {
    setShowEditProduct: (value: React.SetStateAction<boolean | undefined>) => void;
    processingState: boolean;
  },
  extra: {
    imagePreview: string | null;
  },
  product: Product;
}

const EditProductForm = ({actions, flags, extra, product}:EditProductForm) => {
  return (
    <>
      <CardFocusOverlay onClick={() => flags.setShowEditProduct(false)} style={'z-10'}/>
      <form onSubmit={actions.handleEditProduct} className={`flex m-auto gap-3 bg-gray-100 border-y-6 border-cyan-500 border-double p-2 w-[900px] fixed z-50 top-1/2 left-1/2 translate-[-50%]`}>
        <button onClick={() => {flags.setShowEditProduct(false)}} className="absolute top-2 cursor-pointer left-1/2 translate-x-[-100%] text-orange-800 hover:text-orange-500 rounded hover:bg-cyan-100"><IoClose size={20}/></button>
        <div className="flex flex-col flex-1">
          <PageTitle style="!text-2xl gap-[2px]" title={`Editar produto`} icon={MdEditSquare}/>
          <Input 
            fieldType={"text"} 
            fieldIcon={CgNametag}
            placeholderValue="ProdutoX"
            value={product.name} 
            fieldName={"Nome"} 
            onChange={(e) => actions.EditProduct(prev => ({...prev, name: e.target.value}))}
          />          
          <Input 
            fieldType={"select"} 
            fieldIcon={BiCategory}
            placeholderValue="Categoria X"
            value={product.category} 
            fieldName={"Categoria"} 
            onSelect={(e) => actions.EditProduct(prev => ({...prev, category: e.target.value as Product['category']}))}
          />          
          <Input 
            fieldType={"textArea"} 
            fieldIcon={MdDescription}
            placeholderValue="Esse produto é isso, isso e isso..."
            value={product.description}
            fieldName={"Descrição"} 
            onTextArea={(e) => actions.EditProduct(prev => ({...prev, description: e.target.value}))}
          />
          <div className="flex gap-2 justify-between">
            <Input 
              fieldType={"number"}
              fieldIcon={LuBoxes}
              value={product.amount}
              placeholderValue="5"
              style="flex-1" 
              fieldName={"Quantidade"} 
              onChange={(e) => actions.EditProduct(prev => ({...prev, amount: e.target.value}))}
              min={1}
            /> 
            <Input 
              fieldType={"number"} 
              fieldIcon={FaMoneyBill}
              style="flex-1" 
              placeholderValue="70"
              value={product.price}
              fieldName={"Preço (R$)"} 
              onChange={(e) => actions.EditProduct(prev => ({...prev, price: e.target.value}))}
              min={0}
            /> 
          </div>
          <Input 
            fieldType={"imageSelect"} 
            fieldIcon={BiImage}
            fieldName={"Imagem"} 
            onChange={actions.handleImageChange}
          /> 
          <ProceedActionButton
            iconButton={MdEditSquare} 
            styles="mt-2 bg-yellow-200 border-yellow-600 text-yellow-600"
            iconButtonSize={20} 
            buttonLabel={"Editar"}
            actionType="submit"
            buttonLabelWhileProcessing="Editando"
            processingState={flags.processingState}
          />
        </div>
        {product.image_url && (
          <ImagePreview imagePreview={extra.imagePreview ? extra.imagePreview : product.image_url}/>
        )}
      </form>
    </>
  )
}

export default EditProductForm