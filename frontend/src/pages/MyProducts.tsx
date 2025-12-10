import AppLayout from "../layout/AppLayout";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Title from "../components/Title";
import SectionTitle from "../components/SectionTitle";
import loading from '../assets/loading.svg';
import type { Product } from "../types/Product";
import { getProducts } from "../services/getProducts";
import { BsBoxSeam } from "react-icons/bs";

const MyProducts = () => {

  const [products, setProducts] = useState<Product[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const loadProducts = async() => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err:any) {
      console.error(err);
      return;
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <AppLayout>
      <div className="dashboard">
        <Title title="Meus Produtos" icon={<BsBoxSeam/>}/> 
        <SectionTitle title=""/>
        {isLoading && (
          <div className="loading-container">
            <img className="loading" src={loading} alt="Carregando..." />
          </div>
        )} {!isLoading && products.length === 0 && (
          <div>
            <p>Nenhum Produto Comprado no momento!</p>
          </div>
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
              amount={Number(product.pivot.amount)}
              purchase_dates={product.purchase_dates}
              purchase_dates_prices={product.prices}
              isnt_my_products_page={false}
            />
          ))}
        </div>
        )}
      </div>
    </AppLayout>
  )
}

export default MyProducts