import { BsBoxSeamFill } from "react-icons/bs";
import { toastAppearOnce } from "../utils/ui/toastAppearOnce";

import GridProductCard from "../components/system/GridProductCard";
import CardFocusOverlay from "../components/ui/CardFocusOverlay";
import PageSectionTitle from "../components/ui/PageSectionTitle";
import ProductCard from "../components/system/ProductCard";
import CardsGrid from "../components/system/CardsGrid";
import PageTitle from "../components/ui/PageTitle";
import Loading from "../components/ui/Loading";
import AppLayout from "../layout/AppLayout";

import '../css/scrollbar.css';
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getCsrf, api } from "../services/api";
import { getProducts } from "../services/getProducts";
import type { Product } from "../types/Product";
import type { ProductAPI } from "../types/ProductAPI";
import type { UIFlags } from "../types/UIFlags";
import { addProductsValidation } from "../utils/product/addProductValidation";
import { useImagePreview } from "../utils/product/useImagePreview";
import { useCatchError } from "../utils/ui/useCatchError";

const Products = () => {
  toastAppearOnce();

  const { user, setUser } = useAuth();
  const catchError = useCatchError();

  const [products, setProduct] = useState<ProductAPI[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
  const [closeEditModal, setCloseEditModal] = useState(false);
  
  const { showToast } = useToast();

  const { handleImageChange, imagePreview, resetImagePreview } = useImagePreview();

  const [editProduct, setEditProduct] = useState<Product>({
    id: 0,
    name: "",
    image: null,
    amount: "",
    description: "",
    category: "",
    price: "",
  })

    const [flags, setFlags] = useState<UIFlags>({
    showProductInfo: false,
    showProductAmount: false,
    showConfirmPurchase: false,
    processingState: false,
  })

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleRemoveProduct = async(id: number) => {

    if (flags.processingState)return;
    setFlags(prev => ({...prev, processingState: true}))

    console.log(selectedProduct && selectedProduct.id);

    try {
      await getCsrf();
      const response = await api.delete(`/product/${id}`);

      setProduct(prev => prev.filter((p) => p.id !== id));

      showToast(response.data.message, response.data.type);

      setFlags(prev => ({...prev, processingState: false}));
    } catch (err:any) {
      catchError(err);
    }
  }

  const handleEditProduct = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (flags.processingState)return;
    setFlags(prev => ({...prev, processingState: true}));

    const result = addProductsValidation(editProduct);
    
    if (!result.valid) {
      showToast(result.message!, "alert");
      setFlags(prev => ({...prev, processingState: false}));
      return;
    }

    const payload = new FormData();

    payload.append('name', editProduct.name);
    payload.append('category', editProduct.category);
    payload.append('description', editProduct.description);
    payload.append('amount', String(editProduct.amount));
    payload.append('price', String(editProduct.price));
    editProduct.image && payload.append('image', editProduct.image);

    try {
      await getCsrf();
      const response = await api.patch(`/product/${editProduct.id}`, payload);

      const updatedProduct = response.data.product;
      
      setProduct(prev =>
        prev.map(p =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
      
      showToast(response.data.message, response.data.type);
      setFlags(prev => ({...prev, processingState: false}));
      resetImagePreview();
    } catch (err:any) {
      catchError(err);
    } finally {
      setCloseEditModal(true);
    }
  }

  const handleBuySubmit = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (flags.processingState) return; 
    setFlags(prev => ({...prev, processingState: true}));

    if (!selectedProduct)return;

    try {
      await getCsrf();

      const response = await api.post('/buy-product', {
        id: selectedProduct.id,
        amount: selectedProduct.selectedAmount ?? 1, 
      });

      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          wallet: response.data.wallet,
        }
      });

      const boughtProduct = response.data.product_bought; 

      setProduct(prev =>
        prev.map((p) => 
          p.id === boughtProduct.id ? {
            ...p, amount: boughtProduct.amount
          } : p,
        )
      );

      setSelectedProduct(prev =>
        prev && prev.id === boughtProduct.id
          ? { ...prev, amount: boughtProduct.amount }
          : prev
      );

      showToast(response.data.message, response.data.type);
    } catch (err) {
      catchError(err);
    } finally {
      setFlags(prev => ({...prev,
        showProductInfo: false,
        showProductAmount: false,
        showConfirmPurchase: false,
        processingState: false,
      }))
    }
  }

  useEffect(() => {
    getProducts()
    .then(setProduct)
    .finally(() => setIsLoading(false));
  }, []);

  return (
    <AppLayout pageSelected="products">
      <PageTitle title="Produtos" icon={BsBoxSeamFill}/>
      <PageSectionTitle title="" icon={BsBoxSeamFill}/>

      {isLoading && <Loading size={50} style="text-cyan-500 translate-x-[-50%] fixed top-1/2 left-1/2"/>}

      {!isLoading && products.length < 1 && (
        <p className="text-center text-gray-400 mt-5">Nenhum Produto encontrado!</p>
      )}

      {!isLoading && products.length > 0 && (
        <CardsGrid>
          {products.map((product) => (
            <GridProductCard
              key={product.id}
              elements={product}
              elementsForEdit={editProduct}
              imagePreview={imagePreview}
              flags={{
                processingState: flags.processingState,
                closeEditModal: closeEditModal
              }}
              actions={{
                setCloseEditModal: setCloseEditModal,
                setFlags: setFlags,
                EditProduct: setEditProduct,
                handleImageChange: (e) => handleImageChange(e, (file) => setEditProduct(prev => ({...prev, image: file}))),
                handleEditProduct: handleEditProduct,
                handleRemoveProduct: () => handleRemoveProduct(product.id),
                setEditProduct: () => setEditProduct(product),
                setShowProductInfo: () => {
                  setSelectedProduct(product);
                  setFlags(prev => ({...prev, showProductInfo: true}))
                },
              }}
            />
          ))}
        </CardsGrid>
      )}
  
        {flags.showProductInfo && (
          <>
            <CardFocusOverlay/>
            <ProductCard
              flags={flags}
              product={selectedProduct}
              user={user}
              actions={{
                setFlags,
                handleBuySubmit,
                setProduct: setSelectedProduct,
              }}
            />
          </>
        )}
    </AppLayout>
  )
}

export default Products;