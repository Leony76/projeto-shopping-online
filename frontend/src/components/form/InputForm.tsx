import type { IconType } from "react-icons";
import Button from "../ui/ProceedActionButton";
import { BiImage } from "react-icons/bi";
import { useState } from "react";
import { BsEyeFill } from "react-icons/bs";

type InputForm = {
  fieldType: 
  | 'text' 
  | 'date' 
  | 'number' 
  | 'email' 
  | 'password'
  | 'select'
  | 'textArea'
  | 'imageSelect'
  | 'tel'
  ;
  fieldName: string;
  fieldIcon?: IconType;

  value?: string | number;
  style?: string;
  inputStyle?: string;
  min?: number;
  max?: number; 

  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSelect?: React.ChangeEventHandler<HTMLSelectElement>;
  onTextArea?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const InputForm = ({
  fieldType,
  fieldName,
  inputStyle,
  value,
  style,
  fieldIcon: Icon,
  min,
  max,
  onChange,
  onSelect,
  onTextArea,
}:InputForm) => {

  const mainInputStyle = "bg-white text-cyan-800 focus:outline-none focus:bg-orange-100 rounded border-cyan-600 border-x-4 border-double";

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      {fieldType === "select" ? (
        <div className="flex flex-col gap-[2px] font-semibold">
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor="category">{Icon && <Icon/>}{fieldName}</label>
          <select value={value} className={`cursor-pointer border-1 py-[5px] pl-1 font-normal text-sm ${mainInputStyle} ${inputStyle}`} onChange={onSelect} name="category" id="category">
            <option selected disabled>--Selecione--</option>
            <option value="Artesanal">Artesanal</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Cozinha">Cozinha</option>
          </select>
        </div>
      ) : fieldType === "textArea" ? (
        <div className="flex flex-col gap-[2px] font-semibold">
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor={fieldType}>{Icon && <Icon/>}{fieldName}:</label>
          <textarea
            className={`text-sm font-normal h-20 border-1 p-1 pl-2 ${mainInputStyle} ${inputStyle}`}
            onChange={onTextArea}
            value={value}
          />
        </div>
      ) : fieldType === "imageSelect" ? (
        <div className={`flex flex-col gap-[2px] font-semibold ${style}`}>
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor={fieldType}>{Icon && <Icon/>}{fieldName}:</label>
          <Button 
            iconButton={BiImage} 
            styles="!bg-cyan-200 !border-cyan-500 !text-cyan-600"
            iconButtonSize={20} 
            buttonLabel={"Selecionar"}
            actionType="button"
            onClick={() => window.document.getElementById('imageInput')?.click()}
          />
          <input
            id="imageInput"
            hidden
            className="border-1 p-1 font-normal text-sm"
            type="file"
            accept="image/*"
            onChange={onChange}
          />
        </div>
      ) : fieldType === 'tel' ? (
        <div className={`flex flex-col gap-[2px] font-semibold ${style}`}>
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor={fieldType}>{Icon && <Icon/>}{fieldName}:</label>
          <input
            className={`border-1 p-1 font-normal text-sm pl-2 ${mainInputStyle} ${inputStyle}`}
            type={'tel'}
            onChange={onChange}
            value={value}
            maxLength={15}
          />
        </div>
      ) : fieldType === 'password' ? (
        <div className={`flex flex-col gap-[2px] font-semibold ${style}`}>
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor={fieldType}>{Icon && <Icon/>}{fieldName}:</label>
          <div className={`flex items-center border-1 font-normal text-sm  ${mainInputStyle} ${inputStyle}`}>
            <input
              className="p-1 flex-8 focus:outline-none"
              type={showPassword ? 'text' : 'password'}
              onChange={onChange}
              value={value}
            />
            <BsEyeFill onClick={() => setShowPassword(!showPassword)} size={20} className={`flex-1 text-[#D08700] hover:brightness-[1.2] cursor-pointer ${showPassword ? 'brightness-[1.2]' : ''}`}/>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col gap-[2px] font-semibold ${style}`}>
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor={fieldType}>{Icon && <Icon/>}{fieldName}:</label>
          <input
            className={`border-1 p-1 font-normal text-sm pl-2 ${mainInputStyle} ${inputStyle}`}
            type={fieldType}
            onChange={onChange}
            value={value}
            step={'any'}
            min={min}
            max={max}
          />
        </div>
      )}
    </>
  )
}

export default InputForm;