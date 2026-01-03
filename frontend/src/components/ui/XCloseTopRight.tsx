import { IoClose } from "react-icons/io5"

const XCloseTopRight = ({closeSetter, style}:{closeSetter?: () => void, style?: string}) => {
  return (
    <button title="(x) Fechar" type="button" onClick={closeSetter} className={`absolute top-2 lg:text-xl text-3xl cursor-pointer right-2 text-orange-800 hover:text-orange-500 lg:rounded lg:bg-transparent bg-gray-100 lg:p-0 p-1 hover:bg-cyan-100 ${style}`}><IoClose/></button>    
  )
}

export default XCloseTopRight