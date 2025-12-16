import { 
  FaDropbox, 
  BsBoxSeamFill
} from '../assets/icons';
import '../layout/AppLayout.css';

type Noproducts = {
  section: 'dashboard/products' | 'my-products';
}

const NoProducts = ({section}:Noproducts) => {
  return (
    <div className='no-products'>
      <span className={`${section === 'my-products' ? 'lower' : 'upper'}`}>?</span>
      {section === 'my-products' ? <FaDropbox size={40}/> : <BsBoxSeamFill size={30}/>}
      <p>Nenhum produto {section === 'my-products' ? 'comprado' : 'posto para venda'} no momento!</p>
    </div>
  )
}

export default NoProducts;