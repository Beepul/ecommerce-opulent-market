import { CgProfile } from "react-icons/cg";
import { CiCircleQuestion } from "react-icons/ci";
import { FaFacebookF,FaInstagram,FaLinkedinIn,FaTwitter } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { AiFillDropboxCircle } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GoStack } from "react-icons/go";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import { PiGearSix } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";







export const secondaryMenu = [
    {
      icon: <CgProfile className="text-lg "/>,
      label: "Profile",
      link: '/profile',
      login: true,
    },
    {
      icon: <CgProfile className="text-lg"/>,
      label: "Login/Register",
      link: '/login-register',
      login: false,
    },
    {
      icon: <CiCircleQuestion className="text-lg"/> ,
      label: "FAQ",
      link: '/',
      login: false,
    }
]

export const primaryMenu = [
  {
    label: 'Home',
    link: '/',
  },
  {
    label: 'Shop',
    link: '/shop',
  }
]


export const socialList = [<FaFacebookF className="text-sm"/>,<FaInstagram className="text-sm" />,
<FaLinkedinIn className="text-sm"/>, <FaTwitter className="text-sm" />]


export const dashboardMenu = [ 
  {label: 'Dashboard', link: '/dashboard', icon: <MdOutlineSpaceDashboard className="group-hover:fill-primary transition-all active:primary duration-300"/>},
  {label: 'Users', link: '/dashboard/all-users', icon: <FaRegUser className="group-hover:fill-primary transition-all active:primary duration-300"/>},
  {label: 'Products', link: '/dashboard/products', icon: <IoCartOutline className="group-hover:fill-primary transition-all duration-300"/>},
  {label: 'Add Product', link: '/dashboard/create-product', icon: <IoMdAddCircleOutline className="group-hover:fill-primary transition-all duration-300"/>},
  {label: 'Categories', link: '/dashboard/category', icon: <GoStack className="group-hover:fill-primary transition-all duration-300"/>},
  {label: 'Add Category', link: '/dashboard/create-category', icon: <MdOutlineLibraryAdd className="group-hover:fill-primary transition-all duration-300"/>},
  {label: 'Orders', link: '/dashboard/orders', icon: <AiFillDropboxCircle className="group-hover:fill-primary transition-all duration-300"/>},
  {label: 'Transactions', link: '/dashboard/transactions', icon: <AiOutlineTransaction className="group-hover:fill-primary transition-all duration-300"/>},
  {label: 'Settings', link: '/dashboard/settings', icon: <PiGearSix className="group-hover:fill-primary transition-all duration-300"/>},
]


export const services = [
  {title: 'Secure payments', icon: <RiSecurePaymentFill className="fill-gray-500 text-3xl" />},
  {title: '30 days return period', icon: <MdOutlineAssignmentReturn className="fill-gray-500 text-3xl" />},
  {title: '24/7 customer support', icon: <TfiHeadphoneAlt className="fill-gray-500 text-3xl" />},
  {title: 'Flexible shipping', icon: <LiaShippingFastSolid className="fill-gray-500 text-3xl" />},
]