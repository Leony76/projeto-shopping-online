import type { User } from "../types/User";

import { Link } from "react-router-dom"
import { useEffect, useState, type ReactNode } from "react"

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { UserContext } from "../context/UserContext";
import { convertPrice } from "../utils/convertPrice";

import { IoMenu } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { BiWallet } from "react-icons/bi";

import './AppLayout.css';

type PageProps = {
  children: ReactNode;
}

const AppLayout = ({children}:PageProps) => {

  const { is_admin, logout } = useAuth();

  const log_out = logout;

  const [burguerModalVisible, setBurguerModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const loadUserData = async() => {
    const response = await api.get('/user');
    setUser(response.data);
  }

  useEffect(() => {
    loadUserData();
  },[]);

  return (
    <div className="main-container">
      {burguerModalVisible && (
        <div className="menu-modal">
          {!user?.admin && (
            <div className="wallet-display"><BiWallet size={20}/> R$ {user ? convertPrice(user?.wallet) : '??'}</div>
          )}
          <button>Configurações</button>
          <button>Perfil</button>
          <button onClick={log_out}>Logout</button>
        </div>
      )}
      <UserContext.Provider value={{user, setUser}}>
        <header>
          <nav>
            <Link to={'/dashboard'} className="site-icon">
              <FaCartShopping/>
              Shopping Site
            </Link>
            <ul>
              <li><Link className="link" to={'/dashboard'}>Home</Link></li>
              <li><Link className="link" to={'/products'}>Produtos</Link></li>
              {!is_admin && (
                <li><Link className="link" to={'/my-products'}>Meus Produtos</Link></li>
              )}
              {is_admin && (
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
          <p>&copy; Leony Leandro Barros</p>
        </footer>
      </UserContext.Provider>
    </div>
  )
}

export default AppLayout