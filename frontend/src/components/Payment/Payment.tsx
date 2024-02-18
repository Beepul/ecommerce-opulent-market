import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import PayButton from '../PayButton'
import Lottie from 'lottie-react'
import animationData from '../../assets/animations/loading.json'
import { toast } from 'react-toastify'
import { useCreateAddressMutation } from '../../redux/services/addressApi'
import { ResponseError } from '../../type/error'
import { useCreateOrderMutation } from '../../redux/services/orderApi'
import { useNavigate } from 'react-router-dom'



const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('')
  const user = useSelector((state : RootState) => state.auth.user)
  const cart = useSelector((state: RootState) => state.cart)
  const address = useSelector((state: RootState) => state.order.addressInfo)

  const [createAddress,{isLoading:addressLoading}] = useCreateAddressMutation()
  const [createOrder, {isLoading: orderLoading}] = useCreateOrderMutation()

  const navigate = useNavigate()

  const handleManualCheckout = async () => {
    // create address
    const {street,city,state,postalCode,country} = address

    if(!street || !city || !state || !postalCode || !country){
      toast.error('Address is missing!')
      return
    }

    let addResult

    try {
      addResult = await createAddress({street,city,state,postalCode,country}).unwrap()
      console.log({addResult})
      if('error' in addResult){
        toast.error('Address failed')
        return
      }
    } catch (error) {
      const addError = error as ResponseError
      toast.error(addError?.data?.message || 'Cannot create Address')
      return
    }

    // create order

    try {
      if(addResult){
        const orderResult = await createOrder({items: cart.cart,totalPrice:Number(cart.totalPrice + 20),shippingAddress:addResult.address._id})
        console.log({orderResult})
        if('error' in orderResult){
          toast.error('Order Failed')
          return
        }
        toast.success('Order Created Successfully')
        navigate('/checkout-success')
      }
    } catch (error) {
      const orderErr = error as ResponseError
      toast.error(orderErr?.data?.message || 'Cannot create Order')
      return
    }

  }

  
  return (
    <div>
      <h2 className='text-xl font-semibold text-center mb-12'>Conform All Information Before Proceeding</h2>
      <div className='mb-12 flex flex-wrap gap-12'>
        <div className='bg-bgGray flex-1 rounded-md p-6'>
         
          <div className='flex flex-wrap gap-2 mb-2'>
            <strong>Name:</strong>
            <span>{user?.name}</span>
          </div>
          <div className='flex flex-wrap gap-2 mb-2'>
            <strong>Email:</strong>
            <span>{user?.email}</span>
          </div>
          <div className='flex flex-wrap gap-2 mb-2'>
            <strong>Phone Number:</strong>
            <span>{address.phone}</span>
          </div>

        </div>
        <div className='bg-bgGray flex-1 rounded-md p-6'>
         
          <div className='flex gap-2 mb-2'>
            <strong>Country:</strong>
            <span>{address.country.name}</span>
          </div>
          <div className='flex gap-2 mb-2'>
            <strong>State:</strong>
            <span>{address.state.name}</span>
          </div>
          <div className='flex gap-2 mb-2'>
            <strong>City:</strong>
            <span>{address.city}</span>
          </div>
          <div className='flex gap-2 mb-2'>
            <strong>Street:</strong>
            <span>{address.street}</span>
          </div>
          <div className='flex gap-2 mb-2'>
            <strong>Postal Code:</strong>
            <span>{address.postalCode}</span>
          </div>

        </div>
        <div className='bg-bgGray flex-1  p-5 rounded-md'>
          <h5 className='font-semibold text-xl mb-4'>Cart Details</h5>
          <ul className='flex flex-col gap-4 mb-6 max-h-[250px] overflow-y-auto'>
            {
              cart.cart.map((c) => (
                <li key={c._id}>
                  <div className='flex gap-4 bg-white rounded-md py-2 px-2'>
                    <img src={c.images[0].url} alt={c.name} className='w-[80px] h-[100%] object-cover rounded-md' />
                    <div className='max-w-[180px]'>
                      <h5>{c.name}</h5>
                      <p className='text-[13px] text-gray-500 truncate max-w-[100%]'>{c.description}</p>
                      {
                        c.discountPercentage ? (
                          <span className='flex gap-2 text-[13px]'>
                            <del>${c.price}</del>
                            <p>${c.afterDiscountPrice}</p>
                          </span>
                        ) : (
                          <span className='text-[13px]'>${c.price}</span>
                        )
                      }
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
          <div className='flex justify-between mb-1'>
            <h5 className='font-semibold'>Sub Total</h5>
            <span>${cart.totalPrice}</span>
          </div>
          <div className='flex justify-between mb-3 border-b border-gray-300 pb-3'>
            <h5 className='font-semibold'>Shipping Cost</h5>
            <span>$20</span>
          </div>
          <div className='flex justify-between'>
            <h5 className='font-semibold'>Total Cost</h5>
            <span>${cart.totalPrice + 20}</span>
          </div>
        </div>
      </div>
      <h4 className='text-center mb-4 font-semibold text-xl'>Select Payment Method</h4>
      <div className='flex flex-col sm:flex-row sm:gap-8 gap-4 justify-center items-center mb-8'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <input type="radio" name='cash' checked={paymentMethod === 'cash' ? true : false} 
            onChange={() => setPaymentMethod('cash')}
            className='cursor-pointer' />
          <label htmlFor="cash">Cash On Delivery</label>
        </div>
        <div className='flex items-center gap-2 cursor-pointer'>
          <input type="radio" name='stripe' 
            onChange={() => setPaymentMethod('online')}
            checked={paymentMethod === 'online' ? true : false} className='cursor-pointer' />
          <label htmlFor="stripe">Pay with Stripe</label>
        </div>
      </div>
      {
        paymentMethod && (
          <div className='flex flex-col items-center justify-center mb-16'>
            {
              paymentMethod === 'online' ? <PayButton cart={cart} address={address}/> : 
              <button disabled={addressLoading || orderLoading} onClick={handleManualCheckout} className='btn-primary w-full px-4 md:w-fit disabled:cursor-not-allowed disabled:opacity-[1]'>
                {(addressLoading || orderLoading) ? (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    rendererSettings={{
                      preserveAspectRatio: "xMidYMid slice",
                    }}
                    width={50}
                    height={50}
                    style={{maxHeight:'40px', maxWidth: '40px'}}
                  />
                ): (
                  <span className='text-white'>Continue with COD</span>
                )}
            </button>
            }
            
          </div>
        )
      }
    </div>
  )
}

export default Payment