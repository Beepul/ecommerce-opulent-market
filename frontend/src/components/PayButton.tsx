import React from 'react'
import { CartProduct } from '../type/product'
import { useCheckoutMutation } from '../redux/services/orderApi';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Lottie from 'lottie-react';
import animationData from '../assets/animations/loading.json'
import { toast } from 'react-toastify';
import { ResponseError } from '../type/error';
import { Address } from '../redux/features/orderSlice';

type PayBUttonProps = {
    cart: {
        cart: CartProduct[];
        totalPrice: number;
    };
    address: Address
}

const PayButton:React.FC<PayBUttonProps> = ({cart,address}) => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [checkout,{isLoading}] = useCheckoutMutation()

    console.log(address)

    const handleCheckout = async () => {
        try {
            const res = await checkout({cart: cart.cart,userId: user?._id,address}).unwrap()
            console.log(res)
            if(res.url){
                window.location.href = res.url
            }
            
        } catch (error) {
            const resErr = error as ResponseError
            toast.error(resErr?.data?.message || 'Cannot Process Checkout!')
            console.log("Checkout Error",error)
        }
    }
  return (
    <>
        <button onClick={() => handleCheckout()} disabled={isLoading} className='btn-primary w-full px-4 md:w-auto disabled:cursor-not-allowed disabled:opacity-[1]'>
            {isLoading ? (
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
              <span className='text-white'>Continue with Stripe</span>
            )}
        </button>
    </>
  )
}

export default PayButton