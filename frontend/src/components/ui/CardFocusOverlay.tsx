type CardFocusOverlay = {
  style?: string;
  onClick?: () => void;
}

const CardFocusOverlay = ({style, onClick}:CardFocusOverlay) => {
  return (
    <div onClick={onClick} className={`inset-0 bg-black/50 z-40 my-[-4px] fixed top-0 ${style && style}`}></div>
  )
}

export default CardFocusOverlay