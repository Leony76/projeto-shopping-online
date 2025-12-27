import { BiHomeAlt } from "react-icons/bi";
import { useState, useEffect } from "react";
import { BsBoxSeamFill } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../services/getProducts";
import { useProducts } from "../context/ProductContext";
import { toastAppearOnce } from "../utils/ui/toastAppearOnce";
import { useImagePreview } from "../utils/product/useImagePreview";
import { useBuyProduct } from "../utils/customHooks/useBuyProduct";
import { useEditProduct } from "../utils/customHooks/useEditProduct";
import { useRemoveProduct } from "../utils/customHooks/useRemoveProduct";

import type { Product } from "../types/Product";
import type { ProductAPI } from "../types/ProductAPI";
import type { UIFlags } from "../types/UIFlags";

import GridProductCard from "../components/system/GridProductCard";
import PageSectionTitle from "../components/ui/PageSectionTitle";
import CardFocusOverlay from "../components/ui/CardFocusOverlay";
import EmptyCardGrid from "../components/ui/EmptyCardGrid";
import ProductCard from "../components/system/ProductCard";
import CardsGrid from "../components/system/CardsGrid";
import PageTitle from "../components/ui/PageTitle";
import Loading from "../components/ui/Loading";
import AppLayout from "../layout/AppLayout";

import '../css/scrollbar.css';

const Home = () => {
  toastAppearOnce();

  const { user, setUser } = useAuth();
  const { handleImageChange, imagePreview } = useImagePreview();

  const {products, setProducts} = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
  
  const [editProduct, setEditProduct] = useState<Product>({
    id: 0,
    name: "",
    image: null,
    amount: "",
    description: "",
    category: "",
    price: "",
    created_at: "",
    updated_at: "",
  })
  
  const [flags, setFlags] = useState<UIFlags>({
    showProductInfo: false,
    showProductAmount: false,
    showConfirmPurchase: false,
    processingState: false,
    closeEditModal: false,
    isLoading: true,
  })

  const { RemoveProduct } = useRemoveProduct({
    actions: {
      setFlags,
      setProducts
    },
  });

  const { EditProduct } = useEditProduct({
    actions: {
      setFlags,
      setProducts,
    }
  });

  const { BuyProduct } = useBuyProduct({
    actions: {
      setFlags,
      setProducts,
      setSelectedProduct,
      setUser,
    }
  })

  const handleRemoveProduct = async(id: number):Promise<void> => {
    RemoveProduct(id, flags.processingState);
  }

  const handleEditProduct = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    EditProduct(flags.processingState, editProduct);
  }

  const handleBuySubmit = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    BuyProduct(flags.processingState, selectedProduct);
  }

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setFlags(prev => ({...prev, isLoading: false})));
  }, []);

  return (
    <AppLayout pageSelected="home">
      {({search}) => {
        console.log(search);
        return (
          <>
            <PageTitle title="Home" icon={BiHomeAlt}/>
            <PageSectionTitle title="Principais produtos" icon={BsBoxSeamFill}/>
            
            {flags.isLoading && <Loading size={50} style="text-cyan-500 translate-x-[-50%] fixed top-1/2 left-1/2"/>}
            {!flags.isLoading && products.length < 1 && (
              <EmptyCardGrid 
                search={search}
                text="Nenhum produto disponível no estoque no momento"
                icon={BsBoxSeamFill}
              />       
            )}
            {!flags.isLoading && products.length > 0 && (
              <CardsGrid>
                {products.slice(0, 5).map((product) => (
                  <GridProductCard
                    key={product.id}
                    product={product}
                    productForEdit={editProduct}
                    imagePreview={imagePreview}
                    flags={{
                      processingState:flags.processingState,
                      closeEditModal:flags.closeEditModal
                    }}
                    actions={{
                      setFlags:setFlags,
                      handleImageChange:handleImageChange,
                      handleEditProduct: handleEditProduct,
                      handleRemoveProduct:handleRemoveProduct,
                      setSelectedProduct:setSelectedProduct,
                      setEditProduct:setEditProduct,
                    }}
                  />
                ))}
              </CardsGrid>
            )}
            {flags.showProductInfo && (
              <>
                <CardFocusOverlay onClick={() => setFlags(prev => ({...prev, showProductInfo:false}))}/>
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
          </>
        );
      }}
    </AppLayout>
  )
}

export default Home;





