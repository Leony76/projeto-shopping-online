import { useEffect, useState } from "react";
import type { ProductAPI } from "../types/ProductAPI";
import { searchFilter } from "../utils/ui/searchFilter"
import { BsBoxSeamFill, BsDropbox } from "react-icons/bs"
import type { TransactionAPI } from "../types/TransactionAPI"
import { useListUserProducts } from "../utils/customHooks/useListUserProducts"

import GridUserProductCard from "../components/system/GridUserProductCard";
import UserProductCard from "../components/system/UserProductCard"
import CardFocusOverlay from "../components/ui/CardFocusOverlay";
import PageSectionTitle from "../components/ui/PageSectionTitle"
import EmptyCardGrid from "../components/ui/EmptyCardGrid"
import CardsGrid from "../components/system/CardsGrid"
import PageTitle from "../components/ui/PageTitle"
import Loading from "../components/ui/Loading";
import AppLayout from "../layout/AppLayout"

import '../css/scrollbar.css';
import InputForm from "../components/form/InputForm";
import type { AdvancedFilter } from "../types/AdvancedFilter";

const MyProducts = () => {

  const [products, setProduct] = useState<ProductAPI[]>([]);
  const [productTransactions, setProductTransactions] = useState<TransactionAPI[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter['filter']>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { ListUserProducts } = useListUserProducts({
    actions: {
      setProduct,
      setProductTransactions,
      setIsLoading,
    }
  });

  const [flags, setFlags] = useState({
    showProductInfo: false,
    showProductTransactions: false,
    showConfirmPurchase: false,
  });

  const listUserProducts = async() => {
    ListUserProducts();
  }

  useEffect(() => {
    listUserProducts();
  },[])

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
              <CardsGrid gridType="productCards" style="border-y-2 py-2 border-gray-200">
                {hasProducts && hasFilteredProducts ? (
                  filteredProducts.map((product) => (
                    <GridUserProductCard
                      key={product.id}
                      actions={{
                        setFlags:setFlags,
                        setSelectedProduct:setSelectedProduct
                      }}               
                      product={{
                        selected: product,
                        transactions:productTransactions
                      }}
                    />
                  ))
                ) : hasProducts && !hasFilteredProducts ? (
                  <div className="col-span-full py-21">
                    <EmptyCardGrid 
                      search={search}
                      text="Nenhum produto encontrado nesse filtro"
                      icon={BsBoxSeamFill}
                    />
                  </div>
                ) : (
                  <div className="col-span-full py-21">
                    <EmptyCardGrid 
                      search={search}
                      text="Nenhum produto comprado ainda"
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
                    selected:selectedProduct,
                    transactions:transactions
                  }}
                  flags={{
                    showProductTransactions:flags.showProductTransactions,
                    showConfirmPurchase:flags.showConfirmPurchase,
                  }}
                  actions={{
                    setFlags:setFlags,
                    setSelectedProduct:setSelectedProduct,
                    setProduct:setProduct,
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

