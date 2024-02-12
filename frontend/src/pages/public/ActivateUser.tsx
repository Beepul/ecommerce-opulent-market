import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {useActivateUserQuery} from '../../redux/services/authApi'
import { ResponseError } from '../../type/error'
import Loader from '../../components/Loader'

const ActivateUser = () => {

    const {activationToken} = useParams()

    const {isLoading, error,data} = useActivateUserQuery(activationToken!)

    const resErr = error as ResponseError

    if (isLoading) {
      return <div className='min-h-[500px] flex items-center justify-center'>
        <Loader />
      </div>
    }

    if(resErr){
      return <div className='min-h-[500px] flex items-center justify-center flex-col'>
        <p className='capitalize font-semibold text-3xl'>Opps!!! {resErr.data.message}</p>
        <span>Please try again!</span>
      </div>
    }

    if (data) {
      return (
        <div className='min-h-[500px] flex items-center justify-center flex-col'>
          <p className='capitalize font-semibold text-3xl mb-4'>Your Account Has Been Activated, Please Login.</p>
          <button className='btn-primary'>
            <Link to={'/login-register'}>Login</Link>
          </button>
        </div>
      )
    }
    return null
}

export default ActivateUser