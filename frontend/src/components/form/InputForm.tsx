import type { IconType } from "react-icons";
import Button from "../ui/ProceedActionButton";
import { BiImage } from "react-icons/bi";
import { useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import '../../css/scrollbar.css';
import { FaFilter } from "react-icons/fa6";

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
  | 'search'
  | 'advancedFilter'
  ;
  fieldName?: string;
  placeholderValue?: string;
  fieldIcon?: IconType;

  value?: string | number;
  style?: string;
  inputStyle?: string;
  min?: number;
  max?: number; 
  maxLength?: number;

  forSearchInput?: boolean;
  password?: {
    newPassword?: boolean;
    currentPassword?: boolean;
  }
  userProducts?: boolean;

  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSelect?: React.ChangeEventHandler<HTMLSelectElement>;
  onTextArea?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
}

const InputForm = ({
  fieldType,
  fieldName,
  inputStyle,
  value,
  forSearchInput,
  placeholderValue,
  userProducts,
  style,
  maxLength,
  password,
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
          <select value={value} className={`cursor-pointer font-medium border-1 py-[5px] pl-1 font-normal text-xs ${mainInputStyle} ${inputStyle}`} onChange={onSelect} name="category" id="category">
            <option disabled value="">{forSearchInput ? '-- Categoria --' : '-- Selecione --'}</option>
            <option value="Artesanal">Artesanal</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Cozinha">Cozinha</option>
            <option value="Eletrônico">Eletrônico</option>
            <option value="Móveis">Móveis</option>
          </select>
        </div>
      ) : fieldType === "textArea" ? (
        <div className="flex flex-col gap-[2px] font-semibold">
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor={'textArea'}>{Icon && <Icon/>}{fieldName ? `${fieldName}:` : ''}</label>
          <textarea
            className={`custom-scroll text-sm font-normal h-20 border-1 p-1 pl-2 ${mainInputStyle} ${inputStyle}`}
            onChange={onTextArea}
            value={value}
            placeholder={placeholderValue}
            name="textArea"
            id="textArea"
            maxLength={maxLength}
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
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor={'tel'}>{Icon && <Icon/>}{fieldName}:</label>
          <input
            className={`border-1 p-1 font-normal text-sm pl-2 ${mainInputStyle} ${inputStyle}`}
            type={'tel'}
            placeholder={placeholderValue}
            onChange={onChange}
            value={value}
            maxLength={15}
            name="tel"
            id="tel"
          />
        </div>
      ) : fieldType === 'password' ? (
        <div className={`flex flex-col gap-[2px] font-semibold ${style}`}>
          <label className="flex items-center gap-[2px] text-orange-800" htmlFor={'password'}>{Icon && <Icon/>}{fieldName}:</label>
          <div className={`flex items-center border-1 font-normal text-sm  ${mainInputStyle} ${inputStyle}`}>
            <input
              className="p-1 flex-8 focus:outline-none"
              type={showPassword ? 'text' : 'password'}
              onChange={onChange}
              placeholder={placeholderValue}
              value={value}
              autoComplete={password?.currentPassword ? 'current-password' : password?.newPassword ? 'new-password' : 'on'}
              name="password"
              id="password"
            />
            <BsEyeFill onClick={() => setShowPassword(!showPassword)} size={20} className={`flex-1 bg-transparent text-[#D08700] hover:brightness-[1.2] cursor-pointer ${showPassword ? 'brightness-[1.2]' : ''}`}/>
          </div>
        </div>
      ) : fieldType === 'search' ? (
        <div className={`flex flex-col gap-[2px] font-semibold ${style}`}>
          <input
            className={`border-1 p-1 font-normal text-sm pl-2 ${mainInputStyle} ${inputStyle}`}
            type={'text'}
            onChange={onChange}
            value={value}
            placeholder={placeholderValue}
          />
        </div>
      ) : fieldType === 'advancedFilter' ? (
        userProducts ? (
          <div className="flex border-y-4 border-double rounded-none !border-cyan-400 md:w-fit w-full items-center justify-center px-2 font-semibold">
            <label className="flex items-center gap-1 text-orange-800" htmlFor="category"><FaFilter/></label>
            <select value={value} onChange={onSelect} className={`cursor-pointer text-center w-full py-[5px] pl-1 text-orange-700 focus:outline-none font-normal text-sm ${inputStyle}`} name="category" id="category">
              <option value="">-- Filtro avançado --</option>
              <option className="text-gray-500" value="Nenhum">Nenhum</option>
              <option value="Mais comprados">Mais comprados</option>
              <option value="Menos comprados">Menos comprados</option>
              <option value="Maiores gastos">Maiores gastos</option>
              <option value="Menores gastos">Menores gastos</option>
              <option value="Favoritos">Favoritos</option>
              <option value="Menos Favoritos">Menos Favoritos</option>
              <option value="Avaliados">Avaliados</option>
              <option value="Não avaliados">Não avaliados</option>
            </select>
          </div>
        ) : (
          <div className="flex border-y-4 border-double rounded-none !border-cyan-400 md:w-fit w-full items-center justify-center px-2 font-semibold">
            <label className="flex items-center gap-1 text-orange-800" htmlFor="category"><FaFilter/></label>
            <select value={value} onChange={onSelect} className={`cursor-pointer text-center w-full py-[5px] pl-1 text-orange-700 focus:outline-none font-normal text-sm ${inputStyle}`} name="category" id="category">
              <option value="">-- Filtro avançado --</option>
              <option className="text-gray-500" value="Nenhum">Nenhum</option>
              <option value="Maiores preços">Maiores preço</option>
              <option value="Menores preços">Menores preço</option>
              <option value="Mais vendidos">Mais vendas</option>
              <option value="Mais bem avaliados">Mais bem avaliados</option>
            </select>
          </div>
        )
      ) : (
        <div className={`flex flex-col gap-[2px] font-semibold ${style}`}>
          <label className="flex items-center gap-[3px] text-orange-800" htmlFor={fieldType}>{Icon && <Icon/>}{fieldName}:</label>
          <input
            className={`border-1 p-1 font-normal text-sm pl-2 ${mainInputStyle} ${inputStyle}`}
            type={fieldType}
            onChange={onChange}
            value={value}
            placeholder={placeholderValue}
            step={'any'}
            min={min}
            max={max}
            name={fieldType}
            id={fieldType}
          />
        </div>
      )}
    </>
  )
}

export default InputForm;