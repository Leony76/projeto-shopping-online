import { Link } from "react-router-dom";
import { BRLmoney } from "../../utils/formatation/BRLmoney";
import { IoSettingsSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { FaWallet } from "react-icons/fa6";

type Menu = {
  admin: boolean | undefined;
  wallet: number | string | undefined;
  logout: () => Promise<void>;
  pageSelected: 'home' | 'products' | 'myProducts' | 'addProduct' | 'settings' | 'suggestions';
}

const Menu = ({admin, logout, pageSelected, wallet}:Menu) => {
  return (
    <div className='flex flex-col shadow-md justify-center items-center fixed right-3 z-50 top-18 border-y-4 border-double border-orange-500 bg-white'>
      {!admin && (<div className='flex bg-linear-to-r from-transparent via-green-200 to-transparent  w-[95%] rounded justify-center m-1 p-1 items-center gap-1 text-sm text-green-800 font-semibold'><FaWallet/>R$ {BRLmoney(Number(wallet))}</div>)}
      <button onClick={logout} className='flex items-center gap-1 justify-center w-full  hover:bg-yellow-100 text-cyan-800 mx-1 font-semibold cursor-pointer rounded my-1 px-4'><BiLogOut/>Sair</button>
      <Link to={'/settings'} className={`flex items-center gap-1 justify-center w-full text-sm hover:bg-yellow-100 text-cyan-800 mx-1 font-semibold cursor-pointer rounded my-1 px-4 py-1 ${pageSelected === 'settings' ? 'bg-yellow-100' : ''}`}><IoSettingsSharp/>Configurações</Link>
    </div>
  )
}

export default Menu