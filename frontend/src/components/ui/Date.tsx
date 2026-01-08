import { FaCalendarAlt } from "react-icons/fa"
import { date } from "../../utils/formatation/date"

const Date = ({timeStamp}:{timeStamp:string | undefined}) => {
  return (
    timeStamp &&
    <small className="flex items-center gap-[3px]"><FaCalendarAlt/>{date(timeStamp)}</small>
  )
}

export default Date