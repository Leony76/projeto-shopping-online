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

const MyProducts = () => {

  const [products, setProduct] = useState<ProductAPI[]>([]);
  const [productTransactions, setProductTransactions] = useState<TransactionAPI[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);

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
    processingState: false,
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
          search,
          filter,
        });

        return (
          <>
            <PageTitle title="Meus Produtos" icon={BsDropbox}/>
            <PageSectionTitle icon={BsDropbox}/>

            {isLoading && <Loading size={50} style="text-cyan-500 translate-x-[-50%] fixed top-1/2 left-1/2"/>}

            {!isLoading && filteredProducts.length < 1 && (
              <EmptyCardGrid 
                search={search}
                text="Nenhum produto comprado ainda"
                icon={BsBoxSeamFill}
              />
            )}

            {!isLoading && filteredProducts.length > 0 && (
              <CardsGrid>
                {products.filter(
                  p => p.name.toLowerCase().includes(search.toLowerCase())
                ).map((product) => (
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
                ))}
              </CardsGrid>
            )}
            
            {flags.showProductInfo && (
              <>
                <CardFocusOverlay onClick={() => setFlags(prev => ({...prev, showProductInfo:false}))}/>
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
                    setFlag:setFlags,
                    setSelectedProduct:setSelectedProduct,
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

