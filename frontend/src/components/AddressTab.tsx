import { FaSignsPost } from '../assets/icons';
import Toast from './Toast';
import { useState } from 'react';
import EditableInfo from './SettingsEditableInfo';
import EditModal from './InfoEditModal';
import { useUser } from '../context/UserContext';
import { 
  FaRoad,
  PiMailboxFill,
  FaHouseChimney,
  FaBuildingFlag,
  BsHousesFill,
  FaCity,
  FaMapLocationDot,
  GiBrazilFlag,
} from '../assets/icons';
import type { EditAction } from '../types/EditAction';
import type { IconType } from 'react-icons';
import { api } from '../services/api';

type EditableInfoConfig = {
  key: AdressFieldsKeys;
  labelIcon: IconType;
  upperTranslatedField: string;
};

type AdressFields = {
  public_place: string;
  zip_code: string;
  residence_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
};
type AdressFieldsKeys = keyof AdressFields;

const AddressTab = () => {
  const { user, setUser } = useUser();

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'alert' } | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [processingState, setProcessingState] = useState<boolean>(false);

  const [fieldToBeEdited, setFieldToBeEdited] = useState<AdressFieldsKeys | null>();

  const [adressFields, setAdressFields] = useState<AdressFields>({
    public_place: '',
    zip_code: '',
    residence_number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
  });

  const updateField = (key: AdressFieldsKeys, value: string) => {
    setAdressFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    if (!fieldToBeEdited) return;

    try {
      const response = await api.post('/user/update-data', {
        [fieldToBeEdited]: adressFields[fieldToBeEdited],
      });

      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [fieldToBeEdited]: response.data.update ?? response.data,
        };
      });

      setToast({ message: response.data.message, type: response.data.type });
      setProcessingState(false);
      setErrorMessage(null);
      setFieldToBeEdited(null);
    } catch (err:any) {
      setToast({
        message: err.response?.data?.message || 'Erro inesperado!',
        type: 'error',
      });
    } finally {
      setProcessingState(false);
      setAdressFields({
        public_place: '',
        zip_code: '',
        residence_number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        country: '',
      });
    }
  }

  const editModalConfig: Record<AdressFieldsKeys, {
    editAction: EditAction;
    label: AdressFieldsKeys;
    upperTranslatedLabel: string;
  }> = {
    public_place: {
      editAction: 'change_public_place',
      label: 'public_place',
      upperTranslatedLabel: 'Logradouro',
    }, 
    zip_code: {
      editAction: 'change_zip_code',
      label: 'zip_code',
      upperTranslatedLabel: 'CEP',
    },
    residence_number: {
      editAction: 'change_residence_number',
      label: 'residence_number',
      upperTranslatedLabel: 'Número de residência',
    },
    complement: {
      editAction: 'change_complement',
      label: 'complement',
      upperTranslatedLabel: 'Complemento',
    },
    neighborhood: {
      editAction: 'change_neighborhood',
      label: 'neighborhood',
      upperTranslatedLabel: 'Bairro',
    },
    city: {
      editAction: 'change_city',
      label: 'city',
      upperTranslatedLabel: 'Cidade',
    },
    state: {
      editAction: 'change_state',
      label: 'state',
      upperTranslatedLabel: 'Estado'
    },
    country: {
      editAction: 'change_country',
      label: 'country',
      upperTranslatedLabel: 'País'
    }
  };

  const editableInfoConfig: EditableInfoConfig[] = [
    {
      key: 'public_place',
      labelIcon: FaRoad,
      upperTranslatedField: 'Logradouro',
    },
    {
      key: 'zip_code',
      labelIcon: PiMailboxFill,
      upperTranslatedField: 'CEP',
    },
    {
      key: 'residence_number',
      labelIcon: FaHouseChimney,
      upperTranslatedField: 'Número de residência',
    },
    {
      key: 'complement',
      labelIcon: FaBuildingFlag,
      upperTranslatedField: 'Complemento',
    },
    {
      key: 'neighborhood',
      labelIcon: BsHousesFill,
      upperTranslatedField: 'Bairro',
    },
    {
      key: 'city',
      labelIcon: FaCity,
      upperTranslatedField: 'Cidade',
    },
    {
      key: 'state',
      labelIcon: FaMapLocationDot,
      upperTranslatedField: 'Estado',
    },
    {
      key: 'country',
      labelIcon: GiBrazilFlag,
      upperTranslatedField: 'País',
    },
  ];

  return (
    <div className='address-tab'>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h2><FaSignsPost/>Endereço</h2>
      <div className="tab-main-container">
        {editableInfoConfig.map(({ key, labelIcon, upperTranslatedField }) => (
          <EditableInfo
            key={key}
            labelIcon={labelIcon}
            label={key}
            userAttribute={user?.[key]}
            upperTranslatedLabel={upperTranslatedField}
            onClick={() => setFieldToBeEdited(key)}
          />
        ))}
      </div>
      {(fieldToBeEdited && editModalConfig[fieldToBeEdited]) && (
        <>
          <div className='modal-overlay'></div>
          <EditModal
            {...editModalConfig[fieldToBeEdited]}
            errorMessage={errorMessage}
            processingState={processingState}
            userProperty={user?.[fieldToBeEdited]}
            value={adressFields[fieldToBeEdited]}
            onSubmit={handleSubmit}
            onChange={(e) => {
              updateField(fieldToBeEdited, e.target.value);
              setErrorMessage(null);
            }}
            onClickProceed={() => setProcessingState(true)}
            onClickCancel={() => {
              setFieldToBeEdited(null);
              setErrorMessage(null);
            }}
          />
        </>
      )}
    </div>
  )
}

export default AddressTab