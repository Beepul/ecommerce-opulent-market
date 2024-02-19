import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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


const AdminRoute: React.FC<ProtectedRouteProps> = ({ children,data ,user,isLoading,isError }) => {

  const location = useLocation()


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
    

    return <>{children}</>

};

export default AdminRoute;
