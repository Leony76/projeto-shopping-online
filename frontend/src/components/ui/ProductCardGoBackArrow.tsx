import { FaArrowLeft } from 'react-icons/fa6'

const ProductCardGoBackArrow = ({onClick}:{onClick: () => void}) => {
  return (
    <button title='← Voltar' onClick={onClick} type="button" className="absolute lg:text-base text-[25px] top-[8px] cursor-pointer lg:right-8 right-10 text-orange-800 hover:text-orange-500 lg:bg-transparent bg-gray-100 lg:p-0.5 p-[6.5px] lg:rounded rounded-bl-xl hover:bg-cyan-100"><FaArrowLeft/></button>    
  )
}

export default ProductCardGoBackArrow