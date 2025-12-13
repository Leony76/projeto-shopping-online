import { Link } from "react-router-dom"
import { useState, type ReactNode } from "react"
import { convertPrice } from "../utils/convertPrice";
import { useUser } from "../context/UserContext";

import { 
  IoMenu,
  BiWallet,
  FaCartShopping,
} from '../assets/icons';

import './AppLayout.css';

type PageProps = {
  children: ReactNode;
}

const AppLayout = ({children}:PageProps) => {

  const { user, logout } = useUser();

  const log_out = logout;

  const [burguerModalVisible, setBurguerModalVisible] = useState(false);

  return (
    <div className="main-container">
    {burguerModalVisible && (
      <div className="menu-modal">
        {!user?.admin && (
          <div className="wallet-display"><BiWallet size={20}/> R$ {user ? convertPrice(user?.wallet) : '??'}</div>
        )}
        <Link to={'/settings'}>Configurações</Link>
        <button onClick={log_out}>Logout</button>
      </div>
    )}
      <header>
        <nav>
          <Link to={'/dashboard'} className="site-icon">
            <FaCartShopping/>
            Shopping Site
          </Link>
          <ul>
            <li><Link className="link" to={'/dashboard'}>Home</Link></li>
            <li><Link className="link" to={'/products'}>Produtos</Link></li>
            {!user?.admin && (
              <li><Link className="link" to={'/my-products'}>Meus Produtos</Link></li>
            )}
            {user?.admin && (
              <li><Link className="link" to={'/admin/products'}>Adicionar Produtos</Link></li>
            )}
            <button onClick={() => setBurguerModalVisible(prev => !prev)} className="burguer-button">
              <IoMenu size={40} color={'white'}/>
            </button>
          </ul>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>&copy; 2025 Leony Leandro Barros, Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

export default AppLayout