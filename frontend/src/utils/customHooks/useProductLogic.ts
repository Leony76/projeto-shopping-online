import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { getProducts } from "../../services/getProducts";
import type { AdvancedFilter } from "../../types/AdvancedFilter";
import type { Product } from "../../types/Product";
import type { ProductAPI } from "../../types/ProductAPI";
import type { UIFlags } from "../../types/UIFlags";
import { useImagePreview } from "../product/useImagePreview";
import { toastAppearOnce } from "../ui/toastAppearOnce";
import { useBuyProduct } from "./useBuyProduct";
import { useEditProduct } from "./useEditProduct";
import { useLockYScroll } from "./useLockYScroll";
import { useRemoveProduct } from "./useRemoveProduct";

export const useProductLogic = () => {
  toastAppearOnce();

  const { user, setUser } = useAuth();
  const { handleImageChange, imagePreview } = useImagePreview();
  const {products, setProducts} = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter['filter']>(null);

  const [editProduct, setEditProduct] = useState<Product>({
    id: 0,
    name: "",
    image: null,
    amount: "",
    description: "",
    category: "",
    price: "",
    created_at: "",
    updated_at: "",
  })

  const [flags, setFlags] = useState<UIFlags>({
    showProductInfo: false,
    showProductAmount: false,
    showConfirmPurchase: false,
    processingState: false,
    closeEditModal: false,
    isLoading: true,
    showConfirmSuggestion: {deny:false, accept:false},
  })

  const { RemoveProduct } = useRemoveProduct({
    actions: {
      setFlags,
      setProducts
    },
  });

  const { EditProduct } = useEditProduct({
    editProduct,
    flags,
    actions: {
      setFlags,
      setProducts,
    }
  });

  const { BuyProduct } = useBuyProduct({
    selectedProduct,
    actions: {
      setFlags,
      setProducts,
      setSelectedProduct,
      setUser,
    },
    flags,
  });

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setFlags(prev => ({...prev, isLoading: false})));
  }, []);

  useLockYScroll(flags.showProductInfo);

  return {
    user, 
    flags,  
    products, 
    editProduct,  
    imagePreview, 
    advancedFilter, 
    selectedProduct,  
    setSelectedProduct, 
    handleImageChange,  
    setAdvancedFilter,  
    setEditProduct, 
    RemoveProduct,  
    setProducts,  
    EditProduct,  
    BuyProduct, 
    setUser,  
    setFlags, 
  }
}

export default useProductLogic