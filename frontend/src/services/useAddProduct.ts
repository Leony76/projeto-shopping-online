import { addProductsValidation } from "../utils/product/addProductValidation";
import { useToast } from "../context/ToastContext";
import { api } from "./api";
import axios from "axios";
import { useAddProducts } from "../utils/product/useAddProduct";
import { useImagePreview } from "../utils/product/useImagePreview";
import { useState } from "react";

export const useAddProduct = () => {
  const { addProduct, updateProduct, resetProduct } = useAddProducts();
  const { handleImageChange, imagePreview, resetImagePreview } = useImagePreview();
  const { showToast } = useToast();
  const [processingState, setProcessingState] = useState<boolean>(false);

  const handleAddProductSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    if (processingState) return;
    setProcessingState(true);

    const result = addProductsValidation(addProduct);

    if (!result.valid) {
      showToast(result.message!, "alert");
      setProcessingState(false);
      return;
    }

    const payload = new FormData();

    payload.append('name', addProduct.name);
    payload.append('category', addProduct.category);
    payload.append('description', addProduct.description);
    payload.append('amount', String(addProduct.amount));
    payload.append('price', String(addProduct.price));
    addProduct.image && payload.append('image', addProduct.image);

    try {
      const response = await api.post('/admin/add-product', payload);

      showToast(response.data.message, response.data.type);

      resetProduct();
      setProcessingState(false);
      resetImagePreview();
    } catch (err:any) {
      if (axios.isAxiosError(err) && err.response) {
        showToast(err.response.data.message, "error");
      } else {
        showToast("Erro inesperado", "error");
      }
    } 
  }

  return {
    handleAddProductSubmit,
    updateProduct,
    handleImageChange,
    imagePreview,
    addProduct,
    processingState
  }
}