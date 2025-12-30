import { BiHomeAlt } from "react-icons/bi";
import { useState, useEffect, useMemo } from "react";
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
import { FaCommentDots } from "react-icons/fa6";
import UsersRateCommentCard from "../components/system/UsersRateCommentCard";
import { api } from "../services/api";
import type { UserCommentaryRate } from "../types/UserCommentaryRate";
import { useCatchError } from "../utils/ui/useCatchError";

const Home = () => {
  toastAppearOnce();

  const { user, setUser } = useAuth();
  const { handleImageChange, imagePreview } = useImagePreview();

  const {products, setProducts} = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
  const [userReviews, setUserReviews] = useState<UserCommentaryRate[]>([]);

  const catchError = useCatchError();

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
    const loadData = async() => {
      try {
        const [userReviewsRes, productsRes] = await Promise.all([
          api.get<{comments: UserCommentaryRate[]}>('users-reviews'),
          getProducts(),
        ]);

        setUserReviews(userReviewsRes.data.comments);
        setProducts(productsRes);
      } catch (err:unknown) {
        catchError(err);
      } finally { 
        setFlags(prev => ({ ...prev, isLoading: false }));
      }
    }

    loadData();
  }, []);

  const reviewsByProduct = useMemo(() => {
    return userReviews.reduce<Record<number, UserCommentaryRate[]>>(
      (acc, review) => {
        if (!acc[review.product_id]) {
          acc[review.product_id] = [];
        }
        acc[review.product_id].push(review);
        return acc;
      },
      {}
    );
  }, [userReviews]);

  return (
    <AppLayout pageSelected="home">
      {({search}) => {
        console.log(search);

        const hasProducts = products.length > 0;

        return (
          <>
            {flags.isLoading && <Loading size={50} style="text-cyan-500 translate-[-50%] fixed top-1/2 left-1/2"/>}

            <PageTitle title="Home" icon={BiHomeAlt} />  

            {!flags.isLoading && (
              <>
                <PageSectionTitle title="Principais produtos" icon={BsBoxSeamFill} />

                <CardsGrid grid={{ sm: 2, md: 3, lg: 4, xl: 5 }} style="border-y-2 py-2 border-gray-200">
                  {hasProducts ? (
                    products.slice(0, 5).map((product) => (
                      <GridProductCard
                        key={product.id}
                        product={product}
                        productForEdit={editProduct}
                        imagePreview={imagePreview}
                        flags={{
                          processingState: flags.processingState,
                          closeEditModal: flags.closeEditModal
                        }}
                        actions={{
                          setFlags,
                          handleImageChange,
                          handleEditProduct,
                          handleRemoveProduct,
                          setSelectedProduct,
                          setEditProduct,
                        }} />
                    ))
                  ) : (
                    <div className="col-span-full py-10">
                      <EmptyCardGrid 
                        search={search}
                        text="Nenhum produto disponível no estoque no momento"
                        icon={BsBoxSeamFill}
                      />    
                    </div>
                  )}
                </CardsGrid>

                <PageSectionTitle position="left" title="Avaliações do público" icon={FaCommentDots} />

                <CardsGrid grid={{sm: 1, md: 2, lg: 2, xl: 2}} style="border-y-2 py-2 border-gray-200 pr-2 custom-scroll max-h-[480px] overflow-y-auto">
                  {reviewsByProduct ? (
                    Object.entries(reviewsByProduct).map(([productId, reviews]) => {

                      const product = products.find(p => p.id === Number(productId));
                      if (!product) return null;

                      return (
                        <UsersRateCommentCard
                          key={product.id}
                          product={product}
                          usersReviews={reviews}
                        />
                      );
                    })
                  ) : (
                    <div className="col-span-full py-10">
                      <EmptyCardGrid 
                        search={search}
                        text="Ninguém fez comentário sobre algum produto ainda"
                        icon={FaCommentDots}
                      />    
                    </div>
                  )}
                </CardsGrid>
              </>
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
                    setProduct:setSelectedProduct,
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





