import { FaImage } from "react-icons/fa6"

const ImagePreviewContainer = ({imagePreview}:{imagePreview:string | null}) => {
  return (
    <div className="flex-1 bg-gray-100">
      <div style={{backgroundImage: `url(${imagePreview})`}} className="flex bg-white py-2 justify-center items-center border-y-4 border-double border-orange-500 w-full h-full bg-center bg-contain bg-no-repeat">
        <span className="text-[200px] text-orange-800/10">{!imagePreview ? <FaImage/>  : ''}</span>
      </div>
    </div>
  )
}

export default ImagePreviewContainer