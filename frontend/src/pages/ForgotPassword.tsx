import React, { useState } from 'react'
import SubmitButton from '../components/SubmitButton'
import { useForgotPasswordMutation } from '../redux/services/authApi'
import { toast } from 'react-toastify'
import { ResponseError } from '../type/error'

const ForgotPassword = () => {
    const [email,setEmail] = useState('')

    const [forgotPassword, {isLoading, isSuccess}] = useForgotPasswordMutation()

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!email){
            toast.error('Please provide your email')
            return
        }
        try {
            const result = await forgotPassword({email: email}).unwrap()
            console.log(result)
            if('error' in result){
              toast.error('Error while sending rest link')
              return
            }
            toast.success('Password Reset Link Sent To Your Mail')
        } catch (error) {
            const resErr = error as ResponseError
            toast.error(resErr.data?.message || 'Failed to send rest link')
        }
    }

    if(isSuccess){
        return (
            <div className='min-h-[450px] flex items-center justify-center'>
                <p className='text-2xl font-bold text-center'>Password Reset Link Has Been Sent 🎉 </p>
            </div>
        )
    }
  return (
    <div className='max-w-[450px] mx-auto my-8'>
        <h2 className='mb-6 font-semibold text-xl text-center'>Reset Link Will Be Sent To Your Email</h2>
          <form onSubmit={handleForgotPassword}>
            <div className='flex flex-col mb-8'>
                <label htmlFor="email" className='mb-3 text-[0px]'>
                  Email 
                </label>
                <input type='email' autoFocus name='email' value={email} onChange={(e) => setEmail(e.target.value)} id='email'  className='py-2 px-4 w-full focus:outline-none border-[1px] border-[#ccc] rounded'  />
            </div>
            <div className='flex justify-center'>
                <SubmitButton isLoading={isLoading} title='Submit' />
            </div>
          </form>
    </div>
  )
}

export default ForgotPassword