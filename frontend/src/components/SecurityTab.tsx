import { 
  MdOutlineSecurity,
  RiLockPasswordFill,
  MdEditSquare,
  ImCross,
  RiErrorWarningLine,
  MdVerifiedUser,
  MdOutgoingMail
 } from '../assets/icons';
import Toast from './Toast';
import { useState } from 'react';
import '../pages/Settings.css';
import { api } from '../services/api';
import Loading from './Loading2';
import { useUser } from '../context/UserContext';

type SecurittFieldKey = 'password' | 'recovery_email' | 'recovery_phone';

const SecurityTab = () => {
  const { user } = useUser();

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'alert'} | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  
  const [password, setPassword] = useState<string>('');
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [recoveryPhone, setRecoveryPhone] = useState<string>('');

  const [showEditModal, setEditModal] = useState<SecurittFieldKey | null>(null);
  const [showVerifyPasswordModal, setVerifyPasswordModal] = useState<boolean>(false);
  const [processingState, setProcessingState] = useState<boolean>(false);

  const fields: Record<SecurittFieldKey, {
    route: string;
    payloadKey: string;
    value: string;
  }> = {
    password: {
      route: 'user/update-password',
      payloadKey: 'new_password',
      value: password,
    },
    recovery_email: {
      route: 'user/update-recovery-email',
      payloadKey: 'recovery_email',
      value: recoveryEmail,
    },
    recovery_phone: {
      route: 'user/update-recovery-phone',
      payloadKey: 'recovery_phone',
      value: recoveryPhone,
    }
  }

  const handleVerifyCurrentPassword = async(e:React.FormEvent) => {
    e.preventDefault();
    
    if (password === '') {
      setErrorMessage('Preencha com sua senha atual');
      setProcessingState(false);
      return;
    }

    try {
      const response = await api.post('user/verify-password', {
        password: password
      })

      setEditModal(response.data.success);
      setErrorMessage(null);
      setProcessingState(false);
      setVerifyPasswordModal(false);
    } catch (err:any) {
      setErrorMessage(err.response?.data?.message);
      setProcessingState(false);
    }
  }

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    if (!showEditModal)return;

    const field = fields[showEditModal]; 

    if (!field.value || field.value.trim() === '') {
      setErrorMessage('Campo não pode estar vazio');
      return;
    }    

    try {
      const response = await api.post(field.route, {
        [field.payloadKey]: field.value,
      });

      setEditModal(null);
      setProcessingState(false);
      setToast({message: response.data.message, type: response.data.type})
    } catch (err:any) {
      setErrorMessage(err.response?.data?.message);
      setProcessingState(false);
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
      <div className="account-tab-main-container">
        <div className={`password info`}>
          <span title='Senha'><RiLockPasswordFill/>Senha:</span><p title='Senha'>********</p>
          <span className='dot'>•</span>
          <button onClick={() => setVerifyPasswordModal(true)} title='Editar'><MdEditSquare/></button>
        </div>
      </div>
      <div className="account-tab-main-container">
        <div className={`password info`}>
          <span title='Senha'><MdOutgoingMail size={25}/>Email de recuperação:</span><p title='E-mail de recuperação'>{user?.recovery_email == null ? 'Não definido' : user?.recovery_email}</p>
          <span className='dot'>•</span>
          <button onClick={() => setEditModal('recovery_email')} title='Editar'><MdEditSquare/></button>
        </div>
      </div>
      {isAnyModalOpen && (
        <div className='modal-overlay'></div>
      )}
      {showVerifyPasswordModal && (
        <div className='setting-edit-modal'>
          <h3>Verificar senha</h3>
          <div className='label-input'>
            <label>Insira sua senha atual:</label>
            <input onChange={(e) => setPassword(e.target.value)} placeholder='Senha atual' type="password" maxLength={20}/>
            {errorMessage && <p className="modal-error-message"><RiErrorWarningLine size={20}/>{errorMessage}</p>}
          </div>
          <form onSubmit={handleVerifyCurrentPassword} className='buttons'>
            <button onClick={() => setProcessingState(true)} type='submit'>{processingState ? <Loading/> : <MdVerifiedUser size={20}/>}{processingState ? 'Verificando' : 'Verificar'}</button>
            {processingState ? (
              <button disabled style={{filter: 'brightness(.8)', cursor: 'not-allowed'}} type='button'><ImCross size={15}/>Cancelar</button>
            ) : (
              <button onClick={() => {
                setEditModal(null);
                setVerifyPasswordModal(false);
                setErrorMessage(null);
              }} type='button'><ImCross size={15}/>Cancelar</button>
            )}
          </form>
        </div>
      )}
      {showEditModal === 'password' ? (
        <div className='setting-edit-modal'>
          <h3>Alterar senha</h3>
          <div className='label-input'>
            <label>Insira uma nova senha:</label>
            <input onChange={(e) => setPassword(e.target.value)} placeholder='Senha' type="password" maxLength={20}/>
            {errorMessage && <p className="modal-error-message"><RiErrorWarningLine size={20}/>{errorMessage}</p>}
          </div>
          <form onSubmit={handleSubmit} className='buttons'>
            <button onClick={() => setProcessingState(true)} type='submit'>{processingState ? <Loading/> : <MdEditSquare size={20}/>}{processingState ? 'Alterando' : 'Alterar'}</button>
            {processingState ? (
              <button disabled style={{filter: 'brightness(.8)', cursor: 'not-allowed'}} type='button'><ImCross size={15}/>Cancelar</button>
            ) : (
              <button onClick={() => {
                setEditModal(null);
                setErrorMessage(null);
              }} type='button'><ImCross size={15}/>Cancelar</button>
            )}
          </form>
        </div>
      ) : showEditModal === 'recovery_email' ? (
        <div className='setting-edit-modal'>
          <h3>{user?.recovery_email == null ? 'Definir e-mail de recuperação' : 'Alterar e-mail de recuperação'}</h3>
          <div className='label-input'>
            <label>{user?.recovery_email == null ? 'Defina um e-mail de recuperação:' : 'Insira um novo e-mail de recuperação:'}</label>
            <input onChange={(e) => setPassword(e.target.value)} placeholder='E-mail de recuperação' type="email" maxLength={100}/>
            {errorMessage && <p className="modal-error-message"><RiErrorWarningLine size={20}/>{errorMessage}</p>}
          </div>
          <form onSubmit={handleSubmit} className='buttons'>
            {user?.recovery_email == null ? (
              <button onClick={() => setProcessingState(true)} type='submit'>{processingState ? <Loading/> : <MdEditSquare size={20}/>}{processingState ? 'Definindo' : 'Definir'}</button>
            ) : (
              <button onClick={() => setProcessingState(true)} type='submit'>{processingState ? <Loading/> : <MdEditSquare size={20}/>}{processingState ? 'Alterando' : 'Alterar'}</button>
            )}
            {processingState ? (
              <button disabled style={{filter: 'brightness(.8)', cursor: 'not-allowed'}} type='button'><ImCross size={15}/>Cancelar</button>
            ) : (
              <button onClick={() => {
                setEditModal(null);
                setErrorMessage(null);
              }} type='button'><ImCross size={15}/>Cancelar</button>
            )}
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default SecurityTab