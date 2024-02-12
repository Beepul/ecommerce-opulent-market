import React, { useEffect, useState } from 'react'
import DashTitle from './admin/DashTitle'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { ResponseError } from '../type/error'
import { useForgotPasswordMutation, useUpdateCredentialsMutation, useUpdatePasswordMutation } from '../redux/services/authApi'
import SubmitButton from '../components/SubmitButton'

const AccountSetting = () => {
  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)

  const [updateUser, {isLoading}] = useUpdateCredentialsMutation()
  const [updatePassword, {isLoading: passLoading}] =  useUpdatePasswordMutation()
  const [forgotPassword, {isLoading: forgetPassLoading}] = useForgotPasswordMutation()

  // console.log(user)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!name){
      toast.error('Name is required')
      return
    }

    try {
      const result = await updateUser({name}).unwrap()
      console.log(result)
      if('error' in result){
        toast.error('Error')
        return
      }
      toast.success('Update Success')
    } catch (error) {
      const resErr = error as ResponseError
      toast.error(resErr.data?.message || 'Failed to update credentials')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!password || !newPassword){
      toast.error('Password and new password is required')
      return
    }
    try {
      const result = await updatePassword({password,newPassword}).unwrap()
      console.log(result)
      if('error' in result){
        toast.error('Error')
        return
      }
      setPassword('')
      setNewPassword('')
      toast.success('Update Success')
    } catch (error) {
      const resErr = error as ResponseError
      toast.error(resErr.data?.message || 'Failed to update password')
    }
  }

  const handleForgotPassword = async () => {
    try {
      const result = await forgotPassword({email: user?.email}).unwrap()
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

  useEffect(() => {
    setEmail(user?.email || '')
    setName(user?.name || '')
  },[user])
  return (
        <div className='w-full'>
          <h2 className='mb-6 font-semibold text-xl'>Update Name</h2>
          <form onSubmit={handleSubmit} className='mb-16'>
            <div className='mb-8'>
              <label htmlFor="email">Email</label>
              <br/>
              <input type="email" id='email' value={email} readOnly required className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full text-gray-400' />
            </div>
            <div className='mb-8'>
              <label htmlFor="name">Name</label>
              <br/>
              <input type="text" id='name' value={name} onChange={(e) => setName(e.target.value)} required className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full' />
            </div>
            <SubmitButton isLoading={isLoading} title='Submit' />

          </form>

          <h2 className='mb-6 font-semibold text-xl'>Update Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className='flex flex-col mb-8'>
              <label htmlFor="password" className='mb-3 text-[15px]'>
                  Password 
              </label>
              <div className='relative'>
                  <input type={showPassword ? 'text' : "password"} name='password' value={password} onChange={(e) => setPassword(e.target.value)} id='password'  className='py-2 px-4 w-full focus:outline-none border-[1px] border-[#ccc] rounded'  />
                  <span className='cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]'
                  onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <IoEyeOffOutline className="text-lg"/> : <IoEyeOutline  className="text-lg"/>}
                  </span>
              </div>
            </div>
            <div className='flex flex-col mb-8 '>
              <label htmlFor="newpassword" className='mb-3 text-[15px]'>
                  New Password 
              </label>
              <div className='relative'>
                  <input type={showPassword ? 'text' : "password"} name='newpassword' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} id='newpassword'  className='py-2 px-4 w-full focus:outline-none border-[1px] border-[#ccc] rounded'  />
                  <span className='cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]'
                  onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <IoEyeOffOutline className="text-lg"/> : <IoEyeOutline  className="text-lg"/>}
                  </span>
              </div>
            </div>
            <button type='button' onClick={() => handleForgotPassword()} disabled={forgetPassLoading} className='disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none mb-8 text-sm text-blue-600 cursor-pointer border-b border-blue-600 max-w-fit'>Forget Password?</button>
            <SubmitButton isLoading={passLoading} title='Submit' />
          </form>
        </div>
  )
}

export default AccountSetting