import { FaCalendarAlt } from "react-icons/fa"
import { date } from "../../utils/formatation/date"

const Date = ({timeStamp}:{timeStamp:string}) => {
  return (
    <small className="flex items-center gap-[3px]"><FaCalendarAlt size={11}/>{date(timeStamp)}</small>
  )
}

export default Date