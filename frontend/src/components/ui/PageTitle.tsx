import type { IconType } from "react-icons"

const PageTitle = ({
  title, 
  icon: Icon,
  style,
  IconSize,
}:{
  title:string;
  icon: IconType;
  style?: string;
  IconSize?: number;
}) => {
  return (
    <div className="flex items-center">
      <h1 className={`flex items-center mb-1 text-orange-800 justify-center gap-2 font-bold text-4xl ${style}`}><Icon size={IconSize}/>{title}</h1>
    </div>
  )
}

export default PageTitle