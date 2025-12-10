import AppLayout from "../layout/AppLayout";
import Title from "../components/Title";
import { 
  IoSettingsSharp,
} from '../assets/icons';

import './Settings.css';

const Settings = () => {
  return (
    <AppLayout>
      <Title title="Configurações" icon={<IoSettingsSharp/>}/>
      <nav className="settings-nav">
        <ul>
          <li><button>Perfil/Conta</button></li>
          <li><button>Segurança</button></li>
          <li><button>Endereços</button></li>
        </ul>
      </nav> 
    </AppLayout>
  )
}

export default Settings;