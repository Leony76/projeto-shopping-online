import type { IconType } from "react-icons"

type ReturnActionButton = {
  onClick: () => void;
  iconButton: IconType
  iconButtonSize: number;
  buttonLabel: string;
  processingState?: boolean;
  style?: string;
}

const ReturnActionButton = ({
  iconButtonSize,
  buttonLabel,
  iconButton: Icon,
  processingState,
  style,
  onClick,
}:ReturnActionButton) => {
  return (
    <button type="button" disabled={processingState} onClick={!processingState ? onClick : undefined} className={`transition px-2 flex md:text-base text-lg justify-center items-center bg-red-200 flex-[1] py-1 gap-1 rounded border-y-8 border-double border-red-500 text-red-600 font-semibold ${style ? style : ''} ${processingState ? 'cursor-not-allowed brightness-[.8]' : 'cursor-pointer hover:brightness-[1.1]'}`}><Icon className={`${iconButtonSize ? iconButtonSize : 'md:text-xl text-3xl'}`}/>{buttonLabel}</button>
  )
}

export default ReturnActionButton