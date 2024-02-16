import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-toastify/dist/ReactToastify.css';


import { Suspense, lazy } from 'react';
import { Outlet, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useAutoLoginQuery } from "./redux/services/authApi"
import { useSelector } from "react-redux"
import { RootState } from "./redux/store"
import NotFound from "./pages/NotFound"

import Loader from './components/Loader';
const Header =lazy(() => import("./components/header/Header")) 
const Footer =lazy(() => import("./components/footer/Footer")) 
const DashHeader =lazy(() => import("./pages/admin/DashHeader")) 
const DashSidebar =lazy(() => import("./pages/admin/DashSidebar")) 


const Home = lazy(() => import('./pages/public/Home'))
const Shop = lazy(() => import("./pages/public/Shop"))
const LoginRegister = lazy(() => import("./pages/public/LoginRegister")) 
const ActivateUser = lazy(() => import("./pages/public/ActivateUser")) 

const Profile = lazy(() => import("./pages/public/Profile")) 
const Dashboard = lazy(() => import("./pages/admin/Dashboard/Dashboard")) 
const CreateProduct = lazy(() => import("./pages/admin/Products/CreateProduct")) 
const Products = lazy(() => import("./pages/admin/Products/Products")) 
const Orders = lazy(() => import("./pages/admin/Orders/Orders")) 
const Category = lazy(() => import("./pages/admin/Category/Category")) 
const CreateCategory = lazy(() => import("./pages/admin/Category/CreateCategory")) 
const SingleProduct = lazy(() => import('./pages/SingleProduct')) 
const CheckoutPage = lazy(() => import('./pages/public/CheckoutPage')) 
const PaymentPage = lazy(() => import('./pages/public/PaymentPage')) 
const SuccessPage = lazy(() => import('./pages/public/SuccessPage')) 
const Users = lazy(() => import('./pages/admin/Users/Users')) 
const PreviewOrder = lazy(() => import('./pages/admin/Orders/PreviewOrder')) 
const Transaction = lazy(() => import('./pages/admin/Transaction/Transaction')) 
const ResetPassword = lazy(() => import('./pages/ResetPassword')) 
const ForgotPassword = lazy(() => import('./pages/ForgotPassword')) 
const OrderHistory = lazy(() => import('./pages/public/OrderHistory')) 
const AdminSettings = lazy(() => import('./pages/admin/Settings/AdminSettings')) 


const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute")) 
const AdminRoute = lazy(()=> import("./routes/AdminRoute")) 










const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

const AdminLayout = () => {
  return (
    <>
      <DashHeader />
      <div className="flex gap-8">
        <div className="hidden lg:block">
          <DashSidebar />
        </div>
        <div className="flex-1 lg:max-w-[calc(100%-200px-32px)] max-w-[100%]">
          <Outlet />
        </div>
      </div>
    </>
  )
}



function App() {

  const user = useSelector((state: RootState) => state.auth.user)

  const {isLoading,data,isError} = useAutoLoginQuery('')

  return (
    <>
      <Suspense fallback={<div className='min-h-[100vh] flex items-center justify-center'><Loader /></div>}>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />}/>
              <Route path="/shop" element={<Shop />}/>
              <Route path="/product/:id" element={<SingleProduct />}/>
              <Route path="/login-register" element={<LoginRegister />} />
              <Route path="/activation/:activationToken" element={<ActivateUser />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/checkout-success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
              <Route path='/login/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
            </Route>
            <Route path="/dashboard" element={<AdminRoute isLoading={isLoading} data={data} isError={isError} user={user}><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path='all-users' element={<Users />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="products" element={<Products />} />
              <Route path="edit-product/:id" element={<CreateProduct />} />
              <Route path="create-category" element={<CreateCategory />} />
              <Route path="edit-category/:id" element={<CreateCategory />} />
              <Route path="category" element={<Category />} />
              <Route path="orders" element={<Orders />} />
              <Route path="order/:id" element={<PreviewOrder />} />
              <Route path='transactions' element={<Transaction />} />
              <Route path='settings' element={<AdminSettings />} />
            </Route>
            <Route path='/' element={<PublicLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
      </Suspense>
      <ToastContainer />
    </>
  )
}

export default App
