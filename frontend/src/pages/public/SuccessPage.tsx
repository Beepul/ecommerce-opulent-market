import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import Success from '../../components/success/Success'

const SuccessPage = () => {
  
  return (
    <div className='container'>
      <CheckoutSteps active={3} />
      <Success />
    </div>
  )
}

export default SuccessPage