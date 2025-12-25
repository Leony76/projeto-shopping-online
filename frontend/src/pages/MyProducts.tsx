import CardsGrid from "../components/system/CardsGrid"
import PageSectionTitle from "../components/ui/PageSectionTitle"
import PageTitle from "../components/ui/PageTitle"
import AppLayout from "../layout/AppLayout"
import { BsBoxSeamFill, BsDropbox } from "react-icons/bs"
import { useEffect, useState } from "react";
import GridUserProductCard from "../components/system/GridUserProductCard";
import CardFocusOverlay from "../components/ui/CardFocusOverlay";

import '../css/scrollbar.css';
import Loading from "../components/ui/Loading";
import type { ProductAPI } from "../types/ProductAPI";
import UserProductCard from "../components/system/UserProductCard"
import { api } from "../services/api"
import axios from "axios"
import { useToast } from "../context/ToastContext"
import type { TransactionAPI } from "../types/TransactionAPI"
import EmptyCardGrid from "../components/ui/EmptyCardGrid"
import { searchFilter } from "../utils/ui/searchFilter"

const MyProducts = () => {

  const [products, setProduct] = useState<ProductAPI[]>([]);
  const [transactions, setTransactions] = useState<TransactionAPI[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);

  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const listUserProducts = async() => {

    try {
      const response = await api.get('/user-products');
      console.log(response.data);

      setProduct(response.data.products);
      setTransactions(response.data.transactions);
    } catch (err:any) {
      if (axios.isAxiosError(err) && err.response) {
        showToast(err.response.data.message, "error");
      } else {
        showToast("Erro inesperado", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    listUserProducts();
  },[])

  const [flags, setFlags] = useState({
    showProductInfo: false,
    showProductAmount: false,
    showConfirmPurchase: false,
    processingState: false,
  });

  const productTransactions = transactions.filter(
    t => t.product_id === selectedProduct?.id
  );

  return (
    <AppLayout pageSelected="myProducts">
      {({search, filter}) => {

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
                    elements={product}
                    transactionData={transactions}
                    actions={{
                      setShowProductInfo: () => {
                        setSelectedProduct(product);
                        setFlags(prev => ({...prev, showProductInfo:true}));
                      }
                    }}
                  />
                ))}
              </CardsGrid>
            )}
            {flags.showProductInfo && (
              <>
                <CardFocusOverlay onClick={() => setFlags(prev => ({...prev, showProductInfo:false}))}/>
                <UserProductCard
                  flags={{
                    showProductAmount: flags.showProductAmount,
                    showConfirmPurchase: flags.showConfirmPurchase,
                  }}
                  product={selectedProduct}
                  transactions={productTransactions}
                  actions={{
                    setShowProductInfo:     (value:boolean) => setFlags(prev => ({...prev, showProductInfo: value})),
                    setShowProductAmount:   (value:boolean) => setFlags(prev => ({...prev, showProductAmount: value})),
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

export default MyProducts

