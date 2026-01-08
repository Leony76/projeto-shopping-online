import type { AdvancedFilter } from "../../types/AdvancedFilter";
import type { ProductAPI } from "../../types/ProductAPI";
import type { TransactionAPI } from "../../types/TransactionAPI";

type SearchFilter = {
  products: ProductAPI[];
  transactions?: TransactionAPI[];
  search: string;
  filter: ProductAPI['category'] | '';
  advancedFilter: AdvancedFilter['filter'];
}

export const searchFilter = ({
  products,
  transactions,
  search,
  filter,
  advancedFilter,
}:SearchFilter) => {
  const transactionStats = new Map<number, {
    totalSpent: number;
    totalQuantity: number;
    totalOrders: number;
  }>();

  transactions?.forEach(t => {
    const current = transactionStats.get(t.product_id) ?? {
      totalSpent: 0,
      totalQuantity: 0,
      totalOrders: 0,
    };

    transactionStats.set(t.product_id, {
      totalSpent: current.totalSpent + t.total_price,
      totalQuantity: current.totalQuantity + t.quantity,
      totalOrders: current.totalOrders + 1,
    });
  });

  const statsOf = (productId: number) =>
  transactionStats.get(productId) ?? {
    totalSpent: 0,
    totalQuantity: 0,
    totalOrders: 0,
  };

  const filtered = products.filter(p => {
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      !filter || p.category === filter;

    return matchSearch && matchCategory;
  });

  switch (advancedFilter) {
    case 'Maiores preços':
      return [...filtered].sort(
        (a, b) => b.price - a.price
      );

    case 'Menores preços':
      return [...filtered].sort(
        (a, b) => a.price - b.price
      );

    case 'Mais vendidos':
      return [...filtered].sort(
        (a, b) =>
          (b.orders_sum_quantity ?? 0) -
          (a.orders_sum_quantity ?? 0)
      );

    case 'Mais bem avaliados':
      return [...filtered].sort(
        (a, b) =>
          (b.product_rate_avg_rating ?? 0) -
          (a.product_rate_avg_rating ?? 0)
      );

    case 'Maiores gastos':
      return [...filtered].sort(
        (a, b) =>
          statsOf(b.id).totalSpent -
          statsOf(a.id).totalSpent
      );

    case 'Menores gastos':
      return [...filtered].sort(
        (a, b) =>
          statsOf(a.id).totalSpent -
          statsOf(b.id).totalSpent
      );

    case 'Mais comprados':
      return [...filtered].sort(
        (a, b) =>
          statsOf(b.id).totalQuantity -
          statsOf(a.id).totalQuantity
      );

    case 'Menos comprados':
      return [...filtered].sort(
        (a, b) =>
          statsOf(a.id).totalQuantity -
          statsOf(b.id).totalQuantity
      );

    case 'Favoritos':
      return [...filtered].sort(
        (a, b) =>
        (b.user_rating ?? 0) - (a.user_rating ?? 0)
      );

    case 'Menos Favoritos':
      return [...filtered].sort(
        (a, b) =>
        (a.user_rating ?? 0) - (b.user_rating ?? 0)
      );
      
    case 'Avaliados':
      return filtered.filter(p => (p.user_rating ?? 0) > 0);

    case 'Não avaliados':
      return filtered.filter(p => !p.user_rating || p.user_rating === 0);

    default:return filtered;
  }
};
