import { IoClose } from "react-icons/io5"

const XCloseTopRight = ({closeSetter}:{closeSetter?: () => void}) => {
  return (
    <button title="(x) Fechar" type="button" onClick={closeSetter} className="absolute top-2 cursor-pointer right-2 text-orange-800 hover:text-orange-500 rounded hover:bg-cyan-100"><IoClose size={20}/></button>    
  )
}

export default XCloseTopRight