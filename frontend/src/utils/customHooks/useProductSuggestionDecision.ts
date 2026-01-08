import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import type { ProductSuggest } from "../../types/SuggestProduct";
import type { UIFlags } from "../../types/UIFlags";
import { useCatchError } from "../ui/useCatchError";

type useProductSuggestionDecision = {
  actions: {
    setFlags: React.Dispatch<React.SetStateAction<UIFlags>>;
    setSuggestedProducts: React.Dispatch<React.SetStateAction<ProductSuggest[]>>;
  }
  flags: UIFlags;
}

export const useProductSuggestionDecision = ({actions, flags}:useProductSuggestionDecision) => {

  const { showToast } = useToast();
  const catchError = useCatchError();

  const ProductSuggestionDecision = async(id: number | null, isAccept: boolean) => {
    if (!id || flags.processingState) return;
    actions.setFlags(prev => ({...prev, processingState: true}));

    try {
      const response = await api.patch(`/suggested-product-answer/${id}`, {
        answer: isAccept ? 'accepted' : 'denied',
      });

      showToast(response.data.message, response.data.type);

      actions.setSuggestedProducts(prev =>
        prev.filter(p => p.id !== id)
      );
    } catch (err) {
      catchError(err);
    } finally {
      actions.setFlags(prev => ({...prev, showConfirmSuggestion: { accept: false, deny: false }}));
      actions.setFlags(prev => ({...prev, processingState: false}));
    }
  };

  return {
    ProductSuggestionDecision
  }
}

