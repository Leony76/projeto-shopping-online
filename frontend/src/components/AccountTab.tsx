import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { isValidEmail } from '../utils/validateEmail';
import type { EditAction } from '../types/EditAction';
import type { User } from '../types/User';
import {
  MdAccountCircle,
  FaUser,
  IoMdMail,
  FaPhone,
  FaBaby,
} from '../assets/icons';
import '../pages/Settings.css';
import type { IconType } from 'react-icons';

import Toast from './Toast';
import EditableInfo from './SettingsEditableInfo';
import EditModal from './InfoEditModal';

type AccountFields = {
  username: string;
  email: string;
  phone: string;
  birthday: string;
};

type StringUserKeys = {
  [K in keyof User]: User[K] extends string | null ? K : never
}[keyof User];

type AccountInputLabel = 'name' | 'email' | 'phone' | 'birthday';
type AccountFieldKeys = keyof AccountFields;

const AccountTab = () => {
  const { user, setUser } = useUser();

  const [accountFields, setAccountFields] = useState<AccountFields>({
    username: '',
    email: '',
    phone: '',
    birthday: '',
  });

  const updateField = (key: AccountFieldKeys, value: string) => {
    setAccountFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const mapUserField: Record<AccountFieldKeys, StringUserKeys> = {
    username: 'name',
    email: 'email',
    phone: 'phone',
    birthday: 'birthday',
  };

  const [fieldToBeEdited, setFieldToBeEdited] = useState<AccountFieldKeys | null>(null);

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'alert' } | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [processingState, setProcessingState] = useState<boolean>(false);

  const editModalConfig: Record<AccountFieldKeys, {
    editAction: EditAction;
    label: AccountInputLabel; 
    upperTranslatedLabel: string;
    validate?: (v: string) => string | null;
  }> = {
    username: {
      editAction: 'change_name',
      label: 'name',
      upperTranslatedLabel: 'Nome',
    },
    email: {
      editAction: 'change_email',
      label: 'email',
      upperTranslatedLabel: 'E-mail',
      validate: v => !isValidEmail(v) ? 'E-mail inválido' : null,
    },
    phone: {
      editAction: 'change_phone',
      label: 'phone',
      upperTranslatedLabel: 'Telefone',
    },
    birthday: {
      editAction: 'change_birthday',
      label: 'birthday',
      upperTranslatedLabel: 'Data de Nascimento',
    },
  };


  const editableInfoConfig: {
    key: AccountFieldKeys;
    label: AccountInputLabel;
    icon: IconType;
    upperTranslatedLabel: string;
  }[] = [
    {
      key: 'username',
      label: 'name',
      icon: FaUser,
      upperTranslatedLabel: 'Nome',
    },
    {
      key: 'email',
      label: 'email',
      icon: IoMdMail,
      upperTranslatedLabel: 'E-mail',
    },
    {
      key: 'phone',
      label: 'phone',
      icon: FaPhone,
      upperTranslatedLabel: 'Telefone',
    },
    {
      key: 'birthday',
      label: 'birthday',
      icon: FaBaby,
      upperTranslatedLabel: 'Data de Nascimento',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldToBeEdited) return;

    const config = editModalConfig[fieldToBeEdited];
    const value = accountFields[fieldToBeEdited];

    if (!value.trim()) {
      setErrorMessage('O campo não pode estar vazio');
      setProcessingState(false);
      return;
    }

    if (config.validate) {
      const error = config.validate(value);
      if (error) {
        setErrorMessage(error);
        setProcessingState(false);
        return;
      }
    }

    try {
      const response = await api.post('/user/update-data', {
        [fieldToBeEdited]: value,
      });

      setUser(prev => ({
        ...prev!,
        [fieldToBeEdited]: response.data.update,
      }));

      setToast({ message: response.data.message, type: response.data.type });
      setFieldToBeEdited(null);
      setErrorMessage(null);
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || 'Erro inesperado',
        type: 'error',
      });
    } finally {
      setProcessingState(false);
      setAccountFields({
        username: '',
        email: '',
        phone: '',
        birthday: '',
      });
    }
  };


  return (
    <div className='account-tab'>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h2><MdAccountCircle />Perfil/Conta</h2>
      <div className="tab-main-container">
      {editableInfoConfig.map(({ key, icon, label, upperTranslatedLabel }) => (
        <EditableInfo
          key={key}
          label={label}                 
          labelIcon={icon}
          userAttribute={user?.[mapUserField[key]]}
          upperTranslatedLabel={upperTranslatedLabel}
          onClick={() => setFieldToBeEdited(key)}
        />
      ))}
    </div>
    {fieldToBeEdited && (
      <>
        <div className="modal-overlay" />
        <EditModal
          {...editModalConfig[fieldToBeEdited]}
          errorMessage={errorMessage}
          processingState={processingState}
          userProperty={user?.[mapUserField[fieldToBeEdited]]}
          value={accountFields[fieldToBeEdited]}
          onChange={e => {
            updateField(fieldToBeEdited, e.target.value);
            setErrorMessage(null);
          }}
          onSubmit={handleSubmit}
          onClickProceed={() => setProcessingState(true)}
          onClickCancel={() => setFieldToBeEdited(null)}
        />
      </>
    )}
    </div>
  )
}

export default AccountTab