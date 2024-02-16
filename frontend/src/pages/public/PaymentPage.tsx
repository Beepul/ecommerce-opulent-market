import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import Payment from '../../components/Payment/Payment'

const PaymentPage = () => {
  const cart = useSelector((state:RootState) => state.cart)
  const address = useSelector((state:RootState) => state.order.addressInfo)

  const navigate = useNavigate()

  useEffect(() => {
    if(cart.cart.length <= 0){
      toast.warning('Please add items in your card')
      navigate('/')
    }
    if(!address){
      toast.warning('Please add address information')
      navigate(-1)
    }
  },[cart])
  return (  
    <div className='container'>
      <CheckoutSteps active={2} />
      <Payment />
    </div>
  )
}

export default PaymentPage