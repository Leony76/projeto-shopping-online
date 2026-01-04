import { 
  type Field, 
  type FieldType, 
  type FieldKey, 
  fieldMap 
} from "../types/SettingsUpdateField";
import type { User } from "../types/User";

import { IoMdMail } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { LuLandPlot } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { BsFillHousesFill } from "react-icons/bs";
import { HiIdentification } from "react-icons/hi";
import { useToast } from "../context/ToastContext";
import { GiHouse, GiIceland } from "react-icons/gi";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoLocationSharp, IoSettingsSharp } from "react-icons/io5";
import { FaCity, FaRoad, FaUser, FaWarehouse } from "react-icons/fa6";
import { FaBirthdayCake, FaPhoneAlt, FaSearchLocation } from "react-icons/fa";
import { MdMailLock, MdOutlinePhoneLocked, MdSecurity } from "react-icons/md";

import EditableSettingsField from "../components/ui/EditableSettingsField";
import EditSettingsField from "../components/form/EditSettingsField";
import useEditUserData from "../utils/customHooks/useEditUserData";
import PageSectionTitle from "../components/ui/PageSectionTitle";
import PageTitle from "../components/ui/PageTitle";
import AppLayout from "../layout/AppLayout";

const Settings = () => {  

  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [edit, setEdit] = useState<{ field: Field,fieldType: FieldType } | null>(null);
  const [data, setData] = useState<User | null>(null);
  const staticDataRef = useRef<User | null>(null);
  // const [staticData, setStaticData] = useState<User | null>(null);
  
  const [error, setError] = useState<string>('');
  const [flag, setFlag] = useState<{processingState: boolean}>({processingState: false,})
  
  const { EditUserData } = useEditUserData({
    actions: {
      setFlag,
      setError,
      setUser,
      setEdit,
    }
  });

  const handleEditData = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    EditUserData(
      flag.processingState,
      staticDataRef.current,
      fieldKey,
      data,
      edit,
    );
  }

  const normalizeUser = (user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    birthday: user.birthday,
    phone: user.phone,
    password: '',

    recovery_email: user.recovery_email,
    recovery_phone: user.recovery_phone,

    public_place: user.public_place,
    zip_code: user.zip_code,
    complement: user.complement,
    home_number: user.home_number,
    neighborhood: user.neighborhood,
    city: user.city,
    state: user.state,
    country: user.country,

    admin: user.admin,
    wallet: user.wallet,
  });
  
  useEffect(() => {
    if (!user) return;

    const snapshot = normalizeUser(user);

    staticDataRef.current = snapshot; 
    setData(snapshot);                
  }, [user]);

  const fieldKey: FieldKey | undefined = edit ? fieldMap[edit.field] : undefined;

  return (
    <AppLayout pageSelected="settings">
      {({search}) => {
        console.log(search);
        return (
          <>
            <PageTitle style="mb-4 mt-4" title="Configurações" icon={IoSettingsSharp}/>
            <PageSectionTitle title="Dados do usuário" icon={HiIdentification }/>
              <div className="md:hidden block mb-2"></div>
              <div className="flex flex-col gap-1 ml-1">
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Nome',
                    fieldType: 'text',
                    fieldIcon: FaUser,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'E-mail',
                    fieldType: 'email',
                    fieldIcon: IoMdMail,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Telefone',
                    fieldType: 'tel',
                    fieldIcon: FaPhoneAlt,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Data de nascimento',
                    fieldType: 'date',
                    fieldIcon: FaBirthdayCake,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
              </div>
              <div className="md:hidden block mt-2"></div>           
            <PageSectionTitle title="Segurança" icon={MdSecurity}/>
              <div className="md:hidden block mb-2"></div>            
              <div className="flex flex-col gap-1 ml-1">
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Senha',
                    fieldType: 'password',
                    fieldIcon: RiLockPasswordFill ,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'E-mail de recuperação',
                    fieldType: 'email',
                    fieldIcon: MdMailLock,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Telefone de recuperação',
                    fieldType: 'tel',
                    fieldIcon: MdOutlinePhoneLocked ,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
              </div>
              <div className="md:hidden block mt-2"></div>               
            <PageSectionTitle title="Endereços" icon={IoLocationSharp }/>
              <div className="md:hidden block mb-2"></div>               
              <div className="flex flex-col gap-1 ml-1">
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Logradouro',
                    fieldType: 'text',
                    fieldIcon: FaRoad,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Complemento',
                    fieldType: 'text',
                    fieldIcon: FaWarehouse,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Número de residência',
                    fieldType: 'text',
                    fieldIcon: GiHouse,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'CEP',
                    fieldType: 'text',
                    fieldIcon: FaSearchLocation,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Bairro',
                    fieldType: 'text',
                    fieldIcon: BsFillHousesFill,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Cidade',
                    fieldType: 'text',
                    fieldIcon: FaCity,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Estado',
                    fieldType: 'text',
                    fieldIcon: LuLandPlot,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'País',
                    fieldType: 'text',
                    fieldIcon: GiIceland ,
                  }}
                  staticData={staticDataRef.current}
                  action={{setEdit:setEdit}}
                />
                <div className="md:hidden block h-[35vh]"></div>
              </div>
                
              {edit && (
                <EditSettingsField
                  element={{
                    field: edit.field,
                    fieldType: edit.fieldType,
                    error: error,
                    edit: edit,
                    fieldKey: fieldMap[edit.field]
                  }}
                  action={{
                    showToast: showToast,
                    handleEditData: handleEditData,
                    setData: setData,
                    setError: setError,
                    setEdit: setEdit,
                  }}
                  flag={{processingState: flag.processingState}}
                  data={data}
                  staticDataRef={staticDataRef}
                />
            )}   
          </>
        );
      }}
    </AppLayout>
  )
}

export default Settings