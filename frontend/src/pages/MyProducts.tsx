import CardsGrid from "../components/system/CardsGrid"
import PageSectionTitle from "../components/ui/PageSectionTitle"
import PageTitle from "../components/ui/PageTitle"
import AppLayout from "../layout/AppLayout"
import { BsDropbox } from "react-icons/bs"
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

  const [showProductInfo, setShowProductInfo] = useState<boolean>(false);
  const [showProductAmount, setShowProductAmount] = useState<boolean>(false);
  const [showConfirmPurchase, setShowConfirmPurchase] = useState<boolean>(false);
  const [processingState, setProcessingState] = useState<boolean>(false);

  const productTransactions = transactions.filter(
    t => t.product_id === selectedProduct?.id
  );

  return (
    <AppLayout pageSelected="myProducts">
      <PageTitle title="Meus Produtos" icon={BsDropbox}/>
      <PageSectionTitle icon={BsDropbox}/>
      {isLoading && <Loading size={50} style="text-cyan-500 translate-x-[-50%] fixed top-1/2 left-1/2"/>}

      {!isLoading && products.length < 1 && (
        <p className="text-center text-gray-400 mt-5">Nenhum Produto encontrado!</p>
      )}

      {!isLoading && products.length > 0 && (
        <CardsGrid>
          {products.map((product) => (
            <GridUserProductCard
              key={product.id}
              elements={product}
              transactionData={transactions}
              actions={{
                setShowProductInfo: () => {
                  setSelectedProduct(product);
                  setShowProductInfo(true);
                }
              }}
            />
          ))}
        </CardsGrid>
      )}
  
        {showProductInfo && (
          <>
            <CardFocusOverlay/>
            <UserProductCard
              flags={{
                showProductAmount,
                showConfirmPurchase,
                processingState,
              }}
              product={selectedProduct}
              transactions={productTransactions}
              actions={{
                setShowProductInfo,
                setShowProductAmount,
                setShowConfirmPurchase,
                setProcessingState,
                setProduct: setSelectedProduct,
              }}
            />
          </>
        )}
    </AppLayout>
  )
}

export default MyProducts

