import type { IconType } from "react-icons";
import { MdEditSquare } from '../assets/icons';
import { isoDateConvert } from '../utils/isoDateConvert';

type SettingEditableInfosPropsType = {
  fieldname: React.SetStateAction<"email" | "name" | "phone" | "birthday" | null>;
  passwordField?: string;
  fieldLabel: string;
  user: string | undefined;
  value: string;
  fieldIcon: IconType;
  setEditModal: React.Dispatch<React.SetStateAction<"email" | "name" | "phone" | "birthday" | null>>;
  resetFields: () => void;
}

const SettingEditableInfos = ({
  fieldname,
  fieldLabel,
  value,
  user,
  fieldIcon: FieldIcon,
  setEditModal,
  resetFields,
}:SettingEditableInfosPropsType) => {
  return (
    <div className={`${fieldname} info`}>
      <span title={fieldLabel}><FieldIcon />{fieldLabel}:</span><p title={value}>{fieldname === 'birthday' ? isoDateConvert(user) : user}</p>
      <span className='dot'>•</span>
      <button onClick={() => {
        setEditModal(fieldname);
        resetFields();
      }} title='Editar'><MdEditSquare/></button>
    </div>
  );
}

export default SettingEditableInfos;