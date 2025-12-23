const ImagePreviewContainer = ({imagePreview}:{imagePreview:string | null}) => {
  return (
    <div className="flex-1 bg-white">
      <div style={{backgroundImage: `url(${imagePreview})`}} className="flex justify-center items-center border-y-2 w-full h-full bg-center bg-contain bg-no-repeat"><span className="-rotate-45 text-xl text-orange-800/50">{!imagePreview ? 'Imagem de Produto' : ''}</span></div>
    </div>
  )
}

export default ImagePreviewContainer