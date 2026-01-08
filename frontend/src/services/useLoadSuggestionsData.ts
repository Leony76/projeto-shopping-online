import { useEffect } from "react";
import type { ProductSuggest } from "../types/SuggestProduct";
import type { AddSuggestions } from "../types/AddSuggestions";
import { api } from "./api";
import { useCatchError } from "../utils/ui/useCatchError";

type UseLoadSuggestionsData = {
  actions: {    
    setAcceptedProductSuggestions: React.Dispatch<React.SetStateAction<ProductSuggest[]>>;
    setAddSuggestions: React.Dispatch<React.SetStateAction<AddSuggestions[]>>;
    setFlags: React.Dispatch<React.SetStateAction<{
      isLoading: boolean;
      showPutToSellProductSuggestConfirm: boolean;
      processingState: boolean;
    }>>
  }
}

export const useLoadSuggestionsData = ({actions}:UseLoadSuggestionsData) => {

  const catchError = useCatchError();
  
  useEffect(() => {
    const loadData = async() => {
      try {
        const  [acceptedSuggestionsResponse, addSuggestionsResponse]  = await Promise.all([
          api.get<{ accepted_suggestions: ProductSuggest[] }>('/accepted-suggested-products'),
          api.get<{ add_suggestions: AddSuggestions[] }>('/add-suggestions'),
        ]);

        actions.setAcceptedProductSuggestions(acceptedSuggestionsResponse.data.accepted_suggestions);
        actions.setAddSuggestions(addSuggestionsResponse.data.add_suggestions);
      } catch (err: unknown) {
        catchError(err);
      } finally {
        actions.setFlags(prev => ({ ...prev, isLoading: false }));
      }
    }
    
    loadData();
  }, []);
}
