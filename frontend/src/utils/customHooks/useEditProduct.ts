import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import type { Product } from "../../types/Product";
import type { ProductAPI } from "../../types/ProductAPI";
import type { UIFlags } from "../../types/UIFlags";
import { addProductsValidation } from "../product/addProductValidation";
import { useImagePreview } from "../product/useImagePreview";
import { useCatchError } from "../ui/useCatchError";

type useEditProduct = {
  actions: {
    setFlags: React.Dispatch<React.SetStateAction<UIFlags>>;
    setProducts: React.Dispatch<React.SetStateAction<ProductAPI[]>>;
  }
}

export const useEditProduct = ({actions}:useEditProduct) => {
  const { showToast } = useToast();
  const { resetImagePreview } = useImagePreview();

  const catchError = useCatchError();

  const EditProduct = async(processingState: boolean, editProduct: Product) => {
  
    if (processingState)return;
    actions.setFlags(prev => ({...prev, processingState: true}));

    const result = addProductsValidation(editProduct);
    
    if (!result.valid) {
      showToast(result.message!, "alert");
      actions.setFlags(prev => ({...prev, processingState: false}));
      return;
    }

    const payload = new FormData();

    payload.append('name', editProduct.name);
    payload.append('category', editProduct.category);
    payload.append('description', editProduct.description);
    payload.append('amount', String(editProduct.amount));
    payload.append('price', String(editProduct.price));
    editProduct.image && payload.append('image', editProduct.image);

    try {
      const response = await api.patch(`/product/${editProduct.id}`, payload);

      const updatedProduct = response.data.product;
      
      actions.setProducts(prev =>
        prev.map(p =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
      
      showToast(response.data.message, response.data.type);
      actions.setFlags(prev => ({...prev, processingState: false}));
      resetImagePreview();
    } catch (err:any) {
      catchError(err);
    } finally {
      actions.setFlags(prev => ({...prev, closeEditModal:true}));
    }
  }

  return { EditProduct }
}

