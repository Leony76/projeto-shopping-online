import { BsBoxSeamFill } from "react-icons/bs";
import { searchFilter } from "../utils/ui/searchFilter";

import type { AdvancedFilter } from "../types/AdvancedFilter";

import GridProductCard from "../components/system/GridProductCard";
import PageSectionTitle from "../components/ui/PageSectionTitle";
import CardFocusOverlay from "../components/ui/CardFocusOverlay";
import EmptyCardGrid from "../components/ui/EmptyCardGrid";
import ProductCard from "../components/system/ProductCard";
import CardsGrid from "../components/system/CardsGrid";
import InputForm from "../components/form/InputForm";
import PageTitle from "../components/ui/PageTitle";
import Loading from "../components/ui/Loading";
import AppLayout from "../layout/AppLayout";

import '../css/scrollbar.css';

import useProductLogic from "../utils/customHooks/useProductLogic";

const Products = () => {
  const {
    user, 
    flags,  
    products, 
    editProduct,  
    imagePreview, 
    advancedFilter, 
    selectedProduct,  
    setSelectedProduct, 
    handleImageChange,  
    setAdvancedFilter,  
    setEditProduct, 
    RemoveProduct,  
    EditProduct,  
    BuyProduct, 
    setFlags, 
  } = useProductLogic();

  return (
    <AppLayout pageSelected="products">
      {({search, filter}) => {
        
        const filteredProducts = searchFilter({
          products,
          search,
          filter,
          advancedFilter,
        });

        const hasProducts = products.length > 0;
        const hasFilteredProducts = filteredProducts.length > 0;

        return (
          <>
            {flags.isLoading && <Loading size={50} style="text-cyan-500 translate-[-50%] fixed top-1/2 left-1/2"/>}

            <PageTitle title="Produtos" icon={BsBoxSeamFill}/> 

            {!flags.isLoading && hasProducts && (
              <>
                <PageSectionTitle title="" icon={BsBoxSeamFill}/>
                <InputForm
                  fieldType={"advancedFilter"}
                  onSelect={(e) => setAdvancedFilter(e.target.value as AdvancedFilter['filter'])}
                />
              </>
            )}

            {!flags.isLoading && (            
              <CardsGrid gridType="productCards" style={`${(hasProducts && hasFilteredProducts) ? 'border-y-2 pt-2 border-gray-200' : ''}`}>
                {hasProducts ? (
                  filteredProducts.map((product) => (
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
                        setFlags,
                        setSelectedProduct,
                        handleImageChange,
                        EditProduct,
                        RemoveProduct,
                        setEditProduct,
                      }}
                    />
                  ))
                ) : hasProducts && !hasFilteredProducts ? (
                  <div className="col-span-full w-full fixed top-1/2 left-1/2 -translate-1/2">
                    <EmptyCardGrid 
                      text="Nenhum produto encontrado nesse filtro"
                      icon={BsBoxSeamFill}
                    />
                  </div>
                ) : (
                  <div className="col-span-full w-full fixed top-1/2 left-1/2 -translate-1/2">
                    <EmptyCardGrid 
                      text="Nenhum produto no estoque no momento"
                      icon={BsBoxSeamFill}
                    />
                  </div>
                )}        
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
                    BuyProduct,
                    setProduct: setSelectedProduct,
                  }}
                />
              </>
            )}
          </>
        )
      }}
    </AppLayout>
  )
}

export default Products;