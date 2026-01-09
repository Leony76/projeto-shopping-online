import type { Product } from "../Product";
import type { ProductAPI } from "../ProductAPI"

export type GridProductCard = {
  product: ProductAPI;
  editProduct: Product;
  imagePreview: string | null;

  flags: {
    processingState: boolean;
    closeEditModal: boolean;
  }

  onViewInfo: (product: ProductAPI) => void;
  onEdit: (product: ProductAPI) => void;
  onRemove: (productId: number) => void;
  onSubmitEdit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onImageChange: (file: File) => void;
}