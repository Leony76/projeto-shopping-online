import { BiErrorCircle } from 'react-icons/bi';

type WarnError = {
  error: string;
}

const WarnError = ({error}:WarnError) => {
  return (
    <p className="flex items-center gap-[2px] text-red-500 text-sm"><BiErrorCircle size={16} className="mt-[3px]"/>{error}</p>   
  )
}

export default WarnError