import type { IconType } from "react-icons"

const PageSectionTitle = ({title, icon: Icon}:{title?:string, icon: IconType}) => {
  return (
     <div className="flex items-center">
      <div className={`flex-1 bg-cyan-500 h-[2px] ${!title && 'my-3'}`}></div>
      {title && (<h1 className="flex px-4 items-center text-orange-800 justify-center gap-1 font-semibold text-2xl"><Icon/>{title}</h1>)}
      <div className="flex-1 bg-cyan-500 h-[2px]"></div>
    </div>
  )
}

export default PageSectionTitle