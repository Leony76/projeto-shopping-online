import type { ProductAPI } from "../../types/ProductAPI";

export const searchFilter = ({
  products,
  search,
  filter,
}: {
  products: ProductAPI[];
  search: string;
  filter: ProductAPI['category'] | '';
}) =>
  products.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      !filter || p.category === filter;

    return matchSearch && matchCategory;
  });