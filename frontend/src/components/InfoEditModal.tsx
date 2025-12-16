import Loading from "./Loading2";
import { ImCross } from '../assets/icons';
import { 
  RiErrorWarningLine,
  MdEditSquare,
  MdVerifiedUser,
 } from '../assets/icons';
import type { EditAction } from "../types/EditAction";

type InputLabel = 
| 'name'
| 'password' 
| 'birthday'
| 'phone' 
| 'email' 
| 'recovery_email' 
| 'recovery_phone'
| 'public_place'
| 'zip_code'
| 'residence_number'
| 'complement'
| 'neighborhood'
| 'city'
| 'state'
| 'country'
;

type InfoEditModalPropsType = {
  label: InputLabel;
  editAction: EditAction;
  upperTranslatedLabel: string;
  errorMessage: string | null;
  processingState: boolean;

  userProperty?: string;
  value?: string;

  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>; 
  onClickProceed: () => void;
  onClickCancel: () => void;
}

const InfoEditModal = ({
  editAction,
  label,
  upperTranslatedLabel,
  errorMessage,
  processingState,
  userProperty,
  value,
  onChange,
  onSubmit,
  onClickProceed,
  onClickCancel
}:InfoEditModalPropsType) => {
  const inputSettings: Record<InputLabel, {
    type: string,
    maxLength: number;
  }> = {
    name: { type: 'text', maxLength: 100 },
    password: { type: 'password', maxLength: 20 },
    phone: { type: 'tel', maxLength: 15 },
    birthday: { type: 'date', maxLength: 10},
    email: { type: 'email', maxLength: 100 },
    recovery_email: {type: 'email', maxLength: 100 },
    recovery_phone: {type: 'tel', maxLength: 15},
    public_place: {type: 'text', maxLength: 100},
    zip_code: {type: 'text', maxLength: 10},
    residence_number: {type: 'text', maxLength: 5},
    complement: {type: 'text', maxLength: 100},
    neighborhood: {type: 'text', maxLength: 100},
    city: {type: 'text', maxLength: 50},
    state: {type: 'text', maxLength: 50},
    country: {type: 'text', maxLength: 100},
  };

  const { type, maxLength } = inputSettings[label] || { type: 'text', maxLength: 100 };

  return (
    <div className='setting-edit-modal'>
      {(userProperty != null) ? (
        editAction === 'verify_password' ? (
          <h3>Verificar {upperTranslatedLabel.toLowerCase()}</h3>
        ) : (
          <h3>Alterar {upperTranslatedLabel.toLowerCase()}</h3>
        )
      ) : (
        editAction === 'verify_password' ? (
          <h3>Verificar {upperTranslatedLabel.toLowerCase()}</h3>
        ) : editAction === 'change_password' ? (
          <h3>Alterar {upperTranslatedLabel.toLowerCase()}</h3>
        ) : (
          <h3>Definir {upperTranslatedLabel.toLowerCase()}</h3>
        )
      )}
      <div className='label-input'>
        {editAction === 'verify_password' ? (
          <label>Insira sua {upperTranslatedLabel.toLowerCase()} atual:</label>
        ) : (
          <label>Insira {editAction === 'change_password' ? 'uma nova' : 'um novo'} {upperTranslatedLabel.toLowerCase()}:</label>
        )}
        {value !== undefined ? (
          <input value={value ? value: ''} onChange={onChange} placeholder={`${upperTranslatedLabel} ${editAction === 'verify_password' ? 'atual' : ''}`} type={type} maxLength={maxLength}/>
        ) : (
          <input onChange={onChange} placeholder={`${upperTranslatedLabel} ${editAction === 'verify_password' ? 'atual' : ''}`} type={type} maxLength={maxLength}/>
        )}
        {errorMessage && <p className="modal-error-message"><RiErrorWarningLine size={20}/>{errorMessage}</p>}
      </div>
      <form onSubmit={onSubmit} className='buttons'>
        {userProperty != null ? (
          editAction === 'verify_password' ? (
            <button onClick={onClickProceed} type='submit'>{processingState ? <Loading/> : <MdVerifiedUser size={20}/>}{processingState ? 'Verificando' : 'Verificar'}</button>
          ) : (
            <button onClick={onClickProceed} type='submit'>{processingState ? <Loading/> : <MdEditSquare size={20}/>}{processingState ? 'Alterando' : 'Alterar'}</button>
          )
        ) : (
            <button onClick={onClickProceed} type='submit'>{processingState ? <Loading/> : <MdEditSquare size={20}/>}{processingState ? 'Definindo' : 'Definir'}</button>
        )}
        {processingState ? (
          <button disabled style={{filter: 'brightness(.8)', cursor: 'not-allowed'}} type='button'><ImCross size={15}/>Cancelar</button>
        ) : (
          <button onClick={onClickCancel} type='button'><ImCross size={15}/>Cancelar</button>
        )}
      </form>
    </div>
  )
}

export default InfoEditModal