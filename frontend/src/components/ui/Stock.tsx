import { LuBoxes } from "react-icons/lu"

const Stock = ({stock, border}:{stock:number | undefined, border?: 'left' | 'right'}) => {
  return (
    <p title="No Estoque" className={`flex items-center gap-1 ${stock && stock > 0 ? 'text-orange-500' : 'text-red-500 bg-gradient-to-r pr-1 from-transparent via-red-200 to-red-200'} 
      ${border === 'left' && 'border-l-2 pl-2 ml-1 border-gray-400'} 
      ${border === 'right' && 'border-r-2 pr-2 mr-1 border-gray-400'}`}><LuBoxes/>
      {stock}
    </p>  
  )
}

export default Stock