import AppLayout from "../layout/AppLayout"
import Title from "../components/Title"
import { 
  RiAdminFill,
  BsBoxSeamFill
 } from '../assets/icons';
import './ProductManagement.css';
import { Link } from "react-router-dom";

const ProductManagement = () => {
  return (
    <AppLayout>
      <div className="product-management">
        <Title title="Gerir Produtos" icon={<RiAdminFill/>}/> 
        <div className="product-management-main-container">
          <Link to={'/admin/products-management/add-product'} className="action-buttons-to-crud add">
            <div className="icon-action"><span>+<BsBoxSeamFill/></span><h4>Adicionar Produto</h4></div>
            <p>Clique aqui para adicionar um novo produto!</p>
          </Link>
          <Link to={'/admin/products-management/edit-product'} className="action-buttons-to-crud edit">
            <div className="icon-action"><span><BsBoxSeamFill/>→<BsBoxSeamFill/></span><h4>Editar Produto</h4></div>
            <p className="action">Clique aqui para editar um produto!</p>
          </Link>
          <Link to={'/admin/products-management/remove-product'} className="action-buttons-to-crud remove">
            <div className="icon-action"><span>-<BsBoxSeamFill/></span><h4>Remover Produto</h4></div>
            <p>Clique aqui para remover um produto!</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}

export default ProductManagement