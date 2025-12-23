import { useState } from "react";

export const useImagePreview = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onFileSelect?: (file: File) => void
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onFileSelect?.(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetImagePreview = () => {
    setImagePreview(null);
  };

  return {
    imagePreview,
    handleImageChange,
    resetImagePreview,
  };
};
