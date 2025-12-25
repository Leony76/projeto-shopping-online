import type { IconType } from "react-icons";
import { FaQuestion } from "react-icons/fa6"

type EmptyCardGrid = {
  search?:string;
  text:string;
  icon: IconType
  container?: {
    style: string;
  }
}

const EmptyCardGrid = ({
  search,
  text,
  icon: Icon,
  container
}:EmptyCardGrid) => {
  return (
    <div className={`flex flex-col items-center mt-5 text-gray-400 ${container ? container.style : ''}`}>     
      <div className="flex">
        <FaQuestion className="-rotate-45"/>
        <FaQuestion className="mb-1"/>
        <FaQuestion className="rotate-45"/>
      </div>
      <Icon className="text-3xl"/>        
      <p className="">{`${!search ? text : 'Nenhum produto encontrado para ' + search}!`}</p>
    </div>
  )
}

export default EmptyCardGrid