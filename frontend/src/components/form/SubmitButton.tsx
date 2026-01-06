import type { IconType } from "react-icons";
import Loading from "../ui/Loading";

type SubmitButton = {
  ButtonAction: string;
  icon: IconType;
  processing: boolean;
  processingLabel: string;
  style?: string;
}

const SubmitButton = ({ButtonAction, style, processing, processingLabel, icon: Icon}:SubmitButton) => {
  return (
    <button type="submit" className={`flex items-center gap-1 justify-center border-y-8 border-double font-bold  text-xl tracking-wide p-1 mt-2 rounded-lg cursor-pointer hover:opacity-80 active:opacity-100 ${style}`}>{processing ? <Loading size={20}/> : <Icon size={20}/>}{processing ? processingLabel : ButtonAction}</button>
  )
}

export default SubmitButton