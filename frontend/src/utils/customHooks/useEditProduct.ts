import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import type { Product } from "../../types/Product";
import type { ProductAPI } from "../../types/ProductAPI";
import type { UIFlags } from "../../types/UIFlags";
import { addProductsValidation } from "../product/addProductValidation";
import { useImagePreview } from "../product/useImagePreview";
import { useCatchError } from "../ui/useCatchError";

type UseEditProduct = {
  products: Product[];
  editProduct: Product;
  actions: {
    setFlags: React.Dispatch<React.SetStateAction<UIFlags>>;
    setProducts: React.Dispatch<React.SetStateAction<ProductAPI[]>>;
  }
  flags: UIFlags;
}

export const useEditProduct = ({actions, editProduct, products, flags}:UseEditProduct) => {
  const { showToast } = useToast();
  const { resetImagePreview } = useImagePreview();

  const catchError = useCatchError();

  const product = products.find(p =>
    p.id === editProduct.id,
  );

  const EditProduct = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (!product)return;

    if (flags.processingState)return;
    actions.setFlags(prev => ({...prev, processingState: true}));

    const result = addProductsValidation(editProduct);      
    
    if (!result.valid) {
      showToast(result.message!, "alert");
      actions.setFlags(prev => ({...prev, processingState: false}));
      return;
    }

    const payload = new FormData();

    if (editProduct.name !== product.name) {
      payload.append('name', editProduct.name);
    }

    if (editProduct.category !== product.category) {
      payload.append('category', editProduct.category);
    }

    if (editProduct.description !== product.description) {
      payload.append('description', editProduct.description);
    }

    if (editProduct.amount !== product.amount) {
      payload.append('amount', String(editProduct.amount));
    }

    if (editProduct.price !== product.price) {
      payload.append('price', String(editProduct.price));
    }

    if (editProduct.image instanceof File) {
      payload.append('image', editProduct.image);
    }

    try {
      const response = await api.post(`/product/${editProduct.id}`, payload);

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

