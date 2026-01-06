import type { User } from "../../types/User";
import { MdEditSquare } from "react-icons/md";
import CardFocusOverlay from "../ui/CardFocusOverlay";
import ProceedActionButton from "../ui/ProceedActionButton";
import XCloseTopRight from "../ui/XCloseTopRight";
import Input from "./InputForm";
import { type Field, type FieldType, type FieldKey } from "../../types/SettingsUpdateField";
import { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { api } from "../../services/api";
import type { ToastType } from "../../context/ToastContext";
import { maskCEP } from "../../utils/mask/maskCEP";
import { maskPhone } from "../../utils/mask/maskPhone";
import WarnError from "../ui/WarnError";

type EditSettingsField = {
  element: {
    field: Field;
    fieldType: FieldType;
    error: string;

    fieldKey: FieldKey;

    edit: {
      field: Field;
      fieldType: FieldType;
    } | null;
  }

  action: {
    handleEditData: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    
    showToast: (message: string, type?: ToastType | undefined) => void;

    setData: (value: React.SetStateAction<User | null>) => void;
    setError: (value: React.SetStateAction<string>) => void;
    setEdit: (value: React.SetStateAction<{
      field: Field;
      fieldType: FieldType;
    } | null>) => void;
  }
  
  flag: {
    processingState: boolean;
  }

  data: User | null;
  staticDataRef: React.RefObject<User | null>;
}

const EditSettingsField = ({
  element,
  action,
  flag,
  data,
  staticDataRef,
}:EditSettingsField) => {

  const [editable, setEditable] = useState({
    password: false,
    anyField: false,
  });

  const [error, setError] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [processingState, setProcessingState] = useState<boolean>(false);

  const [showCurrentPasswordCheckout, setShowCurrentPasswordCheckout] = useState<boolean>(false);

  useEffect(() => {
    if (element.field === 'Senha') {
      setShowCurrentPasswordCheckout(true);
    } else {
      setEditable(prev => ({...prev, anyField: true}));
    }
  },[]);

  const handleCheckoutCurrentPassword = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (processingState)return;
    setProcessingState(true);

    if (!password) {
      setError('A senha atual não é vazia');
      setProcessingState(false);
      return;
    }

    try {

      const response = await api.post(`/passwordCheck`, {
        password: password,
      });

      if (response.data.type === 'success') {
        setEditable(prev => ({...prev, password: true}));
      } 

    } catch {
      setError('Senha Inválida');
    } finally {
      setProcessingState(false);
    }
  }

  return (
    <>
      <CardFocusOverlay onClick={() => action.setEdit(null)}/>
      {(editable.password || editable.anyField) && (
        <form onSubmit={action.handleEditData} className="z-50 w-full sm:max-w-[400px] max-w-[95dvw] max fixed left-1/2 top-1/2 translate-[-50%] bg-white border-x-6 border-cyan-600 border-double px-2 pt-2">
          {flag.processingState ? (<XCloseTopRight style="bg-transparent"/>) : (<XCloseTopRight  style="bg-transparent" closeSetter={() => {
            action.setEdit(null),
            action.setError('');
            action.setData(staticDataRef.current);
          }}/>)}
          {element.edit && (
            <>
              <h3 className="flex items-center gap-1 text-xl font-bold text-yellow-600"><MdEditSquare/>{element.edit.field === 'Senha' ? 'Alterar' : !staticDataRef.current?.[element.fieldKey] ? 'Definir'  : 'Editar'} {element.edit.field.toLocaleLowerCase()}</h3>
              {element.fieldKey && (
                <Input
                  fieldType={element.edit.fieldType}
                  placeholderValue={element.edit.field}
                  password={{newPassword: true}}
                  fieldName={`${element.edit.fieldType === 'password' ? 'Nova' : 'Novo'} ${element.edit.field.toLocaleLowerCase()}`}
                  value={data?.[element.fieldKey] ?? ''}
                  onChange={(e) => {
                    action.setError('');
                    if (element.edit && element.edit.field === 'CEP') {
                      action.setData(prev => prev ? {...prev, [element.fieldKey]: maskCEP(e.target.value)} : prev)
                    } else if (element.edit && element.edit.fieldType === 'tel') {
                      action.setData(prev => prev ? {...prev, [element.fieldKey]: maskPhone(e.target.value)} : prev)
                    } else {
                      action.setData(prev => prev ? {...prev, [element.fieldKey]: e.target.value} : prev)
                    }             
                  }}                                      
                />
              )}
            </>
          )}
          {element.error && <WarnError error={!element.error ? error : element.error}/>}
          {element.edit && (
            <ProceedActionButton
              iconButton={MdEditSquare}
              iconButtonSize={15}
              buttonLabel={`${element.edit.field === 'Senha' ? 'Alterar' : !staticDataRef.current?.[element.fieldKey] ? 'Definir' : 'Editar'}`}
              styles="px-2 !flex-1 sm:w-fit w-full my-2 mt-3 bg-yellow-100 text-yellow-600 border-yellow-600"
              processingState={flag.processingState}
              buttonLabelWhileProcessing={`${element.edit.field === 'Senha' ? 'Alterando' : !staticDataRef.current?.[element.fieldKey] ? 'Definindo' : 'Editando'}`}
              actionType="submit"
            />
          )}
        </form>
      )}

      {(showCurrentPasswordCheckout && !editable.password) && (
        <form autoComplete="off" onSubmit={handleCheckoutCurrentPassword} className="z-50 w-[400px] fixed left-1/2 top-1/2 translate-[-50%] bg-white border-x-6 border-cyan-600 border-double px-2 pt-2">
          {processingState ? (<XCloseTopRight/>) : (<XCloseTopRight closeSetter={() => {
            action.setEdit(null),
            action.setError('');
          }}/>)}
          {element.edit && (
            <>
              <h3 className="flex items-center gap-1 text-xl font-bold text-yellow-600"><FaShieldAlt/>Verificar senha</h3>
              {element.fieldKey && (
                <Input
                  fieldType={'password'}
                  fieldName={`Insira sua senha atual`}
                  password={{currentPassword: true}}
                  value={password}
                  onChange={(e) => {
                    setError(''),
                    setPassword(e.target.value)}
                  }
                />
              )}
            </>
          )}
          {error && <WarnError error={!element.error ? error : element.error}/>}
          {element.edit && (
            <ProceedActionButton
              iconButton={IoShieldCheckmarkSharp}
              iconButtonSize={20}
              buttonLabel={`Verificar`}
              styles="px-2 !flex-1 my-2 bg-yellow-100 text-yellow-600 border-yellow-600"
              processingState={processingState}
              buttonLabelWhileProcessing={`Verificando`}
              actionType="submit"
            />
          )}
        </form>
      )}
    </>
  )
}

export default EditSettingsField