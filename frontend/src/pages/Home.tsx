import { IoHome } from "react-icons/io5";
import { TbBulbOff } from "react-icons/tb";
import { HiLightBulb } from "react-icons/hi";
import { BsBoxSeamFill } from "react-icons/bs";
import { BestProducts } from "../utils/misc/BestProducts";
import { FaCommentDots, FaCommentMedical } from "react-icons/fa6";

import SuggestedProductCard from "../components/system/SuggestedProductCard";
import UsersRateCommentCard from "../components/system/UsersRateCommentCard";
import SuggestProductForm from "../components/form/SuggestProductForm";
import AddSuggestionContainer from "../components/form/AddSuggestion";
import GridProductCard from "../components/system/GridProductCard";
import PageSectionTitle from "../components/ui/PageSectionTitle";
import CardFocusOverlay from "../components/ui/CardFocusOverlay";
import ConfirmDecision from "../components/ui/ConfirmDecision";
import ReviewsByProduct from "../utils/misc/ReviewsByProduct";
import EmptyCardGrid from "../components/ui/EmptyCardGrid";
import ProductCard from "../components/system/ProductCard";
import CardsGrid from "../components/system/CardsGrid";
import PageTitle from "../components/ui/PageTitle";
import Loading from "../components/ui/Loading";
import AppLayout from "../layout/AppLayout";

import '../css/scrollbar.css';

import useHomeLogic from "../utils/customHooks/useHomeLogic";

const Home = () => {
  const {
    user,
    flags,
    products,
    processing,
    userReviews,
    editProduct,
    imagePreview,
    addSuggestion,
    productSuggest,
    selectedProduct,
    suggestedProducts,
    selectedSuggestionId,
    ProductSuggestionDecision,
    setSelectedSuggestionId,
    setSelectedProduct,
    setProductSuggest,
    handleImageChange,
    setAddSuggestion,
    setEditProduct,
    SuggestProduct,
    AddSuggestion,
    RemoveProduct,
    EditProduct,
    BuyProduct,
    setFlags,
  } = useHomeLogic();

  return (
    <AppLayout pageSelected="home">
      {() => {

        const hasProducts = products.length > 0;
        const pendingSuggestions = suggestedProducts.filter(sp => !sp.accepted && !sp.denied);
        const { topProductsByCategory } = BestProducts({products});
        const { reviewsByProduct } = ReviewsByProduct({userReviews});
        
        return (
          <>
            {flags.isLoading && <Loading size={50} style="text-cyan-500 translate-[-50%] fixed top-1/2 left-1/2"/>}

            <PageTitle style={`!mt-1 !mb-2`} title="Home" icon={IoHome} />  

            {!flags.isLoading && (
              <>
                {/* ========================================== */}
                {/* <---- MAIN PRODUCTS OF EACH CATEGORY ----> */}
                {/* ========================================== */}

                <PageSectionTitle textSize="sm:text-2xl text-xl" title="Principais produtos" icon={BsBoxSeamFill} />

                <CardsGrid gridType="productCards" style="border-y-2 py-2 px-2 border-gray-200">
                  {hasProducts ? (
                    topProductsByCategory.slice(0, 5).map((product) => (
                      <GridProductCard
                        key={product?.id}
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
                          EditProduct,
                          RemoveProduct,
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

                {/* ==============================*/}
                {/* <---- CUSTOMERS REVIEWS ----> */}
                {/* ==============================*/}

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
                    {/* ==================================*/}
                    {/* <---- NEW PRODUCTS SUGGESTS ----> */}
                    {/* ================================= */}

                    <div className="md:hidden block"><PageSectionTitle textSize="sm:text-2xl text-lg" position="centered" title="Sugerir novos produtos" iconSize={35} icon={HiLightBulb}/></div>
                    <div className="md:block hidden"><PageSectionTitle textSize="sm:text-2xl text-lg" position="left" title="Sugerir novos produtos" iconSize={35} icon={HiLightBulb}/></div>

                    <SuggestProductForm 
                      actions={{
                        SuggestProduct,
                        handleImageChange,
                        setProductSuggest,
                      }} 
                      flags={{
                        processingState: processing.suggestProduct
                      }}
                      imagePreview={imagePreview}
                      productSuggest={productSuggest}                  
                    />

                    {/* ===========================*/}
                    {/* <---- ADD SUGGESTION ----> */}
                    {/* ===========================*/}

                    <div className="md:block hidden"><PageSectionTitle textSize="sm:text-2xl text-xl my-2 mt-4" position="left" title="Sugestão de adição" icon={FaCommentMedical}/></div>
                    <div className="md:hidden block"><PageSectionTitle textSize="sm:text-2xl text-xl my-2 mt-4" position="centered" title="Sugestão de adição" icon={FaCommentMedical}/></div>

                    <AddSuggestionContainer
                      addSuggestion={addSuggestion}
                      actions={{
                        setAddSuggestion,    
                        AddSuggestion
                      }}
                      processing={{
                        addSuggestion: processing.addSuggestion
                      }}
                    />
                  </>
                ) : (
                  <>

                    {/* ================================================= */}
                    {/* <----  ADMIN NEW PRODUCTS SUGGESTS DECISION ----> */}
                    {/* ================================================= */}

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



            {/* Product suggest decision modal */}

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
                  processingState={flags.processingState}
                  processingLabel={flags.showConfirmSuggestion.accept ? 'Aceitando' : 'Negando'}
                  onCancel={() => {
                    setSelectedSuggestionId(null);
                    setFlags(prev => ({...prev, showConfirmSuggestion: { accept: false, deny: false }}));
                  }}
                  onAcceptWithoutForm={() => ProductSuggestionDecision(
                      selectedSuggestionId,
                      flags.showConfirmSuggestion.accept
                    )
                  }
                />
              </>
            )}

            {/* Product detailed infos modal */}

            {flags.showProductInfo && (
              <>
                <CardFocusOverlay onClick={() => setFlags(prev => ({...prev, showProductInfo:false, showConfirmPurchase: false}))}/>
                <ProductCard
                  flags={flags}
                  product={selectedProduct}
                  user={user}
                  actions={{
                    setFlags,
                    BuyProduct,
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





