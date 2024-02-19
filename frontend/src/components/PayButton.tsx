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
import { IoMdCopy } from "react-icons/io";
import { IconButton, Tooltip } from '@mui/material'

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

    const copyVisaCardNumber = () => {
      const visaCardNumber = '4242 4242 4242 4242';
      navigator.clipboard.writeText(visaCardNumber)
        .then(() => {
          alert('Visa card number copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
    
  return (
    <>
      <div className='max-w-[500px] bg-gray-100 p-4 px-6 border-l-4 border-primary mb-6'>
              <p className='text-gray-600 mb-4'><span className='font-semibold'>Note:</span> You Can Use These Stripe Payment Card Information For Checkout:</p>
            </div>
              <div className='flex items-center'>
                <p className='mb-1'><strong className='mr-2'>Visa Card Number:</strong>4242 4242 4242 4242</p>
                <Tooltip title="Copy">
                  <IconButton onClick={copyVisaCardNumber}>
                    <IoMdCopy className="text-[17px]" />
                  </IconButton>
                </Tooltip>
              </div>
              <p className='mb-8'><strong className='mr-2'>CVC:</strong>333</p>
        <button onClick={() => handleCheckout()} disabled={isLoading} className='btn-primary w-full px-4 md:w-fit disabled:cursor-not-allowed disabled:opacity-[1]'>
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