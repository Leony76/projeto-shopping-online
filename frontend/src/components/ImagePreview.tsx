import { useRef, useState, useEffect } from "react";

const useImagePreview = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null)

  const handleClick = () => {
    inputRef.current?.click();
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file)return;
    
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl); 
    setFile(file);
  }

  const resetImagePreview = () => {
    setPreview(null);
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  
  return {
    preview,
    inputRef,
    file,
    handleChange,
    handleClick,
    resetImagePreview
  };
}

export default useImagePreview