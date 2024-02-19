import { PiHeadphonesDuotone } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { User } from "../../type/user";
import { useLogoutUserMutation } from "../../redux/services/authApi";
import { ResponseError } from "../../type/error";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOutUser } from "../../redux/features/authSlice";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdExitToApp } from "react-icons/md";
import { useEffect } from "react";




type HeaderTopProps = {
  user: User | null
}

const HeaderTop:React.FC<HeaderTopProps> = ({user}) => {

  const [logoutUser] = useLogoutUserMutation()

  const {pathname} = useLocation()


  const dispatch = useDispatch()

  const navigate = useNavigate()


  const logout = async () => {
    try {
      await logoutUser('').unwrap()
      dispatch(logOutUser())
      navigate('/')
      toast.success('Logged Out Successfully', {
				position: "top-right"
			});
    } catch (error) {
      const resErr = error as ResponseError
      toast.error(resErr?.data?.message || 'Failed to logout', {
          position: "top-right"
      });
    }
  }

  useEffect(() => {
    window.scrollTo(0,0)
  },[pathname])
  
  return (
      <section className="bg-bgGray">
        <div className="container py-2">
          <div className="flex justify-center lg:justify-between items-center">
            <span className="flex items-center gap-2 text-[13px]">
              <PiHeadphonesDuotone  className="text-primary"/>
              Hotline: 
              <a href="tel:+01 000 444 88" className="text-primary">+01 000 444 88</a>
            </span>
            <ul className="lg:flex items-center hidden">
              {
                user && (
                  <li>
                    <Link to={'/profile'} className="flex text-[13px] items-center gap-1 py-1 px-3 rounded transition-all duration-300 hover:bg-[#c5c5c56a] hover:text-primary">
                      <CgProfile className="text-base "/>
                      Profile
                    </Link>
                  </li>
                )
              }
              {!user && (
                <li>
                  <Link to={'/login-register'} className="flex text-[13px] items-center gap-1 py-1 px-3 rounded transition-all duration-300 hover:bg-[#c5c5c56a] hover:text-primary">
                    <CgProfile className="text-base "/>
                    Login/Register
                  </Link>
                </li>
              )}
              {
                (user && user?.role === 'admin') && (
                  <li>
                    <Link to={'/dashboard'} className="flex text-[13px] items-center gap-1 py-1 px-3 rounded transition-all duration-300 hover:bg-[#c5c5c56a] hover:text-primary">
                      <MdOutlineSpaceDashboard className='text-base' />
                      Dashboard
                    </Link>
                  </li>
                )
              }
              {user && (
                <li>
                  <button onClick={logout} className="flex text-[13px] items-center gap-1 py-1 px-3 rounded transition-all duration-300 hover:bg-[#c5c5c56a] hover:text-primary"><MdExitToApp className='text-base'/> Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
  )
}

export default HeaderTop