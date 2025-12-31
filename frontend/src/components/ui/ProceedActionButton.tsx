import type { IconType } from "react-icons";
import Processing from "./Loading";

type ProceedActionButton = {
  onClick?: () => void;
  iconButton: IconType
  iconButtonSize: number;
  buttonLabel: string;

  actionType?: 'submit' | 'button';
  styles?: string | undefined;
  disable?: boolean;
  buttonLabelWhileProcessing?: string;
  processingState?: boolean;
  title?: string;
}

const ProceedActionButton = ({
  iconButtonSize,
  buttonLabel,
  styles,
  buttonLabelWhileProcessing,
  iconButton: Icon,
  processingState,
  actionType,
  disable,
  title,
  onClick,
}:ProceedActionButton) => {
  return (
    !processingState ? (
      <button disabled={disable} title={title} type={actionType} onClick={onClick} className={`flex justify-center transition items-center flex-[1] py-1 gap-1 rounded border-y-4 border-double hover:brightness-[1.1]  cursor-pointer font-semibold ${styles ? styles : 'bg-orange-200 text-orange-600 border-orange-500'}`}>{processingState ? <Processing size={20}/> : <Icon size={iconButtonSize}/>}{processingState ? buttonLabelWhileProcessing : buttonLabel}</button>  
    ) : (
      <button disabled={disable} type={actionType} onClick={onClick} className={`flex justify-center cursor-wait transition items-center flex-[1] py-1 gap-1 rounded border-y-4 border-double hover:brightness-[1.1]  cursor-pointer font-semibold ${styles ? styles : 'bg-orange-200 text-orange-600 border-orange-500'}`}>{processingState ? <Processing size={20}/> : <Icon size={iconButtonSize}/>}{processingState ? buttonLabelWhileProcessing : buttonLabel}</button>  
    )
  )
}

export default ProceedActionButton