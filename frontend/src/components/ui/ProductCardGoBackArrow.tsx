import { FaArrowLeft } from 'react-icons/fa6'

const ProductCardGoBackArrow = ({onClick}:{onClick: () => void}) => {
  return (
    <button title='← Voltar' onClick={onClick} type="button" className="absolute top-[8px] cursor-pointer right-8 text-orange-800 hover:text-orange-500 lg:bg-transparent bg-gray-100 lg:p-0.5 p-[6.5px] lg:rounded rounded-bl-xl hover:bg-cyan-100"><FaArrowLeft size={15}/></button>    
  )
}

export default ProductCardGoBackArrow