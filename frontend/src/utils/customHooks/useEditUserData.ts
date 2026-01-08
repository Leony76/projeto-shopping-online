import { api } from "../../services/api";
import { date } from "../formatation/date";
import { useCatchError } from "../ui/useCatchError";
import { isDateFromFuture } from "../validations/isDataFromFuture";
import type { User } from "../../types/User";
import type { Field, FieldKey, FieldType } from "../../types/SettingsUpdateField";
import { useToast } from "../../context/ToastContext";
import { fieldMap } from "../../types/SettingsUpdateField";
import type { RefObject } from "react";

type useEditUserData = {
  data: User | null;
  staticData: RefObject<User | null>;
  edit: {
    field: "Nome" | "E-mail" | "Telefone" | "Data de nascimento" | "Telefone de recuperação" | "E-mail de recuperação" | "Senha" | "Logradouro" | "CEP" | "Número de residência" | "Complemento" | "Bairro" | "Cidade" | "Estado" | "País";
    fieldType: FieldType;
  } | null
  actions: {
    setFlag: React.Dispatch<React.SetStateAction<{processingState: boolean}>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setEdit: React.Dispatch<React.SetStateAction<{
      field: Field;
      fieldType: FieldType;
    } | null>>;
  }
  flag: {
    processingState: boolean;
  };
}

const useEditUserData = ({actions, data, staticData, edit, flag}:useEditUserData) => {
  const catchError = useCatchError();
  const { showToast } = useToast();

  const fieldKey: FieldKey | undefined = edit ? fieldMap[edit.field] : undefined;

  const EditUserData = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (flag.processingState) return;
    actions.setFlag(prev => ({...prev, processingState: true}));

    if (!data || !staticData || !fieldKey) {
      actions.setFlag(prev => ({ ...prev, processingState: false }));
      return;
    }

    if (!data[fieldKey]) {
      actions.setError(`O ${edit?.field} não pode estar vazio`);
      actions.setFlag(prev => ({...prev, processingState: false}));
      return;
    }

    if (data[fieldKey] == staticData.current?.[fieldKey]) {
      actions.setError(`O ${edit?.field} não pode ser o mesmo`);
      actions.setFlag(prev => ({...prev, processingState: false}));
      return;
    }

    if (!data[fieldKey]) {
      actions.setError(`${edit?.field === 'Senha' ? 'A' : 'O'} ${edit?.field} não pode ser ${edit?.field === 'Senha' ? 'vazia' : 'vazio'}`);
      actions.setFlag(prev => ({...prev, processingState: false}));
      return;
    }

    if (data.email && data.recovery_email && data.email === data.recovery_email) {
      actions.setError('O e-mail principal e o de recuperação não podem ser iguais');
      actions.setFlag(prev => ({ ...prev, processingState: false }));
      return;
    }

    if (data.phone && data.recovery_phone && data.phone === data.recovery_phone) {
      actions.setError('O telefone principal e o de recuperação não podem ser iguais');
      actions.setFlag(prev => ({ ...prev, processingState: false }));
      return;
    }

    if (isDateFromFuture(data['birthday'])) {
      const today = new Date();

      actions.setError(`A data de nascimento não pode após ${date(today)}`);
      actions.setFlag(prev => ({...prev, processingState: false}));
      return;
    }

    try {
      const response = await api.patch(`/user/update-data`, {
        [fieldKey]: data[fieldKey],
      });

      const newData = response.data.updated_data[fieldKey];

      actions.setUser(prev => prev ? ({...prev, [fieldKey]: newData}) : prev);

      showToast(response.data.message, response.data.type);
      actions.setEdit(null);
    } catch (err:unknown) { 
      catchError(err);
    } finally {
      actions.setFlag(prev => ({...prev, processingState: false}));      
    }
  }

  return { EditUserData };
}

export default useEditUserData