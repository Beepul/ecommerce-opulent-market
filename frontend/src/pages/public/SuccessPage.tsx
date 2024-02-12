import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import Success from '../../components/success/Success'

const SuccessPage = () => {
  const cart = useSelector((state:RootState) => state.cart)

  const navigate = useNavigate()

  // useEffect(() => {
  //   if(cart.cart.length <= 0){
  //     toast.warning('Please add items in your card')
  //     navigate('/')
  //   }
  // },[cart])
  return (
    <div className='container'>
      <CheckoutSteps active={3} />
      <Success />
    </div>
  )
}

export default SuccessPage