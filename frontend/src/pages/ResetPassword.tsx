import React, { useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import SubmitButton from '../components/SubmitButton'
import { toast } from 'react-toastify'
import { useResetPasswordMutation } from '../redux/services/authApi'
import { ResponseError } from '../type/error'

const ResetPassword = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

    const [resetPassword, {isLoading, isSuccess}] = useResetPasswordMutation()

    const {resetToken} = useParams()

    const handleResetPassowrd = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!password || !confirmPassword){
            toast.error('All fields required!')
            return
        }
        if(password !== confirmPassword){
            toast.error('Password doesnot match')
            return
        }
        try {
            const result = await resetPassword({token: resetToken,password}).unwrap()
            console.log(result)
            if('error' in result){
              toast.error('Error while password reset')
              return
            }
            setPassword('')
            setConfirmPassword('')
            toast.success('Password Reset Successful')
        } catch (error) {
        const resErr = error as ResponseError
            toast.error(resErr.data?.message || 'Failed to reset password')
        }
    }

    if(isSuccess){
        return (
            <div className='min-h-[450px] flex items-center justify-center'>
                <p className='text-2xl font-bold text-center'>Password Reset Successful 🎉 </p>
            </div>
        )
    }
  return (
    <div className='max-w-[350px] mx-auto py-16'>
        <h2 className='mb-6 font-semibold text-xl text-center'>Update Password</h2>
          <form onSubmit={handleResetPassowrd}>
            <div className='flex flex-col mb-8'>
              <label htmlFor="password" className='mb-3 text-[15px]'>
                  Password 
              </label>
              <div className='relative'>
                  <input type={showPassword ? 'text' : "password"} autoFocus name='password' value={password} onChange={(e) => setPassword(e.target.value)} id='password'  className='py-2 px-4 w-full focus:outline-none border-[1px] border-[#ccc] rounded'  />
                  <span className='cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]'
                  onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <IoEyeOffOutline className="text-lg"/> : <IoEyeOutline  className="text-lg"/>}
                  </span>
              </div>
            </div>
            <div className='flex flex-col mb-8 '>
              <label htmlFor="confirmpassword" className='mb-3 text-[15px]'>
                  Confirm Password 
              </label>
              <div className='relative'>
                  <input type={showPassword ? 'text' : "password"} name='confirmpassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id='confirmpassword'  className='py-2 px-4 w-full focus:outline-none border-[1px] border-[#ccc] rounded'  />
                  <span className='cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]'
                  onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <IoEyeOffOutline className="text-lg"/> : <IoEyeOutline  className="text-lg"/>}
                  </span>
              </div>
            </div>
            <div className='flex justify-center'>
                <SubmitButton isLoading={isLoading} title='Submit' />
            </div>
          </form>
    </div>
  )
}

export default ResetPassword