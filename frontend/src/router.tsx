import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from './auth/Login';
import Products from "./pages/Products";
import Register from "./auth/Register";
import { PrivateRoute } from "./privateRoutes/PrivateRoute";
import MyProducts from "./pages/MyProducts";
import { PrivateAdminRoute } from "./privateRoutes/PrivateAdminRoute";
import AddProduct from "./pages/AddProduct";
import Settings from "./pages/Settings";
import RootLayout from "./layout/RootLayout";
import Suggestions from "./pages/Suggestions";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

export const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [

      { path: "/", element: <Login/>},   
      { path: "/register", element: <Register/>},
      { path: "/forgot-password", element: <ForgotPassword/>},
      { path: "/reset-password", element: <ResetPassword/>},
      
      // <======)=o Private Routes (User) o=(======> // 
     
      { path: "/home", element:(
        <PrivateRoute>
          <Home/>
        </PrivateRoute>
      )},
    
      { path: "/products", element:(
        <PrivateRoute>
          <Products/>
        </PrivateRoute>
      )},
    
      { path: "/my-products", element:(
        <PrivateRoute>
          <MyProducts/>
        </PrivateRoute>
      )},
    
      { path: "/settings", element:(
        <PrivateRoute>
          <Settings/>
        </PrivateRoute>
      )},
    
      // <======)=o Private Routes (Admin) o=(======> // 
    
      { path: "/add-products", element:(
        <PrivateAdminRoute>
          <AddProduct/>
        </PrivateAdminRoute>
      )},

      { path: "/suggestions", element:(
        <PrivateAdminRoute>
          <Suggestions/>
        </PrivateAdminRoute>
      )},
    ]
  }
]);
