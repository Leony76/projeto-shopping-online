import { useState } from "react";
import { useLoadSuggestionsData } from "../../services/useLoadSuggestionsData";
import type { AddSuggestions } from "../../types/AddSuggestions";
import type { ProductSuggest } from "../../types/SuggestProduct";
import { useAddSuggestionDecision } from "./useAddSuggestionDecision";
import { useLockYScroll } from "./useLockYScroll";
import { usePutProductSuggestToSell } from "./usePutProductSuggestToSell";

const useSuggestionsLogic = () => {
  const [acceptedProductSuggestions, setAcceptedProductSuggestions] = useState<ProductSuggest[]>([]);
  const [selectedSuggestedProductToSell, setSelectedSuggestedProductToSell] = useState<{ amount: number; id: number | null }>({
    amount: 1,
    id: null,
  });
  const [addSuggestions, setAddSuggestions] = useState<AddSuggestions[]>([]);
  const [openedSuggestionId, setOpenedSuggestionId] = useState<number | null | undefined>(null);

  const [flags, setFlags] = useState({
    isLoading: true,
    showPutToSellProductSuggestConfirm: false,
    processingState: false,
  });

  const { AddSuggestionDecision } = useAddSuggestionDecision({
    actions: {
      setAddSuggestions,
      setFlags,
    },
    flags: {processingState: flags.processingState},
  });

  const { PutProductSuggestToSell } = usePutProductSuggestToSell({
    selectedSuggestedProductToSell,
    actions: {
      setOpenedSuggestionId,
      setAcceptedProductSuggestions,
      setSelectedSuggestedProductToSell, 
      setFlags,
    },
    flags: {processingState: flags.processingState,}
  });

  useLoadSuggestionsData({
    actions: {
      setAcceptedProductSuggestions,
      setAddSuggestions,
      setFlags,
    }
  })

  useLockYScroll(flags.showPutToSellProductSuggestConfirm);

  return {
    flags,
    addSuggestions,
    openedSuggestionId,
    acceptedProductSuggestions,
    selectedSuggestedProductToSell,
    setSelectedSuggestedProductToSell,
    setAcceptedProductSuggestions,
    PutProductSuggestToSell,
    setOpenedSuggestionId,
    AddSuggestionDecision,
    setAddSuggestions,
    setFlags,
  }
}

export default useSuggestionsLogic