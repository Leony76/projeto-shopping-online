import type { ProductSuggest } from "../../types/SuggestProduct";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useCatchError } from "../ui/useCatchError";
import { useAuth } from "../../context/AuthContext";

type useSuggestProduct = {
  productSuggest: ProductSuggest;
  flags: {
    processing: {
      suggestProduct: boolean;
      addSuggestion: boolean;
    }
  }
  actions: {
    resetImagePreview: () => void;
    setProductSuggest: React.Dispatch<React.SetStateAction<ProductSuggest>>;
    setProcessing: React.Dispatch<React.SetStateAction<{
      suggestProduct: boolean;
      addSuggestion: boolean;
    }>>;
  }
}

export const useSuggestProduct = ({actions, productSuggest, flags}:useSuggestProduct) => {

  const { showToast } = useToast();
  const { user } = useAuth();
  const catchError = useCatchError();

  const SuggestProduct = async(e:React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (flags.processing.suggestProduct) return;
    actions.setProcessing(p => ({ ...p, suggestProduct: true }));

    if (!productSuggest.name || !productSuggest.category || !productSuggest.description || !productSuggest.price || !productSuggest.image) {
      showToast('Preencha todos os campos antes de mandar sua sugestão', 'error');
      actions.setProcessing(p => ({ ...p, suggestProduct: false }));
      return;
    }

    const payload = new FormData();

    payload.append('name', productSuggest.name);
    payload.append('category', productSuggest.category);
    payload.append('description', productSuggest.description);
    payload.append('price', productSuggest.price);
    payload.append('image', productSuggest.image);

    try {
      const response = await api.post(`/product-suggest/${user?.id}`, payload);

      showToast(response.data.message, response.data.type);
      actions.setProductSuggest(prev => ({...prev, name: '', category: '', description: '', price: '', image: null}))
      actions.resetImagePreview();
    } catch (err:unknown) {
      catchError(err);
    } finally {
      actions.setProcessing(p => ({ ...p, suggestProduct: false }));
    }
  }

  return {
    SuggestProduct
  }
}
