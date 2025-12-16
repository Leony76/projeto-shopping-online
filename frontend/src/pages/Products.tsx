import type { Product } from "../types/Product";

import { useEffect, useState } from "react";
import { getProductsForSale } from "../services/getProductsForSale";

import AppLayout from "../layout/AppLayout";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import Title from "../components/Title";
import loading from '../assets/loading.svg';

import { FaBasketShopping } from '../assets/icons';

import "./Dashboard.css";
import NoProducts from "../components/NoProducts";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await getProductsForSale();
        setProducts(data);
      } catch (err:any) {
        console.error("Erro ao carregar produtos: " + err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <AppLayout>
      <div className="dashboard">
        <Title title="Produtos" icon={<FaBasketShopping/>}/> 
        <SectionTitle title=""/>
        {isLoading && (
          <div className="loading-container">
            <img className="loading" src={loading} alt="Carregando..." />
          </div>
        )} {!isLoading && products.length === 0 && (
          <NoProducts section="dashboard/products"/>
        )} {!isLoading && products.length > 0 && (
          <div className="cards-grid">
          {products.map((product) => (
            <ProductCard
              id={product.id}
              key={product.id}
              image={`http://localhost:8000/storage/${product.image}`}
              name={product.name}
              category={product.category}
              date_put_to_sale={new Date(product.created_at).toLocaleDateString('pt-BR')}
              description={product.description}
              price={Number(product.price)}
              amount={Number(product.amount)}
              isnt_my_products_page={true}
            />
          ))}
        </div>
        )}
      </div>
    </AppLayout>
  )
}

export default Products