import AddProductForm from "../components/form/AddProductForm";
import AppLayout from "../layout/AppLayout"
import { useAddProduct } from "../services/useAddProduct";

const AddProduct = () => {
  const { 
    imagePreview,
    addProduct,
    processingState,
    handleAddProductSubmit,
    updateProduct,
    handleImageChange,
  } = useAddProduct();
  
  return (
    <AppLayout pageSelected={"addProduct"} >
      <AddProductForm 
        actions={{
          handleAddProductSubmit,
          updateProduct,
          handleImageChange: (e) => handleImageChange(e, (file) => updateProduct('image', file))
        }} 
        flags={{ processing: processingState }}
        product={addProduct} 
        imagePreview={imagePreview}        
      />
    </AppLayout>
  )
}

export default AddProduct