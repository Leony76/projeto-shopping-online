import type { IconType } from "react-icons"

type PageSectionTitle = {
  title?: string;
  icon: IconType;
  position?: 'left' | 'centered' | 'right';
}

const PageSectionTitle = ({
  title,
  icon: Icon,
  position,
}:PageSectionTitle) => {
  return (
    position === 'right' ? (
      <div className="flex items-center">
        <div className={`flex-1 bg-cyan-500 h-[2px] ${!title && 'my-3'}`}></div>
        {title && (<h1 className="flex px-4 items-center text-orange-800 justify-center gap-1 font-semibold text-2xl"><Icon/>{title}</h1>)}
      </div>
    ) : position === 'left' ? (
      <div className="flex items-center">
        {title && (<h1 className="flex px-4 items-center text-orange-800 justify-center gap-1 font-semibold text-2xl"><Icon/>{title}</h1>)}
        <div className="flex-1 bg-cyan-500 h-[2px]"></div>
      </div>
    ) : (
      <div className="flex items-center">
        <div className={`flex-1 bg-cyan-500 h-[2px] ${!title && 'my-3'}`}></div>
        {title && (<h1 className="flex px-4 items-center text-orange-800 justify-center gap-1 font-semibold text-2xl"><Icon/>{title}</h1>)}
        <div className="flex-1 bg-cyan-500 h-[2px]"></div>
      </div>
    )
  )
}

export default PageSectionTitle