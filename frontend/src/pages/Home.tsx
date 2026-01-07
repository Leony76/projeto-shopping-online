import React, { useState, useEffect, useMemo } from "react";
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
import { HiLightBulb } from "react-icons/hi";
import SuggestProductForm from "../components/form/SuggestProductForm";
import type { ProductSuggest } from "../types/SuggestProduct";
import { useToast } from "../context/ToastContext";
import SuggestedProductCard from "../components/system/SuggestedProductCard";
import ConfirmDecision from "../components/ui/ConfirmDecision";
import { TbBulbOff } from "react-icons/tb";
import { IoHome } from "react-icons/io5";
import { useLockYScroll } from "../utils/customHooks/useLockYScroll";

const Home = () => {
  toastAppearOnce();

  const { user, setUser } = useAuth();
  const { handleImageChange, imagePreview, resetImagePreview } = useImagePreview();
  const { showToast} = useToast();
  const catchError = useCatchError();

  const {products, setProducts} = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<number | null>(null);
  const [userReviews, setUserReviews] = useState<UserCommentaryRate[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductSuggest[]>([]);


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

  const [productSuggest, setProductSuggest] = useState<ProductSuggest>({
    name: "",
    image: null,
    imagePreview: "",
    description: "",
    category: "",
    price: "",
  })
  
  const [flags, setFlags] = useState<UIFlags>({
    showProductInfo: false,
    showProductAmount: false,
    showConfirmPurchase: false,
    showConfirmSuggestion: {
      accept: false,
      deny: false
    },

    processingState: false,
    closeEditModal: false,
    isLoading: true,
  })

  const handleSuggestProductSubmit = async(e:React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (flags.processingState) return;
    setFlags(prev => ({...prev, processingState: true}));

    if (!productSuggest.name || !productSuggest.category || !productSuggest.description || !productSuggest.price || !productSuggest.image) {
      showToast('Preencha todos os campos antes de mandar sua sugestão', 'error');
      setFlags(prev => ({...prev, processingState: false}));
      return;
    }

    const payload = new FormData();

    payload.append('name', productSuggest.name);
    payload.append('category', productSuggest.category);
    payload.append('description', productSuggest.description);
    payload.append('price', productSuggest.price);
    payload.append('image', productSuggest.image);

    try {
      const response = await api.post(`/product-suggest/${user?.id}`, payload);

      showToast(response.data.message, response.data.type);
      setProductSuggest(prev => ({...prev, name: '', category: '', description: '', price: '', image: null}))
      resetImagePreview();
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setFlags(prev => ({...prev, processingState: false}));
    }
  }

  const handleAcceptDenyProductSuggestion = async ( id: number | null, isAccept: boolean) => {
    if (!id || flags.processingState) return;
    setFlags(prev => ({...prev, processingState: true}));

    try {
      const response = await api.patch(`/suggested-product-answer/${id}`, {
        answer: isAccept ? 'accepted' : 'denied',
      });

      showToast(response.data.message, response.data.type);

      setSuggestedProducts(prev =>
        prev.filter(p => p.id !== id)
      );
    } catch (err) {
      catchError(err);
    } finally {
      setFlags(prev => ({...prev, showConfirmSuggestion: { accept: false, deny: false }}));
      setFlags(prev => ({...prev, processingState: false}));
    }
  };

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
        const [userReviews, products, suggestedProducts] = await Promise.all([
          api.get<{comments: UserCommentaryRate[]}>('/users-reviews'),
          getProducts(),
          api.get<{suggested_products: ProductSuggest[]}>('/suggested-products'),
        ]);

        setUserReviews(userReviews.data.comments);
        setProducts(products);
        setSuggestedProducts(suggestedProducts.data.suggested_products);
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

  useLockYScroll(flags.showProductInfo);
  useLockYScroll(flags.showConfirmSuggestion.accept);
  useLockYScroll(flags.showConfirmSuggestion.deny);

  return (
    <AppLayout pageSelected="home">
      {() => {

        const hasProducts = products.length > 0;
        const pendingSuggestions = suggestedProducts.filter(sp => !sp.accepted && !sp.denied);

        return (
          <>
            {flags.isLoading && <Loading size={50} style="text-cyan-500 translate-[-50%] fixed top-1/2 left-1/2"/>}

            <PageTitle style={`!mt-1 !mb-2`} title="Home" icon={IoHome} />  

            {!flags.isLoading && (
              <>
                <PageSectionTitle textSize="sm:text-2xl text-xl" title="Principais produtos" icon={BsBoxSeamFill} />

                <CardsGrid gridType="productCards" style="border-y-2 py-2 px-2 border-gray-200">
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
                        text="Nenhum produto disponível no estoque no momento"
                        icon={BsBoxSeamFill}
                      />    
                    </div>
                  )}
                </CardsGrid>

                <div className="md:hidden block"><PageSectionTitle textSize="sm:text-2xl text-xl" position="centered" title="Avaliações do público" icon={FaCommentDots} /></div>
                <div className="md:block hidden"><PageSectionTitle textSize="sm:text-2xl text-xl" position="left" title="Avaliações do público" icon={FaCommentDots} /></div>

                <CardsGrid gridType="productReviews" style="border-y-2 border-gray-200 p-2 custom-scroll max-h-[480px] overflow-y-auto">
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
                        text="Ninguém fez comentário sobre algum produto ainda"
                        icon={FaCommentDots}
                      />    
                    </div>
                  )}
                </CardsGrid>

                {!user?.admin ? (
                  <>
                    <div className="md:hidden block"><PageSectionTitle textSize="sm:text-2xl text-lg" position="centered" title="Sugerir novos produtos" iconSize={35} icon={HiLightBulb}/></div>
                    <div className="md:block hidden"><PageSectionTitle textSize="sm:text-2xl text-lg" position="left" title="Sugerir novos produtos" iconSize={35} icon={HiLightBulb}/></div>

                    <SuggestProductForm 
                      actions={{
                        handleSuggestProductSubmit,
                        handleImageChange,
                        setProductSuggest,
                      }} 
                      flags={{
                        processingState: flags.processingState
                      }}
                      imagePreview={imagePreview}
                      productSuggest={productSuggest}                  
                    />
                  </>
                ) : (
                  <>
                    <div className="md:hidden block"><PageSectionTitle position="centered" title="Sugerir novos produtos" iconSize={35} icon={HiLightBulb}/></div>
                    <div className="md:block hidden"><PageSectionTitle position="left" title="Sugerir novos produtos" iconSize={35} icon={HiLightBulb}/></div>

                    <CardsGrid gridType={"productSuggests"} style="border-y-2 py-2 border-gray-200 px-2 custom-scroll max-h-[465px] overflow-y-auto">
                      {(pendingSuggestions.length > 0) ? (
                        pendingSuggestions.map((suggestProduct) => (
                          <SuggestedProductCard
                            key={suggestProduct.id}
                            suggestProduct={suggestProduct}
                            actions={{
                              setFlag:setFlags,
                              setSelectedSuggestionId
                            }}
                          />
                        ))
                      ) : (
                        <div className="col-span-full pb-2 pt-5">
                          <EmptyCardGrid 
                            text={"Nenhuma sugestão ainda"} 
                            icon={TbBulbOff}
                          />
                        </div>
                      )}
                    </CardsGrid>
                  </>
                )}
              </>            
            )}

            {(flags.showConfirmSuggestion.accept || flags.showConfirmSuggestion.deny) && (
              <>
                <CardFocusOverlay onClick={() => {
                    setSelectedSuggestionId(null);
                    setFlags(prev => ({...prev, showConfirmSuggestion: { accept: false, deny: false }}));
                  }}
                />

                <ConfirmDecision
                  overlayOff
                  decisionTitle={flags.showConfirmSuggestion.accept ? 'Aceitar sugestão' : 'Recusar sugestão'}
                  decisionDescription={`Tem certeza que deseja ${flags.showConfirmSuggestion.accept ? 'aceitar' : 'negar'} essa sugestão de produto?`}
                  onCancel={() => {
                    setSelectedSuggestionId(null);
                    setFlags(prev => ({...prev, showConfirmSuggestion: { accept: false, deny: false }}));
                  }}
                  onAcceptWithoutForm={() => handleAcceptDenyProductSuggestion(
                      selectedSuggestionId,
                      flags.showConfirmSuggestion.accept
                    )
                  }
                  processingState={flags.processingState}
                  processingLabel={flags.showConfirmSuggestion.accept ? 'Aceitando' : 'Negando'}
                />
              </>
            )}

            {flags.showProductInfo && (
              <>
                <CardFocusOverlay onClick={() => setFlags(prev => ({...prev, showProductInfo:false, showConfirmPurchase: false}))}/>
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





