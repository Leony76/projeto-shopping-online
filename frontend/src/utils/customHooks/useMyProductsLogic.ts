import { useState, useEffect } from "react";
import type { AdvancedFilter } from "../../types/AdvancedFilter";
import type { ProductAPI } from "../../types/ProductAPI";
import type { TransactionAPI } from "../../types/TransactionAPI";
import useListUserProducts from "./useListUserProducts";
import { useLockYScroll } from "./useLockYScroll";

const useMyProductsLogic = () => {
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

  useLockYScroll(flags.showProductInfo);

  return {
    flags,
    products,
    isLoading,
    advancedFilter,
    selectedProduct,
    productTransactions,
    ListUserProducts,
    setProductTransactions,
    setSelectedProduct,
    setAdvancedFilter,
    setIsLoading,
    setProduct,
    setFlags,
  }
}

export default useMyProductsLogic