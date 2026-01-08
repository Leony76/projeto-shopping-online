import { FaCalendarAlt } from "react-icons/fa";
import { dateTime } from "../../utils/formatation/dateTime";

const DateTime = ({timeStamp, style}:{timeStamp:string | undefined, style?: string}) => {
  return (
    <small className={`flex items-center gap-[3px] ${style && style}`}><FaCalendarAlt/>{dateTime(timeStamp)}</small>              
  )
}

export default DateTime