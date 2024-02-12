import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate, useLocation } from 'react-router-dom';
import { useAutoLoginQuery } from '../redux/services/authApi';
import Loader from '../components/Loader';
import { User } from '../type/user';

type ProtectedRouteProps = {
  children: React.ReactNode;
  user: User | null;
  isLoading: boolean;
  isError: boolean
  data: {
    user: User
  }
};

// type ResData = {
//     user: User
// }

const AdminRoute: React.FC<ProtectedRouteProps> = ({ children,data ,user,isLoading,isError }) => {
//   const user = useSelector((state: RootState) => state.auth.user);

  const location = useLocation()

//   const { data, isLoading,isError } = useAutoLoginQuery('');

    // console.log('Data:', data);
    // const resData = data as ResData
    // console.log('Loading:', isLoading);
    // console.log('Error:', isError);


    if(!user){

        if(isLoading){
            return <div className='min-h-[500px] flex items-center justify-center'>
                <Loader />
            </div>
        }

        if(isError || !data){
            return <Navigate to='/login-register' state={{from: location}} replace />
        }
        
        if(isLoading && !data.user){
            return <div className='min-h-[500px] flex items-center justify-center'>
                <Loader />
            </div>
        }

        if(data.user.role !== 'admin'){
            return <Navigate to='/' state={{from: location}} replace />
        }
    }

    // console.log("Data",resData)
    

    return <>{children}</>

};

export default AdminRoute;
