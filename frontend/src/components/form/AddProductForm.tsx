import type { Product } from "../../types/Product";
import Input from "./InputForm";
import PageTitle from "../ui/PageTitle";
import { BiCategory, BiImage, BiPlus } from "react-icons/bi";
import { CgNametag } from "react-icons/cg";
import { MdDescription } from "react-icons/md";
import { LuBoxes } from "react-icons/lu";
import { CiMoneyBill } from "react-icons/ci";
import ProceedActionButton from "../ui/ProceedActionButton";
import ImagePreview from "../ui/ImagePreviewContainer";
import CardFocusOverlay from "../ui/CardFocusOverlay";

type Actions = {
  handleAddProductSubmit?: (e:React.FormEvent) => Promise<void>;
  handleEditProductSubmit?: (e:React.FormEvent<HTMLFormElement>) => Promise<void>;

  handleImageChange: React.ChangeEventHandler<HTMLInputElement>;
  updateProduct: <K extends keyof Product>(
    field: K,
    value: Product[K]
  ) => void;
}

type Flags = {
  processing: boolean;
  isAModal?: boolean;
  forEdit?: boolean;
}

type ProductForm = {
  actions: Actions;
  product: Product;
  flags: Flags;
  imagePreview: string | null;
  imageBeforeEdit?: string;
}

const ProductForm = ({actions, product, flags, imagePreview, imageBeforeEdit}:ProductForm) => {
  return (
    <>
    {flags.isAModal && <CardFocusOverlay zIndex={10}/>}
    <form onSubmit={actions.handleAddProductSubmit} className={`flex m-auto gap-3 bg-gray-100 border-y-4 border-double p-2 w-[900px] ${flags.isAModal ? 'fixed top-1/2 left-1/2 translate-[-50%]' : ''}`}>
      <div className="flex flex-col flex-1">
        <PageTitle style="!text-2xl gap-[2px]" title={`${flags.forEdit ? 'Editar' : 'Adicionar'} produto`} icon={BiCategory}/>
        <Input 
          fieldType={"text"} 
          fieldIcon={CgNametag}
          value={product.name} 
          fieldName={"Nome"} 
          onChange={(e) => {actions.updateProduct("name", e.target.value)}}
        />          
        <Input 
          fieldType={"select"} 
          fieldIcon={BiCategory}
          value={product.category} 
          fieldName={"Categoria"} 
          onSelect={(e) => {actions.updateProduct("category", e.target.value as Product['category'])}}
        />          
        <Input 
          fieldType={"textArea"} 
          fieldIcon={MdDescription}
          value={product.description}
          fieldName={"Descrição"} 
          onTextArea={(e) => {actions.updateProduct("description", e.target.value)}}
        />
        <div className="flex gap-2 justify-between">
          <Input 
            fieldType={"number"}
            fieldIcon={LuBoxes}
            value={product.amount}
            style="flex-1" 
            fieldName={"Quantidade"} 
            onChange={(e) => {actions.updateProduct("amount", Number(e.target.value))}}
            min={1}
          /> 
          <Input 
            fieldType={"number"} 
            fieldIcon={CiMoneyBill}
            style="flex-1" 
            value={product.price}
            fieldName={"Preço (R$)"} 
            onChange={(e) => {actions.updateProduct("price", Number(e.target.value))}}
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
          iconButton={BiPlus} 
          styles="mt-2 bg-green-500 border-green-800 text-green-800"
          iconButtonSize={20} 
          buttonLabel={"Adicionar"}
          actionType="submit"
          buttonLabelWhileProcessing="Adicionando"
          processingState={flags.processing}
        />
      </div>
      {imageBeforeEdit ? (
        <ImagePreview imagePreview={imagePreview ? imagePreview : imageBeforeEdit}/>
      ) : (
        <ImagePreview imagePreview={imagePreview}/>
      )}
    </form>
    </>
  )
}

export default ProductForm