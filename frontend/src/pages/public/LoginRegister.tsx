import { useSelector } from 'react-redux';
import Login from '../../components/auth/Login';
import Register from '../../components/auth/Register';
import { RootState } from '../../redux/store';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';



const LoginRegister = () => {
    const user = useSelector((state: RootState) => state.auth.user)

    const navigate = useNavigate()

    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    useEffect(() => {
        if(user){
            navigate(from)
        }
    },[user])
    
  return (
    <section className='py-12'>
        <div className="container">
            <h2 className='font-bold text-[32px] mb-5'>My Account</h2>
            <div className='flex gap-12 flex-col lg:flex-row'>
                <div className='flex-1 bg-bgGray p-7 h-fit'>
                    <Login />
                </div>
                <div className='flex-1 bg-bgGray p-7 mb-12'>
                    <Register />
                </div>
            </div>
        </div>
    </section>
  )
}

export default LoginRegister