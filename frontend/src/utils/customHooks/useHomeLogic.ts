import { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useLoadHomeData } from '../../services/useLoadHomeData';

import type { Product } from '../../types/Product';
import type { ProductAPI } from '../../types/ProductAPI';
import type { ProductSuggest } from '../../types/SuggestProduct';
import type { UIFlags } from '../../types/UIFlags';

import type { UserCommentaryRate } from '../../types/UserCommentaryRate';
import { useImagePreview } from '../product/useImagePreview';
import { toastAppearOnce } from '../ui/toastAppearOnce';
import { useAddSuggestion } from './useAddSuggestion';
import { useBuyProduct } from './useBuyProduct';
import { useEditProduct } from './useEditProduct';
import { useLockYScroll } from './useLockYScroll';
import { useProductSuggestionDecision } from './useProductSuggestionDecision';
import { useRemoveProduct } from './useRemoveProduct';
import { useSuggestProduct } from './useSuggestProduct';

export const useHomeLogic = () => {
  toastAppearOnce();
  
  const { user, setUser } = useAuth();
  const { handleImageChange, imagePreview, resetImagePreview } = useImagePreview();

  const {products, setProducts} = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<number | null>(null);
  const [userReviews, setUserReviews] = useState<UserCommentaryRate[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductSuggest[]>([]);
  const [addSuggestion, setAddSuggestion] = useState<string>('');
  const [flags, setFlags] = useState<UIFlags>({
    showProductInfo: false,
    showProductAmount: false,
    showConfirmPurchase: false,
    processingState: false,
    closeEditModal: false,
    isLoading: true,
    showConfirmSuggestion: {
      accept: false,
      deny: false
    },
  });
  const [processing, setProcessing] = useState({
    suggestProduct: false,
    addSuggestion: false,
  });
  
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
  });

  const [productSuggest, setProductSuggest] = useState<ProductSuggest>({
    name: "",
    image: null,
    imagePreview: "",
    description: "",
    category: "",
    price: "",
  });
  
  const { SuggestProduct } = useSuggestProduct({
    productSuggest: productSuggest,
    flags: {
      processing
    },
    actions: {
      resetImagePreview,
      setProductSuggest,
      setProcessing,
    }
  });

  const { AddSuggestion } = useAddSuggestion({
    addSuggestion,
    actions: {
      setAddSuggestion,
      setProcessing,
    }, 
    flags: {
      processing
    }
  });

  const { ProductSuggestionDecision } = useProductSuggestionDecision({
    flags,
    actions: {
      setFlags,
      setSuggestedProducts
    }
  });

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
  })

  useLoadHomeData({
    actions: {
      setUserReviews,
      setProducts,
      setSuggestedProducts,
      setFlags,
    }
  });

  useLockYScroll(flags.showProductInfo);
  useLockYScroll(flags.showConfirmSuggestion.accept);
  useLockYScroll(flags.showConfirmSuggestion.deny);

  return {
    user,
    flags,
    products,
    processing,
    userReviews,
    editProduct,
    imagePreview,
    addSuggestion,
    productSuggest,
    selectedProduct,
    suggestedProducts,
    selectedSuggestionId,
    ProductSuggestionDecision,
    setSelectedSuggestionId,
    setSelectedProduct,
    setProductSuggest,
    handleImageChange,
    setAddSuggestion,
    setEditProduct,
    SuggestProduct,
    AddSuggestion,
    RemoveProduct,
    EditProduct,
    BuyProduct,
    setFlags,
  }
}

export default useHomeLogic