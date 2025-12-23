import { Outlet } from 'react-router-dom'
import  { AuthProvider } from '../context/AuthContext'
import  { CartProvider } from '../context/CartContext'
import  { ToastProvider } from '../context/ToastContext'

const RootLayout = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default RootLayout