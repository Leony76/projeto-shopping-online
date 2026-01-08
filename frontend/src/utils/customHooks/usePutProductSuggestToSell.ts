import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import type { ProductSuggest } from "../../types/SuggestProduct";
import { useCatchError } from "../ui/useCatchError";

type UsePutProductSuggestToSell = {
  selectedSuggestedProductToSell: {
    amount: number;
    id: number | null;
  }
  actions: {
    setOpenedSuggestionId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
    setAcceptedProductSuggestions: React.Dispatch<React.SetStateAction<ProductSuggest[]>>;
    setSelectedSuggestedProductToSell: React.Dispatch<React.SetStateAction<{
      amount: number;
      id: number | null;
    }>>
    setFlags: React.Dispatch<React.SetStateAction<{
      isLoading: boolean;
      showPutToSellProductSuggestConfirm: boolean;
      processingState: boolean;
    }>>;
  }
  flags: {
    processingState: boolean;
  }
}

export const usePutProductSuggestToSell = ({actions, selectedSuggestedProductToSell, flags}:UsePutProductSuggestToSell) => {

  const { showToast } = useToast();
  const catchError = useCatchError();
  
  const PutProductSuggestToSell = async() => {
  
    if (selectedSuggestedProductToSell.id === null) return;

    if (flags.processingState)return;
    actions.setFlags(prev => ({...prev, processingState: true}));

    try {
      const response = await api.post(`/add-suggested-product/${selectedSuggestedProductToSell.id}`, {
        amount: selectedSuggestedProductToSell.amount,
      });

      actions.setAcceptedProductSuggestions(prev =>
        prev.map(suggestion =>
          suggestion.id === selectedSuggestedProductToSell.id
            ? { ...suggestion, for_sale: true }
            : suggestion
        )
      );

      actions.setOpenedSuggestionId(null);
      actions.setSelectedSuggestedProductToSell({ amount: 1, id: null });
      showToast(response.data.message, response.data.type);
    } catch (err:unknown) {
      catchError(err);
    } finally {
      actions.setFlags(prev => ({...prev, 
        showPutToSellProductSuggestConfirm: false,
        processingState: false
      }))
    }
  }

  return { PutProductSuggestToSell }
}

