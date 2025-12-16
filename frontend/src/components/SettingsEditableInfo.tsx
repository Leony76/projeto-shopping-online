import type { IconType } from "react-icons"
import { MdEditSquare } from '../assets/icons';

type FieldLabels = 
|  'name'           
|  'email'          
|  'phone'          
|  'birthday'       
|  'password'       
|  'recovery_email' 
|  'recovery_phone'
|  'public_place'
|  'zip_code'
|  'residence_number'
|  'complement'
|  'neighborhood'
|  'city'
|  'state'
|  'country'
;

type SettingsEditableInfoPropsType = {
  labelIcon: IconType;
  onClick: () => void;
  label: FieldLabels;
  upperTranslatedLabel: string
  userAttribute: string | undefined;
}

const SettingsEditableInfo = ({
  labelIcon: LabelIcon,
  label,
  userAttribute,
  upperTranslatedLabel,
  onClick,
}:SettingsEditableInfoPropsType) => {
  return (
    <div className="">
      <div className={`${label} info`}>
        <span title={upperTranslatedLabel}><LabelIcon/>{upperTranslatedLabel}:</span><p title={upperTranslatedLabel}>{userAttribute != null ? userAttribute : 'Não Definido'}</p>
        <span className='dot'>•</span>
        <button onClick={onClick} title='Editar'><MdEditSquare/></button>
      </div>
    </div>
  )
}

export default SettingsEditableInfo