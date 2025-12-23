import LRC from '../assets/LericoriaFire.png';
import { Link } from 'react-router-dom';
import { TiShoppingCart, TiThMenuOutline } from "react-icons/ti";
import { useAuth } from '../context/AuthContext';
import { FaWallet } from "react-icons/fa";
import { BRLmoney } from '../utils/formatation/BRLmoney';
import { useCloseMenuOnUnfocus } from '../utils/ui/useCloseMenuOnUnfocus';
import { BiLogOut } from 'react-icons/bi';
import { SlSettings } from 'react-icons/sl';
import { IoSettingsSharp } from 'react-icons/io5';
import { CiShoppingCart } from 'react-icons/ci';
import { useState } from 'react';
import ProductCartModal from '../components/system/ProductCartModal';

const AppLayout = ({children, pageSelected}:{
  children: React.ReactNode,
  pageSelected: 'home' | 'products' | 'myProducts' | 'addProduct' | 'settings';
}) => {

  const { logout, user } = useAuth();
  const { menuRef, showMenu, setShowMenu } = useCloseMenuOnUnfocus();

  const [showCart, setShowCart] = useState<boolean>(false);

  return (
    <div className='flex flex-col min-h-screen bg-orange-900'>

      {showMenu && (
        <div ref={menuRef}>
          <div className='flex flex-col justify-center items-center fixed right-3 top-18 border-y-4 border-double border-orange-500 bg-white'>
            {!user?.admin && (<div className='flex bg-gray-100 p-1 items-center gap-1 text-sm text-green-800 font-semibold'><FaWallet/>R$ {BRLmoney(Number(user?.wallet))}</div>)}
            <button onClick={logout} className='flex items-center gap-1 justify-center w-full  hover:bg-yellow-100 text-cyan-800 mx-1 font-semibold cursor-pointer rounded my-1 px-4'><BiLogOut/>Sair</button>
            <Link to={'/settings'} className={`flex items-center gap-1 justify-center w-full text-sm hover:bg-yellow-100 text-cyan-800 mx-1 font-semibold cursor-pointer rounded my-1 px-4 py-1 ${pageSelected === 'settings' ? 'bg-yellow-100' : ''}`}><IoSettingsSharp/>Configurações</Link>
          </div>
        </div>
      )}

      {showCart && (
        <ProductCartModal/>
      )}

      <header>
        <nav className='flex justify-between items-center border-y-4 border-orange-500 border-double h-[60px] bg-cyan-900 px-5'>
          <ul>
            <li className='flex items-center gap-2 text-orange-300 font-semibold italic'><img className='h-10' src={LRC} alt={'LRC'}/> Lehinshoppin'</li>
          </ul>
          <ul className='flex gap-5 items-center'>
            <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'home' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/home'}>Home</Link></li>
            <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'products' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/products'}>Produtos</Link></li>
            {user?.admin ? (
              <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'addProduct' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/add-products'}>Adicionar produtos</Link></li>
            ) : (
              <>
                <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'myProducts' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/my-products'}>Meus Produtos</Link></li>
                <li><button onClick={() => setShowCart(!showCart)} className={`font-semibold mt-2 cursor-pointer hover:text-yellow-400 ${showCart ? 'text-yellow-400' : 'text-yellow-600'}`}><TiShoppingCart size={30}/></button></li>
              </>
            )}
            <li className='flex'><button onClick={() => setShowMenu(prev => !prev)}><TiThMenuOutline size={30} className={`hover:text-yellow-400 cursor-pointer transition-colors ${showMenu ? 'text-yellow-400' : 'text-orange-500'}`}/></button></li>          
          </ul>
        </nav>
      </header>
      <main className='flex-1 p-3 mx-auto w-full bg-white max-w-[1080px] border-x-3 border-cyan-200'>
        {children}
      </main>
      <footer className='flex justify-center border-y-6 border-orange-500 border-double bg-gray-400 py-3'>
        <p className='text-cyan-800 font-semibold text-shadow-sm'>&copy; Leony Leandro Barros, Todos os Direitos Reservados.</p>
      </footer>
    </div>
  )
}

export default AppLayout