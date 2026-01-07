import { BiCategory, BiImage } from "react-icons/bi"
import { MdDescription, MdOutlineDriveFileRenameOutline } from "react-icons/md"
import type { Product } from "../../types/Product"
import ProceedActionButton from "../ui/ProceedActionButton" 
import Input from "./InputForm"
import ImagePreview from "../ui/ImagePreviewContainer"
import { FaMoneyBill, FaPaperPlane } from "react-icons/fa6"
import type { ProductSuggest } from "../../types/SuggestProduct"

type SuggestProductForm = {
  actions: {
    handleSuggestProductSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleImageChange: (
      e: React.ChangeEvent<HTMLInputElement>,
      onFile: (file: File) => void
    ) => void;
    setProductSuggest: React.Dispatch<React.SetStateAction<ProductSuggest>>;
  },
  flags: {
    processingState: boolean;
  },
  imagePreview: string | null;
  productSuggest: ProductSuggest;
}

const SuggestProductForm = ({actions, flags, imagePreview, productSuggest}:SuggestProductForm) => {
  return (
    <form onSubmit={actions.handleSuggestProductSubmit} className={`flex gap-3 bg-gray-100 border-y-6 shadow-[0_0_3px_#005F78] border-cyan-500 border-double p-2 w-full mt-4`}>
      <div className="flex gap-1 flex-col flex-1">
        <Input 
          fieldType={"text"} 
          fieldIcon={MdOutlineDriveFileRenameOutline }
          placeholderValue="ProdutoX"
          value={productSuggest.name} 
          fieldName={"Nome"} 
          onChange={(e) => actions.setProductSuggest(prev => ({...prev, name: e.target.value}))}
        />          
        <Input 
          fieldType={"select"} 
          fieldIcon={BiCategory}
          placeholderValue="Categoria X"
          value={productSuggest.category} 
          fieldName={"Categoria"} 
          onSelect={(e) => actions.setProductSuggest(prev => ({...prev, category: e.target.value as Product['category']}))}
        />          
        <Input 
          fieldType={"textArea"} 
          fieldIcon={MdDescription}
          placeholderValue="Esse produto é isso, isso e isso..."
          value={productSuggest.description}
          fieldName={"Descrição"} 
          maxLength={355}
          onTextArea={(e) => actions.setProductSuggest(prev => ({...prev, description: e.target.value}))}
        />
        <Input 
          fieldType={"number"} 
          fieldIcon={FaMoneyBill}
          style="flex-1" 
          placeholderValue="70"
          value={productSuggest.price}
          fieldName={"Preço (R$)"} 
          onChange={(e) => actions.setProductSuggest(prev => ({...prev, price: e.target.value}))}
          min={0}
        /> 
        <Input 
          fieldType={"imageSelect"} 
          fieldIcon={BiImage}
          fieldName={"Imagem"} 
          onChange={(e) => actions.handleImageChange(e, (file) => actions.setProductSuggest(prev => ({...prev, image: file})))}
        /> 
        <ImagePreview style="md:hidden block mt-4 mb-2" imagePreview={imagePreview}/>
        <ProceedActionButton
          iconButton={FaPaperPlane} 
          styles="my-2 bg-yellow-200 border-yellow-600 text-yellow-600"
          iconButtonSize={20} 
          buttonLabel={"Mandar sugestão"}
          actionType="submit"
          buttonLabelWhileProcessing="Mandando"
          processingState={flags.processingState}
        />
      </div>
      <ImagePreview style="md:block hidden" imagePreview={imagePreview}/>
    </form>
  )
}

export default SuggestProductForm