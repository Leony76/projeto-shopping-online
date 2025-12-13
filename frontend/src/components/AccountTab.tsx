import { useState } from 'react';
import { 
  MdAccountCircle,
  FaUser,
  IoMdMail,
  FaPhone,
  FaBaby,
} from '../assets/icons';
import '../pages/Settings.css';
import { useUser } from '../context/UserContext';
import EditModal from './EditModal';
import { api } from '../services/api';
import Toast from './Toast';
import SettingEditableInfos from './SettingEditableInfos';

type FieldKey = 'name' | 'email' | 'phone' | 'birthday';

const AccountTab = () => {
  const { user, setUser } = useUser();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'alert'} | null>();
  
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [showEditModal, setEditModal] = useState<'name' | 'email' | 'phone' | 'birthday' | null>(null);

  const fields:Record<FieldKey, {
    value: string;
    old: string | undefined;
    emptyMsg: string;
    sameMsg: string;
    normalize: (v: string) => string;
  }> = {
    name: {
      value: username,
      old: user?.name,
      emptyMsg: "O novo nome não pode estar vazio",
      sameMsg: "O novo nome não pode ser o mesmo do atual",
      normalize: (v: string) => v.toLowerCase(),
    },
    email: {
      value: email,
      old: user?.email,
      emptyMsg: "O novo email não pode estar vazio",
      sameMsg: "O novo email não pode ser o mesmo do atual",
      normalize: (v: string) => v.toLowerCase(),
    },
    phone: {
      value: phone,
      old: user?.phone,
      emptyMsg: "O novo telefone não pode estar vazio",
      sameMsg: "O novo telefone não pode ser o mesmo do atual",
      normalize: (v: string) => v,
    },
    birthday: {
      value: birthday,
      old: user?.birthday,
      emptyMsg: "A nova data de nascimento não pode estar vazia",
      sameMsg: "A nova data de nascimento não pode ser a mesma da atual",
      normalize: (v: string) => v,
    },
  };

  const validateField = (field: FieldKey) => {
    const { value, old, emptyMsg, sameMsg, normalize } = fields[field];

    if (!value || value.trim() === "") {
      setErrorMessage(emptyMsg);
      return false;
    }

    if (normalize(value) === normalize(old ?? "")) {
      setErrorMessage(sameMsg);
      return false;
    }

    return true;
  };

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();
    
    if (!showEditModal) return;
    if (!validateField(showEditModal)) return;

    try {
      const response = await api.post('/user/update-data', {
        username: username,
        email: email,
        phone: phone,
        birthday: birthday,
      });

      const newUserData = response.data.user_new_data;

      setUser(prev => ({
        ...prev,
        ...newUserData,
      }));

      setToast({message:  response.data.message, type: response.data.type});
      setErrorMessage(null);
      setEditModal(null);
    } catch (err:any) {
      setToast({
        message:  err.response?.data?.message || 'Erro inesperado!', 
        type: 'error',
      });
    }
  }

  return (
    <div className='account-tab'>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2><MdAccountCircle/>Perfil/Conta</h2>
      <div className='account-tab-main-container'>
        <SettingEditableInfos
          fieldname={'name'}
          fieldLabel={'Nome'}
          value={username}
          user={user?.name}
          fieldIcon={FaUser}
          setEditModal={setEditModal}
          resetFields={() => {
            setUsername('');
            setEmail('');
            setPhone('');
            setBirthday('');
          }}
        />
        <SettingEditableInfos
          fieldname={'email'}
          fieldLabel={'E-mail'}
          value={email}
          user={user?.email}
          fieldIcon={IoMdMail}
          setEditModal={setEditModal}
          resetFields={() => {
            setUsername('');
            setEmail('');
            setPhone('');
            setBirthday('');
          }}
        />
        <SettingEditableInfos
          fieldname={'phone'}
          fieldLabel={'Telefone'}
          value={phone}
          user={user?.phone}
          fieldIcon={FaPhone}
          setEditModal={setEditModal}
          resetFields={() => {
            setUsername('');
            setEmail('');
            setPhone('');
            setBirthday('');
          }}
        />
        <SettingEditableInfos
          fieldname={'birthday'}
          fieldLabel={'Data de Nascimento'}
          value={birthday}
          user={user?.birthday}
          fieldIcon={FaBaby}
          setEditModal={setEditModal}
          resetFields={() => {
            setUsername('');
            setEmail('');
            setPhone('');
            setBirthday('');
          }}
        />
      </div>
      {showEditModal && (
        <div className='modal-overlay'></div>
      )}
      {showEditModal === 'name' ? (
        <EditModal
          handleSubmit={handleSubmit}
          showEditModal={showEditModal}
          setEditModal={setEditModal}
          setSetterValue={setUsername}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ) : showEditModal === 'email' ? (
        <EditModal
          handleSubmit={handleSubmit}
          showEditModal={showEditModal}
          setEditModal={setEditModal}
          setSetterValue={setEmail}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ) : showEditModal === 'phone' ? (
        <EditModal
          handleSubmit={handleSubmit}
          showEditModal={showEditModal}
          setEditModal={setEditModal}
          setSetterValue={setPhone}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ) : showEditModal === 'birthday' ? (
        <EditModal
          handleSubmit={handleSubmit}
          showEditModal={showEditModal}
          setEditModal={setEditModal}
          setSetterValue={setBirthday}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ) : (
        <></>
    )}
    </div>
  )
}

export default AccountTab