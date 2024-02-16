import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import Checkout from '../../components/checkout/Checkout'

const CheckoutPage = () => {
  const cart = useSelector((state:RootState) => state.cart)

  const navigate = useNavigate()

  useEffect(() => {
    if(cart.cart.length <= 0){
      toast.warning('Please add items in your card')
      navigate('/')
    }
  },[cart])
  return (
    <div className='container'>
      <CheckoutSteps active={1} />
      <Checkout />
      {/* <PayButton cart={cart}/> */}
    </div>
  )
}

export default CheckoutPage