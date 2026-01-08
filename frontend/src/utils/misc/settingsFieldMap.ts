import type { IconType } from "react-icons";
import { BsFillHousesFill } from "react-icons/bs";
import { FaPhoneAlt, FaBirthdayCake, FaSearchLocation } from "react-icons/fa";
import { FaUser, FaRoad, FaWarehouse, FaCity } from "react-icons/fa6";
import { GiHouse, GiIceland } from "react-icons/gi";
import { HiIdentification } from "react-icons/hi";
import { IoMdMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { LuLandPlot } from "react-icons/lu";
import { MdSecurity, MdMailLock, MdOutlinePhoneLocked } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import type { Field, FieldType } from "../../types/SettingsUpdateField";

type SettingsFieldConfig = {
  label: Field;
  type: FieldType;
  icon: IconType;
};


type SettingsSectionConfig = {
  title: string;
  icon: IconType;
  fields: SettingsFieldConfig[];
};

export const settingsFieldMap = () => {
  const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
    {
      title: "Dados do usuário",
      icon: HiIdentification,
      fields: [
        { label: "Nome", type: "text", icon: FaUser },
        { label: "E-mail", type: "email", icon: IoMdMail },
        { label: "Telefone", type: "tel", icon: FaPhoneAlt },
        { label: "Data de nascimento", type: "date", icon: FaBirthdayCake },
      ],
    },
    {
      title: "Segurança",
      icon: MdSecurity,
      fields: [
        { label: "Senha", type: "password", icon: RiLockPasswordFill },
        { label: "E-mail de recuperação", type: "email", icon: MdMailLock },
        { label: "Telefone de recuperação", type: "tel", icon: MdOutlinePhoneLocked },
      ],
    },
    {
      title: "Endereços",
      icon: IoLocationSharp,
      fields: [
        { label: "Logradouro", type: "text", icon: FaRoad },
        { label: "Complemento", type: "text", icon: FaWarehouse },
        { label: "Número de residência", type: "text", icon: GiHouse },
        { label: "CEP", type: "text", icon: FaSearchLocation },
        { label: "Bairro", type: "text", icon: BsFillHousesFill },
        { label: "Cidade", type: "text", icon: FaCity },
        { label: "Estado", type: "text", icon: LuLandPlot },
        { label: "País", type: "text", icon: GiIceland },
      ],
    },
  ];

  return { SETTINGS_SECTIONS }
}

