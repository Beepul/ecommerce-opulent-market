import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Outlet, Route, Routes } from "react-router-dom"
import Header from "./components/header/Header"
import Home from "./pages/public/Home"
import Shop from "./pages/public/Shop"
import LoginRegister from "./pages/public/LoginRegister"
import Footer from "./components/footer/Footer"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"
import ActivateUser from "./pages/public/ActivateUser"
import NotFound from "./pages/NotFound"
import { useAutoLoginQuery } from "./redux/services/authApi"
import Profile from "./pages/public/Profile"
import ProtectedRoute from "./routes/ProtectedRoute"
import Dashboard from "./pages/admin/Dashboard/Dashboard"
import AdminRoute from "./routes/AdminRoute"
import DashHeader from "./pages/admin/DashHeader"
import DashSidebar from "./pages/admin/DashSidebar"
import CreateProduct from "./pages/admin/Products/CreateProduct"
import Products from "./pages/admin/Products/Products"
import Orders from "./pages/admin/Orders/Orders"
import Category from "./pages/admin/Category/Category"
import CreateCategory from "./pages/admin/Category/CreateCategory"
import { useSelector } from "react-redux"
import { RootState } from "./redux/store"
import SingleProduct from './pages/SingleProduct';
import CheckoutPage from './pages/public/CheckoutPage';
import PaymentPage from './pages/public/PaymentPage';
import SuccessPage from './pages/public/SuccessPage';
import Users from './pages/admin/Users/Users';
import PreviewOrder from './pages/admin/Orders/PreviewOrder';
import Transaction from './pages/admin/Transaction/Transaction';
import AccountSetting from './pages/AccountSetting';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import OrderHistory from './pages/public/OrderHistory';
import AdminSettings from './pages/admin/Settings/AdminSettings';

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
      <ToastContainer />
    </>
  )
}

export default App
