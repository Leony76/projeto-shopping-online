import type { ProductAPI } from "../../types/ProductAPI";

type BestProducts = {
  products: ProductAPI[];
}

export const BestProducts = ({products}:BestProducts) => {
    const TARGET_CATEGORIES = [
      'Artesanal',
      'Cozinha',
      'Limpeza',
      'Eletrônico',
      'Móveis',
    ];
  
    const productsByCategory = products.reduce<Record<string, typeof products>>(
      (acc, product) => {
        const category = product.category; 
  
        if (!TARGET_CATEGORIES.includes(category)) return acc;
  
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
  
        return acc;
      },
      {}
    );
  
    const topProductsByCategory = TARGET_CATEGORIES.map(category => {
      const categoryProducts = productsByCategory[category];
  
      if (!categoryProducts || categoryProducts.length === 0) return null;
  
      return categoryProducts
        .sort((a, b) => (b.orders_sum_quantity ?? 0) - (a.orders_sum_quantity ?? 0))[0];
    }).filter(Boolean);

  return { topProductsByCategory };
}

