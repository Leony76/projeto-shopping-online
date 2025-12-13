import AppLayout from "../layout/AppLayout";
import Title from "../components/Title";
import { useState } from "react";
import { 
  IoSettingsSharp,
  MdAccountCircle,
  MdOutlineSecurity,
  FaSignsPost,
} from '../assets/icons';

import SecurityTab from '../components/SecurityTab';
import AddressTab from "../components/AddressTab";
import AccountTab from "../components/AccountTab";

import './Settings.css';

type SettingsTab = 'account' | 'security' | 'address';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  return (
    <AppLayout>
      <Title title="Configurações" icon={<IoSettingsSharp/>}/>
      <nav className="settings-nav">
        <ul>
          <li><button title='Perfil/Conta' className={`${activeTab === 'account' ? 'account-button' : ''}`} onClick={() => setActiveTab('account')}><MdAccountCircle/>Perfil/Conta</button></li>
          <li className="dot">•</li>
          <li><button title='Segurança' className={`${activeTab === 'security' ? 'security-button' : ''}`} onClick={() => setActiveTab('security')}><MdOutlineSecurity/>Segurança</button></li>
          <li className="dot">•</li>
          <li><button title='Endereço' className={`${activeTab === 'address' ? 'address-button' : ''}`} onClick={() => setActiveTab('address')}><FaSignsPost/>Endereços</button></li>
        </ul>
      </nav>                   

      {activeTab === 'account' ? (
        <AccountTab/>
      ) : activeTab === 'security' ? (
        <SecurityTab/>
      ) : (
        <AddressTab/>
      )}                  
    </AppLayout>
  )
}

export default Settings;