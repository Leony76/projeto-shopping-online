import AppLayout from "../layout/AppLayout"
import './AddProducts.css';
import useImagePreview from "../components/ImagePreview";
import AddProductsForm from "../components/AddProductsForm";

const AddProducts = () => {
  const { 
    preview,
    inputRef, 
    file,
    handleChange,
    handleClick,
    resetImagePreview
  } = useImagePreview();
  
  return (
    <AppLayout>
      <div className="form-container">
        <AddProductsForm
          preview={preview}
          inputRef={inputRef}
          file={file}
          handleChange={handleChange}
          handleClick={handleClick}
          resetImagePreview={resetImagePreview}
        />
      </div> 
    </AppLayout>
  )
}

export default AddProducts