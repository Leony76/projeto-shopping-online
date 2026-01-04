import type { IconType } from "react-icons";
import  { type Field, type FieldType, fieldMap } from "../../types/SettingsUpdateField";
import { MdEditSquare } from "react-icons/md";
import type { User } from "../../types/User";
import { date } from "../../utils/formatation/date";
import { maskCEP } from "../../utils/mask/maskCEP";
import { maskPhone } from "../../utils/mask/maskPhone";

type EditableSettingsField = {
  element: {
    fieldLabel: Field;
    fieldType: FieldType;
    fieldIcon: IconType;
  };

  staticData: User | null;

  action: {
    setEdit: React.Dispatch<
      React.SetStateAction<{
        field: Field;
        fieldType: FieldType;
      } | null>
    >;
  };
};


const EditableSettingsField = ({
  element,
  action,
  staticData,
}:EditableSettingsField) => {

  const FieldIcon = element.fieldIcon;
  const fieldKey = fieldMap[element.fieldLabel];

  return (
    <div className="flex items-center gap-2 md:text-base text-[17px]">
      <p className="flex font-semibold items-center gap-1 text-orange-800"><FieldIcon/>{element.fieldLabel}: <span className="text-gray-400 font-normal">{
        element.fieldType === 'password' ?
         '**********' 
        : !staticData?.[fieldKey] ? 
          'Não Definido' 
        : element.fieldType === 'tel' ? 
          maskPhone(staticData?.[fieldKey]) 
        : element.fieldLabel === 'CEP' ? 
          maskCEP(staticData?.[fieldKey]) 
        : element.fieldType === 'date' ? 
          date(staticData?.[fieldKey]) 
        : staticData?.[fieldKey]
      }</span></p>
      <span className="text-cyan-600">●</span>
      <button onClick={() => action.setEdit({field: element.fieldLabel, fieldType: element.fieldType})} className="flex text-yellow-600 hover:text-yellow-400 hover:cursor-pointer hover:underline items-center gap-1"><MdEditSquare/>{
        element.fieldLabel === 'Senha' ? 
          'Alterar' 
        : !staticData?.[fieldKey] ? 
          'Definir' 
        : 
          'Editar'
      }</button>  
    </div>
  )
}

export default EditableSettingsField