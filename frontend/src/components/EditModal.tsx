import type React from "react"
import { 
  MdEditSquare,
  ImCross,
  RiErrorWarningLine,
 } from '../assets/icons';

type EditModalPropsType = {
  showEditModal: 'name' | 'email' | 'phone' | 'birthday' | null;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSetterValue: React.Dispatch<React.SetStateAction<string>> | React.Dispatch<React.SetStateAction<string | undefined>> | null;
  setEditModal: React.Dispatch<React.SetStateAction<'name' | 'email' | 'phone' | 'birthday' | null>>;
  handleSubmit: (e:React.FormEvent) => void;
}

const EditModal = ({
  showEditModal,
  errorMessage,
  setErrorMessage,
  setSetterValue,
  setEditModal,
  handleSubmit,
}:EditModalPropsType) => {
  const name =
    showEditModal === 'name'     ? "Nome" :
    showEditModal === 'email'    ? "Email" :
    showEditModal === 'phone'    ? "Telefone" :
    showEditModal === 'birthday' ? "Data de nascimento" : ''
  ;

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 2) {
      return `(${digits}`;
    } if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  return (
    <div className='setting-edit-modal'>
      <h3>Alterar {name === 'Email' ? 'E-mail' : name}</h3>
      <div className='label-input'>
        <label>Insira {name === 'Data de nascimento' ? 'uma nova' : 'um novo'} {name === 'Email' ? 'e-mail' : name.toLowerCase()}:</label>
        <input placeholder={name} onChange={(e) => 
          setSetterValue ? (
            showEditModal === 'phone' ? 
              setSetterValue(formatPhone(e.target.value)) :
              setSetterValue(e.target.value)
          ) : console.error("Erro Inesperado!")
        } type={
          showEditModal === 'name' ? 'text'   :
          showEditModal === 'email' ? 'email' :
          showEditModal === 'phone' ? 'tel'   : 'date'
        } maxLength={showEditModal === 'phone' ? 15 : 50}/>
        {errorMessage && <p className="modal-error-message"><RiErrorWarningLine size={20}/>{errorMessage}</p>}
      </div>
      <form onSubmit={handleSubmit} className='buttons'>
        <button type='submit'><MdEditSquare size={20}/>Alterar</button>
        <button onClick={() => {
          setEditModal(null);
          setErrorMessage(null);
          setSetterValue ? setSetterValue('') : console.error('Fatal error: setSetterValue is undefined.');
        }} type='button'><ImCross size={15}/>Cancelar</button>
      </form>
    </div>
  )
}

export default EditModal