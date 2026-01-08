import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { ProductAPI } from "../types/ProductAPI";
import type { ProductSuggest } from "../types/SuggestProduct";
import type { UserCommentaryRate } from "../types/UserCommentaryRate";
import { api } from "./api";
import { getProducts } from "./getProducts";
import type { UIFlags } from "../types/UIFlags";
import { useCatchError } from "../utils/ui/useCatchError";

type useLoadHomeData = {
  actions: {
    setUserReviews: Dispatch<SetStateAction<UserCommentaryRate[]>>;
    setProducts: Dispatch<SetStateAction<ProductAPI[]>>;
    setSuggestedProducts: Dispatch<SetStateAction<ProductSuggest[]>>;
    setFlags: Dispatch<SetStateAction<UIFlags>>;
  }
}

export const useLoadHomeData = ({actions}:useLoadHomeData) => {

  const catchError = useCatchError();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userReviews, products, suggestedProducts] = await Promise.all([
          api.get<{ comments: UserCommentaryRate[] }>('/users-reviews'),
          getProducts(),
          api.get<{ suggested_products: ProductSuggest[] }>('/suggested-products'),
        ]);

        actions.setUserReviews(userReviews.data.comments);
        actions.setProducts(products);
        actions.setSuggestedProducts(suggestedProducts.data.suggested_products);
      } catch (err: unknown) {
        catchError(err);
      } finally {
        actions.setFlags(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, []);
}

