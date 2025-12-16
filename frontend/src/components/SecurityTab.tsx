import { 
  MdOutlineSecurity,
  RiLockPasswordFill,
  MdOutgoingMail,
  BsFillTelephoneForwardFill,
 } from '../assets/icons';
import Toast from './Toast';
import { useState } from 'react';
import '../pages/Settings.css';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { isValidEmail } from '../utils/validateEmail';
import { formatPhone } from '../utils/formatPhone';
import EditableInfo from './SettingsEditableInfo';
import EditModal from './InfoEditModal';

type SecurityFieldState = {
  password: string;
  recoveryEmail: string;
  recoveryPhone: string;
}
type SecurityFieldKeys = keyof SecurityFieldState;

const SecurityTab = () => {
  const { user, setUser } = useUser();

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'alert'} | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  
  const [securityFields, setSecurityField] = useState<SecurityFieldState>({
    password: '',
    recoveryEmail: '',
    recoveryPhone: '',
  });

  const updateField = (key: SecurityFieldKeys, value: string) => {
    setSecurityField(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const [showEditModal, setEditModal] = useState<SecurityFieldKeys | null>(null);
  const [showVerifyPasswordModal, setVerifyPasswordModal] = useState<boolean>(false);
  const [processingState, setProcessingState] = useState<boolean>(false);

  const fields: Record<SecurityFieldKeys, {
    route: string;
    payloadKey: string;
    value: string;
    name: string;
  }> = {
    password: {
      route: 'user/update-password',
      payloadKey: 'new_password',
      value: securityFields.password,
      name: 'senha'
    },
    recoveryEmail: {
      route: 'user/update-recovery-email',
      payloadKey: 'recovery_email',
      value: securityFields.recoveryEmail,
      name: 'e-mail de recuperação'
    },
    recoveryPhone: {
      route: 'user/update-recovery-phone',
      payloadKey: 'recovery_phone',
      value: securityFields.recoveryPhone,
      name: 'telefone de recuperação'
    }
  }

  const handleVerifyCurrentPassword = async(e:React.FormEvent) => {
    e.preventDefault();
    
    if (!securityFields.password) {
      setErrorMessage('Preencha com sua senha atual');
      setProcessingState(false);
      return;
    }

    try {
      const response = await api.post('user/verify-password', {
        password: securityFields.password
      })

      setEditModal(response.data.success);
      setErrorMessage(null);
      setProcessingState(false);
      setVerifyPasswordModal(false);
    } catch (err:any) {
      setErrorMessage(err.response?.data?.message);
      setProcessingState(false);
      setSecurityField(prev => ({
        ...prev,
        password: '',
      }));
    } 
  }

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    if (!showEditModal)return;

    const field = fields[showEditModal]; 

    if (field.payloadKey === 'recovery_email' && !isValidEmail(field.value)) {
      setErrorMessage('E-mail inválido');
      setProcessingState(false);
      return;
    }

    if (field.payloadKey === 'recovery_phone') {
      const normalizedPhone = field.value.replace(/\D/g, '');

      field.value = normalizedPhone;
    }

    if (!field.value || field.value.trim() === '') {
      setErrorMessage(`O novo ${field.name} não pode estar vazio`);
      setProcessingState(false);
      return;
    }    

    try {
      const response = await api.post(field.route, {
        [field.payloadKey]: field.value,
      });

      const new_data = response.data.update;

      setUser(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          [field.payloadKey]: new_data
        }
      });

      setEditModal(null);
      setProcessingState(false);
      setErrorMessage(null);
      setToast({message: response.data.message, type: response.data.type})
    } catch (err:any) {
      setErrorMessage(err.response?.data?.message);
      setProcessingState(false);
    } finally {
      setSecurityField({
        password: '',
        recoveryEmail: '',
        recoveryPhone: '',
      });
    }
  }

  const isAnyModalOpen = Boolean(showEditModal || showVerifyPasswordModal);

  return (
    <div className='security-tab'>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h2><MdOutlineSecurity/>Segurança</h2>
      <div className="tab-main-container">
        <EditableInfo
          labelIcon={RiLockPasswordFill}
          label={'password'}
          upperTranslatedLabel={'Senha'}
          userAttribute={'*******'}
          onClick={() => setVerifyPasswordModal(true)}
        />
        <EditableInfo
          labelIcon={MdOutgoingMail}
          label={'recovery_email'}
          upperTranslatedLabel={'E-mail de recuperação'}
          userAttribute={user?.recovery_email == null ? 'Não definido' : user?.recovery_email}
          onClick={() => setEditModal('recoveryEmail')}
        />
        <EditableInfo
          labelIcon={BsFillTelephoneForwardFill}
          label={'recovery_phone'}
          upperTranslatedLabel={'Telefone de recuperação'}
          userAttribute={user?.recovery_phone == null ? 'Não definido' : formatPhone(user?.recovery_phone)}
          onClick={() => setEditModal('recoveryPhone')}
        />
      </div>

      {isAnyModalOpen && (
        <div className='modal-overlay'></div>
      )}
      {showVerifyPasswordModal && (
        <EditModal
          editAction={'verify_password'}
          label={'password'}
          upperTranslatedLabel={'Senha'}
          errorMessage={errorMessage}
          processingState={processingState}
          onChange={(e) => {
            updateField('password', e.target.value);
            setErrorMessage(null);
          }}
          onSubmit={handleVerifyCurrentPassword}
          value={securityFields.password}
          onClickProceed={() => {setProcessingState(true)}}
          onClickCancel={() => {
            setEditModal(null);
            setVerifyPasswordModal(false);
            setErrorMessage(null);
          }}
        />
      )}
      {showEditModal === 'password' ? (
        <EditModal
          editAction={'change_password'}
          label={'password'}
          upperTranslatedLabel={'Senha'}
          errorMessage={errorMessage}
          processingState={processingState}
          onChange={(e) => {
            updateField('password', e.target.value);
            setErrorMessage(null);
          }}
          onSubmit={handleSubmit}
          onClickProceed={() => setProcessingState(true)}
          onClickCancel={() => {
            setEditModal(null);
            setErrorMessage(null);
          }}
        />
      ) : showEditModal === 'recoveryEmail' ? (
        <EditModal
          editAction={'change_recovery_email'}
          userProperty={user?.recovery_email}
          label={'recovery_email'}
          upperTranslatedLabel={'E-mail'}
          errorMessage={errorMessage}
          processingState={processingState}
          onChange={(e) => {
            updateField('recoveryEmail', e.target.value);
            setErrorMessage(null);
          }}
          onSubmit={handleSubmit}
          onClickProceed={() => setProcessingState(true)}
          onClickCancel={() => {
            setEditModal(null);
            setErrorMessage(null);
          }}
        />
      ) : showEditModal === 'recoveryPhone' ? (
        <EditModal
          editAction={'change_recovery_phone'}
          label={'phone'}
          upperTranslatedLabel={'Telefone'}
          errorMessage={errorMessage}
          processingState={processingState}
          userProperty={user?.recovery_phone}
          onChange={(e) => {
            const value = e.target.value;

            if (!/^[0-9()\-\s]*$/.test(value)) return;

            updateField('recoveryPhone', e.target.value);
            setErrorMessage(null);
          }}
          value={securityFields.recoveryPhone}
          onSubmit={handleSubmit}
          onClickProceed={() => setProcessingState(true)}
          onClickCancel={() => {
            setEditModal(null);
            setErrorMessage(null);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default SecurityTab