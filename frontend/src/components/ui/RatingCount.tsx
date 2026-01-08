import { MdPeopleAlt } from "react-icons/md"

const RatingCount = ({rateCount, border}:{rateCount:number | null | undefined, border?: 'left' | 'right'}) => {
  return (
    <p className={`flex items-center gap-1 font-semibold text-yellow-600 
      ${border === 'left' && 'border-l-2 pl-2 ml-2 border-yellow-600'} 
      ${border === 'right' && 'border-r-2 pr-2 mr-2 border-yellow-600'} 
    `}><MdPeopleAlt className="xl:text-lg lg:text-xl md:text-xl sm:text-2xl text-base"/>{rateCount}</p>   
  )
}

export default RatingCount