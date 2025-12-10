import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Products from './pages/Products';
import AdminProducts from './pages/AdminProducts';
import { AuthProvider } from './context/AuthContext.tsx'
import MyProducts from './pages/MyProducts.tsx';
import Settings from './pages/Settings.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/dashboard'
              element={
                <PrivateRoute>
                  <Dashboard/>
                </PrivateRoute>
              }
            />
            <Route path='/products'
              element={
                <PrivateRoute>
                  <Products/>
                </PrivateRoute>
              }
            />
            <Route path='/my-products'
              element={
              <PrivateRoute>
                <MyProducts/>
              </PrivateRoute>
              }
            />
            <Route path='/admin/products'
              element={
                <AdminRoute>
                  <AdminProducts/>
                </AdminRoute>
              }
            />
            <Route path='/settings'
              element={
                <PrivateRoute>
                  <Settings/>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
