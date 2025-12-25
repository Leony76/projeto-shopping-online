import { Outlet } from 'react-router-dom'
import  { AuthProvider } from '../context/AuthContext'
import  { CartProvider } from '../context/CartContext'
import  { ToastProvider } from '../context/ToastContext'
import { ProductsProvider } from '../context/ProductContext'

const RootLayout = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ProductsProvider>
          <CartProvider>
            <Outlet />
          </CartProvider>
        </ProductsProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default RootLayout