import LRC from '../assets/LericoriaFire.png';
import { Link } from 'react-router-dom';
import { TiShoppingCart, TiThMenuOutline } from "react-icons/ti";
import { useAuth } from '../context/AuthContext';
import React, { useEffect, useRef, useState } from 'react';
import ProductCartModal from '../components/system/ProductCartModal';
import type { ProductAPI } from '../types/ProductAPI';
import Menu from '../components/system/Menu';
import CardFocusOverlay from '../components/ui/CardFocusOverlay';
import { useProducts } from '../context/ProductContext';
import MainSearchTopBar from '../components/form/MainSearchTopBar';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';

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

  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [showCart, setShowCart] = useState<boolean>(false);

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<"Artesanal" | "Cozinha" | "Limpeza" | "Eletrônico" | "Móveis" | "">('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  useEffect(() => {
    setShowCart(false);
  },[products]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setShowSearch(false);
      }
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  useEffect(() => {
    if (showSearch) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [showSearch]);

  return (
    <div className='flex flex-col min-h-[100dvh] bg-orange-900'>
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
          <ProductCartModal setShowCart={setShowCart}/>
        </>
      )}

      <header className='fixed z-30 w-full'>
        <nav className='flex px-5 justify-between items-center border-y-5 border-orange-500 border-double h-[60px] bg-cyan-900'>
          <ul>
            <li className={`flex items-center text-base gap-2 text-orange-300 font-semibold italic`}><img className={`h-10 sm:hidden block ${showSearch && 'hidden'}`} src={LRC} alt={'LRC'}/><img className={`h-10 sm:block hidden`} src={LRC} alt={'LRC'}/> {!showSearch ? 'Lehinshoppin\'' : ''}</li>
          </ul>
          <ul className='flex gap-2 ml-[-10px] sm:mr-[-50px] '>
            <li onClick={() => setShowSearch(false)} className={`flex items-center text-base gap-2 text-yellow-600 hover:text-yellow-400 cursor-pointer font-semibold italic ${showSearch ? 'block' : 'hidden'}`}><FaArrowLeft size={25}/></li>
            {(pageSelected === 'products' || pageSelected === 'myProducts') && (            
              <li className={`h-8 hidden flex md:flex`}>
                <MainSearchTopBar value={{filter, search}} actions={{setSearch, setFilter}}/> 
              </li>          
            )}
            {showSearch && (
              <MainSearchTopBar ref={searchInputRef} value={{filter, search}} actions={{setSearch, setFilter}}/> 
            )}
          </ul>
          <ul className='flex gap-4 items-center'>
            {(pageSelected === 'products' || pageSelected === 'myProducts') && ( 
              <li><FaSearch onClick={() => setShowSearch(true)} className={`md:hidden text-yellow-600 hover:text-yellow-400 cursor-pointer mt-[2px] text-[20px] ${showSearch && 'hidden'}`}/></li>
            )}
            <li className='lg:block hidden'><Link className={`font-semibold xl:text-base lg:text-sm hover:text-yellow-400 ${pageSelected === 'home' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/home'}>Home</Link></li>
            <li className='lg:block hidden'><Link className={`font-semibold xl:text-base lg:text-sm hover:text-yellow-400 ${pageSelected === 'products' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/products'}>Produtos</Link></li>
            {user?.admin ? (
              <>
                <li className='lg:block hidden'><Link className={`font-semibold xl:text-base lg:text-sm hover:text-yellow-400 ${pageSelected === 'addProduct' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/add-products'}>Adicionar produtos</Link></li>
                <li className='lg:block hidden'><Link className={`font-semibold xl:text-base lg:text-sm hover:text-yellow-400 ${pageSelected === 'suggestions' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/suggestions'}>Sugestões</Link></li>
              </>
            ) : (
              <>
                <li className='lg:block hidden'><Link className={`font-semibold xl:text-base lg:text-sm hover:text-yellow-400 ${pageSelected === 'myProducts' ? 'text-yellow-400' : 'text-yellow-600'}`} to={'/my-products'}>Meus Produtos</Link></li>
                {(!showSearch) && (
                  <li><button onClick={() => {
                    setShowCart(!showCart);
                    setShowMenu(false);
                  }} className={`font-semibold mt-2 cursor-pointer text-[30px] hover:text-yellow-400 ${showCart ? 'text-yellow-400' : 'text-yellow-600'}`}><TiShoppingCart/></button></li>
                )}
              </>
            )}
            {(!showSearch) && (
              <li className='flex'><button onClick={() => {
                setShowMenu(!showMenu);
                setShowCart(false);
              }}><TiThMenuOutline className={`hover:text-yellow-400 text-[30px] cursor-pointer transition-colors ${showMenu ? 'text-yellow-400' : 'text-yellow-600'}`}/></button></li>          
            )}
          </ul>
        </nav>
      </header>
      <main className="flex-1 mt-15 box-border p-3 w-full max-w-[1080px] mx-auto bg-white border-x-3 border-cyan-200">
        {children({search, filter})}
      </main>
      <footer className="w-full flex justify-center border-y-6 border-orange-500 border-double bg-gray-400 py-3">
        <p className='text-cyan-800 text-center font-semibold text-shadow-sm'>&copy; Leony Leandro Barros, <br className='sm:hidden block'/>Todos os Direitos Reservados.</p>
      </footer>
    </div>
  )
}

export default AppLayout