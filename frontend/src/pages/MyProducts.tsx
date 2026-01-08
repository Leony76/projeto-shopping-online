import { searchFilter } from "../utils/ui/searchFilter"
import { BsBoxSeamFill, BsDropbox } from "react-icons/bs"

import type { AdvancedFilter } from "../types/AdvancedFilter";

import GridUserProductCard from "../components/system/GridUserProductCard";
import UserProductCard from "../components/system/UserProductCard"
import CardFocusOverlay from "../components/ui/CardFocusOverlay";
import PageSectionTitle from "../components/ui/PageSectionTitle"
import EmptyCardGrid from "../components/ui/EmptyCardGrid"
import CardsGrid from "../components/system/CardsGrid"
import InputForm from "../components/form/InputForm";
import PageTitle from "../components/ui/PageTitle"
import Loading from "../components/ui/Loading";
import AppLayout from "../layout/AppLayout"

import '../css/scrollbar.css';
import useMyProductsLogic from "../utils/customHooks/useMyProductsLogic";

const MyProducts = () => {

  const {
    flags,
    products,
    isLoading,
    advancedFilter,
    selectedProduct,
    productTransactions,
    setSelectedProduct,
    setAdvancedFilter,
    setProduct,
    setFlags,
  } = useMyProductsLogic();

  return (
    <AppLayout pageSelected="myProducts">
      {({search, filter}) => {

        const transactions = productTransactions.filter(t => t.product_id === selectedProduct?.id);
        const filteredProducts = searchFilter({
          products,
          transactions: productTransactions,
          search,
          filter,
          advancedFilter,
        });

        const hasProducts = products.length > 0;
        const hasFilteredProducts = filteredProducts.length > 0;

        return (
          <>
            {isLoading && <Loading size={50} style="text-cyan-500 translate-[-50%] fixed top-1/2 left-1/2"/>}

            <PageTitle title="Meus Produtos" icon={BsDropbox}/>

            {(!isLoading && hasProducts) && (
              <>
                <PageSectionTitle icon={BsDropbox}/>
                <InputForm
                  fieldType={"advancedFilter"}
                  userProducts={true}
                  onSelect={(e) => setAdvancedFilter(e.target.value as AdvancedFilter['filter'])}
                />
              </>
            )}

            {!isLoading && (         
              <CardsGrid gridType="productCards" style={`${(hasProducts && hasFilteredProducts) ? 'border-y-2 pt-2 border-gray-200' : ''}`}>
                {hasProducts ? (
                  filteredProducts.map((product) => (
                    <GridUserProductCard
                      key={product.id}
                      actions={{
                        setFlags,
                        setSelectedProduct,
                      }}               
                      product={{
                        selected: product,
                        transactions: productTransactions
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
                      text="Nenhum produto comprado até o momento"
                      icon={BsBoxSeamFill}
                    />
                  </div>
                )}        
              </CardsGrid>            
            )}
            
            {flags.showProductInfo && (
              <>
                <CardFocusOverlay onClick={() => setFlags(prev => ({...prev, showProductInfo: false, showProductTransactions: false}))}/>
                <UserProductCard
                  product={{
                    selectedProduct,
                    transactions
                  }}
                  flags={{
                    showProductTransactions:flags.showProductTransactions,
                    showConfirmPurchase:flags.showConfirmPurchase,
                  }}
                  actions={{
                    setFlags,
                    setSelectedProduct,
                    setProduct,
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

export default MyProducts

