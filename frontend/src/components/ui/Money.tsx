import { FaMoneyBill } from 'react-icons/fa6'
import { BRLmoney } from '../../utils/formatation/BRLmoney'

const Money = ({value}:{value:number | undefined}) => {
  return (
    <p title="Preço" className="text-green-800 flex items-center gap-1"><FaMoneyBill/>R$ {BRLmoney(value)}</p> 
  )
}

export default Money