import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import type { AddSuggestions } from "../../types/AddSuggestions";
import { useCatchError } from "../ui/useCatchError";

type useAddSuggestionDecision = {
  actions: {
    setAddSuggestions: React.Dispatch<React.SetStateAction<AddSuggestions[]>>;
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

export const useAddSuggestionDecision = ({actions, flags}:useAddSuggestionDecision) => {

  const { showToast } = useToast();
  const catchError = useCatchError();
  
  const AddSuggestionDecision = async(
    addSuggestionId: number,
    decision: 'accepted' | 'denied', 
  ) => {

    if (flags.processingState)return;
    actions.setFlags(prev => ({...prev, processingState: true}));

    try {
      const response = await api.patch(`/add-suggestion-decision/${addSuggestionId}`, 
        {decision}
      );

      if (decision === 'denied') {
        actions.setAddSuggestions(prev =>
          prev.filter(p => p.id !== addSuggestionId)
        )
      } else {
        actions.setAddSuggestions(prev =>
          prev.map(p =>
            p.id === addSuggestionId
              ? {...p, accepted: true}
              : p
          )
        );
      } 

      showToast(response.data.message, response.data.type);
    } catch (err:unknown) { 
      catchError(err);
    } finally {
      actions.setFlags(prev => ({...prev, processingState: false}));
    }
  }

  return { AddSuggestionDecision }
}
