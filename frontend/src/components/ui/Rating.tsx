import { IoIosStar } from "react-icons/io"
import { IoStarOutline } from "react-icons/io5"

const Rating = ({rate}:{rate:number | null}) => {
  return (
    <p className="flex items-center gap-1 text-yellow-600 ">{rate ?? 0 > 0 ? <IoIosStar/> : <IoStarOutline/>}{!rate ? 'N/A' : rate.toFixed(1).replace('.',',')}</p>
  )
}

export default Rating