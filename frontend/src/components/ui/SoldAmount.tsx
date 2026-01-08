import { FaCashRegister } from 'react-icons/fa6'

const SoldAmount = ({soldAmount, border}:{soldAmount:number | null | undefined, border?: 'left' | 'right'}) => {
  return (
    <p title="$ Vendas" className={`flex items-center gap-1 text-blue-400
      ${border === 'left' && 'border-l-2 pl-3 ml-2 border-gray-400'} 
      ${border === 'right' && 'border-r-2 pr-3 mr-2 border-gray-400'}  
    `}><FaCashRegister />{soldAmount ?? 0}</p>  
  )
}

export default SoldAmount