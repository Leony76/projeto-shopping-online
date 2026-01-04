import { Link } from "react-router-dom";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import { IoSettingsSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { FaSailboat, FaWallet } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import PageSectionTitle from "../ui/PageSectionTitle";
import { VscSymbolMisc } from "react-icons/vsc";
import { useState } from "react";
import Loading from "../ui/Loading";

type Menu = {
  admin: boolean | undefined;
  wallet: number | string | undefined;
  logout: () => Promise<void>;
  pageSelected: 'home' | 'products' | 'myProducts' | 'addProduct' | 'settings' | 'suggestions';
}

const Menu = ({admin, logout, pageSelected, wallet}:Menu) => {
  
  const { user } = useAuth();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  
  return (
    <div className='flex flex-col w-full lg:max-w-[150px] sm:max-w-[450px] max-w-[90vw] shadow-md justify-center items-center fixed sm:right-3 right-1/2 sm:translate-x-[0] translate-x-[50%] z-50 top-18 border-y-4 border-double border-orange-500 bg-white'>
      <div className="lg:hidden block flex flex-col w-full justify-center items-center">
        <div className="w-full px-4 my-1">
          <PageSectionTitle position="centered" title="Navegação" icon={FaSailboat}/>
        </div>
        <div className="flex flex-col gap-1 px-1 justify-center items-center w-full text-yellow-600 font-semibold">
          <Link className={`w-full text-center py-1 rounded ${pageSelected === 'home' ? 'bg-cyan-100 text-brightness-[1.1]' : 'hover:bg-cyan-100 hover:brightness-[1.1]'}`} to={'/home'}>Home</Link>
          <Link className={`w-full text-center py-1 rounded ${pageSelected === 'products' ? 'bg-cyan-100 text-brightness-[1.1]' : 'hover:bg-cyan-100 hover:brightness-[1.1]'}`} to={'/products'}>Produtos</Link>
          {!user?.admin ? (
            <Link className={`w-full text-center py-1 rounded ${pageSelected === 'myProducts' ? 'bg-cyan-100 text-brightness-[1.1]' : 'hover:bg-cyan-100 hover:brightness-[1.1]'}`} to={'/my-products'}>Meus produtos</Link>
          ) : (
            <>
              <Link className={`w-full text-center py-1 rounded ${pageSelected === 'addProduct' ? 'bg-cyan-100 text-brightness-[1.1]' : 'hover:bg-cyan-100 hover:brightness-[1.1]'}`} to={'/add-products'}>Adicionar produtos</Link>
              <Link className={`w-full text-center py-1 rounded ${pageSelected === 'suggestions' ? 'bg-cyan-100 text-brightness-[1.1]' : 'hover:bg-cyan-100 hover:brightness-[1.1]'}`} to={'/suggestions'}>Sugestões</Link>
            </>
          )}
        </div>
      </div>
      <div className="lg:w-fit w-full">
        <div className="w-full px-4 my-1 lg:hidden block">
          <PageSectionTitle position="centered" title="Geral" icon={VscSymbolMisc}/>
        </div>
        <div className="flex flex-col gap-1 pb-1">
          {!admin && (<div className='flex bg-linear-to-r from-transparent via-green-200 to-transparent w-[95%] rounded justify-center m-1 p-1 items-center gap-1 text-sm text-green-800 font-semibold'><FaWallet/>R$ {BRLmoney(Number(wallet))}</div>)}
          <button onClick={() => {
            logout(); 
            setLoggingOut(true);
          }} className='flex items-center gap-1 justify-center hover:bg-yellow-100 text-cyan-800 mx-1 font-semibold cursor-pointer mt-1 rounded px-4 py-0.5'>{loggingOut ? (<div className="flex items-center gap-1"><Loading size={15}/>Saindo</div>) : (<div className="flex items-center gap-1"><BiLogOut/>Sair</div>)}</button>
          <Link to={'/settings'} className={`flex items-center gap-1 justify-center text-sm hover:bg-yellow-100 text-cyan-800 mx-1 font-semibold cursor-pointer rounded mb-0.5 px-4 py-1 ${pageSelected === 'settings' ? 'bg-yellow-100' : ''}`}><IoSettingsSharp/>Configurações</Link>
        </div>
      </div>
    </div>
  )
}

export default Menu