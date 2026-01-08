import { FaImage } from "react-icons/fa6"

const ImagePreviewContainer = ({imagePreview, style}:{imagePreview:string | null, style?: string}) => {
  return (
    <div className={`flex-1 bg-gray-100 ${style} min-h-[300px] md:min-h-full`}>
      <div style={{backgroundImage: `url(${imagePreview})`}} className="flex bg-white shadow-[0_0_3px_#7E2A0C] py-2 justify-center items-center border-y-4 border-double border-orange-500 w-full h-full bg-center bg-contain bg-no-repeat">
        <span className="text-[200px] text-orange-800/10">{!imagePreview ? <FaImage/>  : ''}</span>
      </div>
    </div>
  )
}

export default ImagePreviewContainer