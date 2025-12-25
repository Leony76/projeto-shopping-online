import { FaCity, FaRoad, FaUser, FaWarehouse } from "react-icons/fa6";
import type { User } from "../types/User";
import { useEffect, useState } from "react";
import { api, getCsrf } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { IoLocationSharp, IoSettingsSharp } from "react-icons/io5";
import { HiIdentification } from "react-icons/hi";
import { useToast } from "../context/ToastContext";
import { type Field, type FieldType, type FieldKey, fieldMap } from "../types/SettingsUpdateField";

import EditSettingsField from "../components/form/EditSettingsField";
import PageSectionTitle from "../components/ui/PageSectionTitle";
import PageTitle from "../components/ui/PageTitle";
import AppLayout from "../layout/AppLayout";
import EditableSettingsField from "../components/ui/EditableSettingsField";
import { IoMdMail } from "react-icons/io";
import { FaBirthdayCake, FaPhoneAlt, FaSearchLocation } from "react-icons/fa";
import { MdMailLock, MdOutlinePhoneLocked, MdSecurity } from "react-icons/md";
import { BsFillHousesFill } from "react-icons/bs";
import { GiHouse, GiIceland } from "react-icons/gi";
import { LuLandPlot } from "react-icons/lu";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import { isDateFromFuture } from "../utils/validations/isDataFromFuture";
import { date } from "../utils/formatation/date";

type Flag = {
  processingState: boolean;
}

const Settings = () => {  

  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [edit, setEdit] = useState<{field: Field, fieldType: FieldType } | null>(null);
  const [data, setData] = useState<User | null>(null);
  const [staticData, setStaticData] = useState<User | null>(null);
  
  const [error, setError] = useState<string>('');
  const [flag, setFlag] = useState<Flag>({
    processingState: false,
  })
  
  const handleEditData = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (flag.processingState) return;
    setFlag(prev => ({...prev, processingState: true}));

    if (!data || !staticData || !fieldKey) {
      setFlag(prev => ({ ...prev, processingState: false }));
      return;
    }

    if (data[fieldKey] == staticData[fieldKey]) {
      setError(`O ${edit?.field} não pode ser o mesmo`);
      setFlag(prev => ({...prev, processingState: false}));
      return;
    }

    if (!data[fieldKey]) {
      setError(`${edit?.field === 'Senha' ? 'A' : 'O'} ${edit?.field} não pode ser ${edit?.field === 'Senha' ? 'vazia' : 'vazio'}`);
      setFlag(prev => ({...prev, processingState: false}));
      return;
    }

    if (data.email && data.recovery_email && data.email === data.recovery_email) {
      setError('O e-mail principal e o de recuperação não podem ser iguais');
      setFlag(prev => ({ ...prev, processingState: false }));
      return;
    }

    if (data.phone && data.recovery_phone && data.phone === data.recovery_phone) {
      setError('O telefone principal e o de recuperação não podem ser iguais');
      setFlag(prev => ({ ...prev, processingState: false }));
      return;
    }

    if (isDateFromFuture(data['birthday'])) {
      const today = new Date();

      setError(`A data de nascimento não pode após ${date(today)}`);
      setFlag(prev => ({...prev, processingState: false}));
      return;
    }

    try {
      await getCsrf();
      const response = await api.patch(`/user/update-data`, {
        [fieldKey]: data[fieldKey],
      });

      const newData = response.data.updated_data[fieldKey];

      setUser(prev => prev ? ({...prev, [fieldKey]: newData}) : prev);

      showToast(response.data.message, response.data.type);
      setEdit(null);
    } catch (err:any) { 
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response?.data?.message);
      }
    } finally {
      setFlag(prev => ({...prev, processingState: false}));      
    }
  }

  useEffect(() => {
    if (user) {
      setData({
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
      })

      setStaticData({
         id: user.id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
        phone: user.phone,

        recovery_email: user.recovery_email,
        recovery_phone: user.recovery_phone,

        public_place: user.public_place,
        zip_code: user.zip_code,
        home_number: user.home_number,
        complement: user.complement,
        neighborhood: user.neighborhood,
        city: user.city,
        state: user.state,
        country: user.country,

        admin: user.admin,
        wallet: user.wallet,
      })
    }
  },[user, edit]);

  const fieldKey: FieldKey | undefined = edit ? fieldMap[edit.field] : undefined;

  return (
    <AppLayout pageSelected="settings">
      {({search}) => {
        console.log(search);
        return (
          <>
            <PageTitle title="Configurações" icon={IoSettingsSharp}/>
            <PageSectionTitle title="Dados do usuário" icon={HiIdentification }/>
              <div className="flex flex-col gap-1 ml-1">
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Nome',
                    fieldType: 'text',
                    fieldIcon: FaUser,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'E-mail',
                    fieldType: 'email',
                    fieldIcon: IoMdMail,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Telefone',
                    fieldType: 'tel',
                    fieldIcon: FaPhoneAlt,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Data de nascimento',
                    fieldType: 'date',
                    fieldIcon: FaBirthdayCake,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
              </div>
            <PageSectionTitle title="Segurança" icon={MdSecurity}/>
              <div className="flex flex-col gap-1 ml-1">
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Senha',
                    fieldType: 'password',
                    fieldIcon: RiLockPasswordFill ,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'E-mail de recuperação',
                    fieldType: 'email',
                    fieldIcon: MdMailLock,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Telefone de recuperação',
                    fieldType: 'tel',
                    fieldIcon: MdOutlinePhoneLocked ,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
              </div>
            <PageSectionTitle title="Endereços" icon={IoLocationSharp }/>
              <div className="flex flex-col gap-1 ml-1">
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Logradouro',
                    fieldType: 'text',
                    fieldIcon: FaRoad,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Complemento',
                    fieldType: 'text',
                    fieldIcon: FaWarehouse,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Número de residência',
                    fieldType: 'text',
                    fieldIcon: GiHouse,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'CEP',
                    fieldType: 'text',
                    fieldIcon: FaSearchLocation,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Bairro',
                    fieldType: 'text',
                    fieldIcon: BsFillHousesFill,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Cidade',
                    fieldType: 'text',
                    fieldIcon: FaCity,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'Estado',
                    fieldType: 'text',
                    fieldIcon: LuLandPlot,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
                <EditableSettingsField
                  element={{
                    fieldLabel: 'País',
                    fieldType: 'text',
                    fieldIcon: GiIceland ,
                  }}
                  staticData={staticData}
                  action={{setEdit:setEdit}}
                />
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
                  staticData={staticData}
                />
            )}   
          </>
        );
      }}
    </AppLayout>
  )
}

export default Settings