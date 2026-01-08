import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import { useCatchError } from "../ui/useCatchError";

type useAddSuggestion = {
  addSuggestion: string;
  actions: {
    setAddSuggestion: React.Dispatch<React.SetStateAction<string>>;
    setProcessing: React.Dispatch<React.SetStateAction<{
      suggestProduct: boolean;
      addSuggestion: boolean;
    }>>;
  }
  flags: {
    processing: {
      suggestProduct: boolean;
      addSuggestion: boolean;
    }
  }
}

export const useAddSuggestion = ({actions, addSuggestion, flags}:useAddSuggestion) => {

  const { showToast} = useToast();
  const catchError = useCatchError();

  const AddSuggestion = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (flags.processing.addSuggestion) return;
    actions.setProcessing(p => ({ ...p, addSuggestion: true }));

    if (!addSuggestion) {
      showToast('Insira uma sugestão antes de mandar', 'alert');
      actions.setProcessing(p => ({ ...p, addSuggestion: false }));
      return;
    } if (addSuggestion.length < 2) {
      showToast('A sugestão de ter no mínimo 2 caractéres', 'alert');
      actions.setProcessing(p => ({ ...p, addSuggestion: false }));
      return;
    }

    try {
      const response = await api.post('/add-suggestion', {
        add_suggest: addSuggestion,
      });

      showToast(response.data.message, response.data.type);
    } catch (err:unknown) {
      catchError(err);
    } finally {
      actions.setProcessing(p => ({ ...p, addSuggestion: false }));
      actions.setAddSuggestion('');
    }
  }

  return {
    AddSuggestion
  }
}

