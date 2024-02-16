import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate, useLocation } from 'react-router-dom';
import { useAutoLoginQuery } from '../redux/services/authApi';
import Loader from '../components/Loader';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const location = useLocation()

  const { data, isLoading,isError } = useAutoLoginQuery('');

    if(!user){

        if(isLoading){
            return <div className='min-h-[500px] flex items-center justify-center'>
                <Loader />
            </div>
        }

        if(isError || !data ){
            return <Navigate to='/login-register' state={{from: location}} replace />
        }
    }

    return <>{children}</>

};

export default ProtectedRoute;
