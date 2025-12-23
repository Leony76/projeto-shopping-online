import type { IconType } from "react-icons"

const PageTitle = ({
  title, 
  icon: Icon,
  style
}:{
  title:string, 
  icon: IconType,
  style?: string
}) => {
  return (
    <div className="flex items-center">
      <h1 className={`flex items-center mb-1 text-orange-800 justify-center gap-2 font-bold text-4xl ${style}`}><Icon/>{title}</h1>
    </div>
  )
}

export default PageTitle