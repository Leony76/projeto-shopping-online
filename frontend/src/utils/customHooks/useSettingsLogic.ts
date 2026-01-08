import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { Field, FieldType } from "../../types/SettingsUpdateField";
import type { User } from "../../types/User";
import { settingsFieldMap } from "../misc/SettingsFieldMap";
import useEditUserData from "./useEditUserData";

const useSettingsLogic = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const { SETTINGS_SECTIONS } = settingsFieldMap();

  const [edit, setEdit] = useState<{ field: Field,fieldType: FieldType } | null>(null);
  const [data, setData] = useState<User | null>(null);
  const staticDataRef = useRef<User | null>(null);
  
  const [error, setError] = useState<string>('');
  const [flag, setFlag] = useState<{processingState: boolean}>({processingState: false,})
  
  const { EditUserData } = useEditUserData({
    data,
    edit,
    flag,
    staticData: staticDataRef,
    actions: {
      setFlag,
      setError,
      setUser,
      setEdit,
    }
  });

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

  return {
    user,
    edit,
    data,
    flag,
    error,
    staticDataRef,
    SETTINGS_SECTIONS,
    EditUserData,
    showToast,
    setError,
    setEdit,
    setData,
    setFlag,
  }
}

export default useSettingsLogic