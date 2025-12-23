const CardFocusOverlay = ({zIndex}:{zIndex?: number}) => {
  return (
    <div className={`inset-0 bg-black/50 fixed top-0 ${zIndex ? zIndex : 'z-40'}`}></div>
  )
}

export default CardFocusOverlay