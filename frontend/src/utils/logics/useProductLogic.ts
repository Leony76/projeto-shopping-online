// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import type { ProductAPI } from "../../types/ProductAPI";
// import { toastAppearOnce } from "../ui/toastAppearOnce";
// import { useToast } from "../../context/ToastContext";
// import { api, getCsrf } from "../../services/api";
// import { getProducts } from "../../services/getProducts";
// import type { UIFlags } from "../../types/UIFlags";
// import { useCatchError } from "../ui/useCatchError";
// import { useImagePreview } from "../product/useImagePreview";
// import type { Product } from "../../types/Product";
// import { addProductsValidation } from "../product/addProductValidation";
// import { useCart } from "../../context/CartContext";

// export const useProductLogic = () => {
//   toastAppearOnce();

//   const { addToCart } = useCart();

//   const { user, setUser } = useAuth();
//   const catchError = useCatchError();

//   const [products, setProduct] = useState<ProductAPI[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
//   const [closeEditModal, setCloseEditModal] = useState(false);
  
//   const { showToast } = useToast();

//   const { handleImageChange, imagePreview, resetImagePreview } = useImagePreview();

//   const [editProduct, setEditProduct] = useState<Product>({
//     id: 0,
//     name: "",
//     image: null,
//     amount: "",
//     description: "",
//     category: "",
//     price: "",
//   })

//    const [flags, setFlags] = useState<UIFlags>({
//     showProductInfo: false,
//     showProductAmount: false,
//     showConfirmPurchase: false,
//     processingState: false,
//   })

//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const handleRemoveProduct = async(id: number) => {

//     if (flags.processingState)return;
//     setFlags(prev => ({...prev, processingState: true}))

//     console.log(selectedProduct && selectedProduct.id);

//     try {
//       await getCsrf();
//       const response = await api.delete(`/product/${id}`);

//       setProduct(prev => prev.filter((p) => p.id !== id));

//       showToast(response.data.message, response.data.type);

//       setFlags(prev => ({...prev, processingState: false}));
//     } catch (err:any) {
//       catchError(err);
//     }
//   }

//   const handleEditProduct = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
//     e.preventDefault();

//     if (flags.processingState)return;
//     setFlags(prev => ({...prev, processingState: true}));

//     const result = addProductsValidation(editProduct);
    
//     if (!result.valid) {
//       showToast(result.message!, "alert");
//       setFlags(prev => ({...prev, processingState: false}));
//       return;
//     }

//     const payload = new FormData();

//     payload.append('name', editProduct.name);
//     payload.append('category', editProduct.category);
//     payload.append('description', editProduct.description);
//     payload.append('amount', String(editProduct.amount));
//     payload.append('price', String(editProduct.price));
//     editProduct.image && payload.append('image', editProduct.image);

//     try {
//       await getCsrf();
//       const response = await api.patch(`/product/${editProduct.id}`, payload);

//       const updatedProduct = response.data.product;
      
//       setProduct(prev =>
//         prev.map(p =>
//           p.id === updatedProduct.id ? updatedProduct : p
//         )
//       );
      
//       showToast(response.data.message, response.data.type);
//       setFlags(prev => ({...prev, processingState: false}));
//       resetImagePreview();
//     } catch (err:any) {
//       catchError(err);
//     } finally {
//       setCloseEditModal(true);
//     }
//   }

//   const handleBuySubmit = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
//     e.preventDefault();

//     if (flags.processingState) return; 
//     setFlags(prev => ({...prev, processingState: true}));

//     if (!selectedProduct)return;

//     try {
//       await getCsrf();

//       const response = await api.post('/buy-product', {
//         id: selectedProduct.id,
//         amount: selectedProduct.selectedAmount ?? 1, 
//       });

//       setUser(prev => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           wallet: response.data.wallet,
//         }
//       });

//       const boughtProduct = response.data.product_bought; 

//       setProduct(prev =>
//         prev.map((p) => 
//           p.id === boughtProduct.id ? {
//             ...p, amount: boughtProduct.amount
//           } : p,
//         )
//       );

//       setSelectedProduct(prev =>
//         prev && prev.id === boughtProduct.id
//           ? { ...prev, amount: boughtProduct.amount }
//           : prev
//       );

//       showToast(response.data.message, response.data.type);
//     } catch (err) {
//       catchError(err);
//     } finally {
//       setFlags(prev => ({...prev,
//         showProductInfo: false,
//         showProductAmount: false,
//         showConfirmPurchase: false,
//         processingState: false,
//       }))
//     }
//   }

//   useEffect(() => {
//     getProducts()
//     .then(setProduct)
//     .finally(() => setIsLoading(false));
//   }, []);

//   return {
//     user,
//     flags,
//     products,
//     isLoading,
//     editProduct,
//     imagePreview,
//     selectedProduct,
//     closeEditModal,
//     setCloseEditModal,
//     handleRemoveProduct,
//     setSelectedProduct,
//     handleEditProduct,
//     handleImageChange,
//     handleBuySubmit,
//     setEditProduct,
//     setFlags,
//   }
// }