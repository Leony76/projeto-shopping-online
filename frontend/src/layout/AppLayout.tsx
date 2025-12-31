import LRC from '../assets/LericoriaFire.png';
import { Link } from 'react-router-dom';
import { TiShoppingCart, TiThMenuOutline } from "react-icons/ti";
import { useAuth } from '../context/AuthContext';
import React, { useEffect, useState } from 'react';
import ProductCartModal from '../components/system/ProductCartModal';
import type { ProductAPI } from '../types/ProductAPI';
import Menu from '../components/system/Menu';
import CardFocusOverlay from '../components/ui/CardFocusOverlay';
import { useProducts } from '../context/ProductContext';
import MainSearchTopBar from '../components/form/MainSearchTopBar';

type AppLayout = {
  pageSelected: 'home' | 'products' | 'myProducts' | 'addProduct' | 'settings' | 'suggestions';
  children: (props: { 
    search: string;
    filter: ProductAPI['category'];
  }) => React.ReactNode;
} 

const AppLayout = ({children, pageSelected}:AppLayout) => {

  const { logout, user } = useAuth();
  const { products } = useProducts();

  const [showCart, setShowCart] = useState<boolean>(false);

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<"Artesanal" | "Cozinha" | "Limpeza" | "Eletrônico" | "Móveis" | "">('');

  useEffect(() => {
    setShowCart(false);
  },[products])

  return (
    <div className='flex flex-col min-h-screen bg-orange-900'>
      {showMenu && (
        <>
          <CardFocusOverlay
            style='bg-white/0 !z-20'
            onClick={() => {
              setShowMenu(false)
            }}
          />
          <Menu
            logout={logout}
            admin={user?.admin}
            wallet={user?.wallet}
            pageSelected={pageSelected}
          />
        </>
      )}

      {showCart && (
        <>
          <CardFocusOverlay
            style='bg-white/0 !z-20'
            onClick={() => setShowCart(false)}
          />
          <ProductCartModal/>
        </>
      )}

      <header className='fixed z-30 w-full'>
        <nav className='flex justify-between items-center border-y-4 border-orange-500 border-double h-[60px] bg-cyan-900 px-5'>
          <ul>
            <li className='flex items-center gap-2 text-orange-300 font-semibold italic'><img className='h-10' src={LRC} alt={'LRC'}/> Lehinshoppin'</li>
          </ul>
          {(pageSelected === 'products' || pageSelected === 'myProducts') && (
            <ul className={`flex fixed h-8 top-[14px] left-1/2 ${user?.admin ? 'translate-x-[-80%]' : 'translate-x-[-50%]'}`}> 
              <MainSearchTopBar value={{filter, search}} actions={{setSearch, setFilter}}/> 
            </ul>
          )}
          <ul className='flex gap-5 items-center'>
            <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'home' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/home'}>Home</Link></li>
            <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'products' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/products'}>Produtos</Link></li>
            {user?.admin ? (
              <>
                <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'addProduct' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/add-products'}>Adicionar produtos</Link></li>
                <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'suggestions' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/suggestions'}>Sugestões</Link></li>
              </>
            ) : (
              <>
                <li><Link className={`font-semibold hover:text-yellow-400 ${pageSelected === 'myProducts' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/my-products'}>Meus Produtos</Link></li>
                <li><button onClick={() => {
                  setShowCart(!showCart);
                  setShowMenu(false);
                }} className={`font-semibold mt-2 cursor-pointer hover:text-yellow-400 ${showCart ? 'text-yellow-400' : 'text-yellow-600'}`}><TiShoppingCart size={30}/></button></li>
              </>
            )}
            <li className='flex'><button onClick={() => {
              setShowMenu(!showMenu);
              setShowCart(false);
            }}><TiThMenuOutline size={30} className={`hover:text-yellow-400 cursor-pointer transition-colors ${showMenu ? 'text-yellow-400' : 'text-yellow-600'}`}/></button></li>          
          </ul>
        </nav>
      </header>
      <main className='flex-1 mt-15 p-3 mx-auto w-full bg-white max-w-[1080px] border-x-3 border-cyan-200'>
        {children({search, filter})}
      </main>
      <footer className='flex justify-center border-y-6 border-orange-500 border-double bg-gray-400 py-3'>
        <p className='text-cyan-800 font-semibold text-shadow-sm'>&copy; Leony Leandro Barros, Todos os Direitos Reservados.</p>
      </footer>
    </div>
  )
}

export default AppLayout