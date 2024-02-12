import { useState } from 'react'
import { IoEyeOutline,IoEyeOffOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../../redux/services/authApi';
import { ResponseError } from '../../type/error';
import animationData from '../../assets/animations/loading.json';
import Lottie from 'lottie-react'

const initialFormData = {
  name: '',
  email: '',
  password: '',
  cPassword: '',
}

const Register = () => {
  const [formData,setFormData] = useState(initialFormData)
  const [showPassword,setShowPassword] = useState(false)

  const [register,{isLoading}] = useRegisterMutation()

  const {name,email,password,cPassword} = formData

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()

    if(!name || !email || !password || !cPassword){
      toast.error('All Feilds Required !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    if(password !== cPassword){
      toast.error('Password Do Not Match !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    try {
      await register({name,email,password}).unwrap()
      toast.success('Activation Link Sent, Please Check Your Mail', {
        position: "top-right"
      });
    } catch (error) {
      const resError = error as ResponseError
      toast.error(resError.data.message, {
        position: "top-right"
      });
    }
  }

  
  return (
    <>
      <h4 className='font-semibold text-[20px] mb-6'>Register</h4>
      <form onSubmit={handleSubmit}>
          <div className='flex flex-col mb-4'>
              <label htmlFor="fullname" className='mb-3 text-[15px]'>
                  Full Name *
              </label>
              <input type="text" value={name} id='fullname' name='name' onChange={handleChange} className='py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
          <div className='flex flex-col mb-4'>
              <label htmlFor="r-email" className='mb-3 text-[15px]'>
                  Email address *
              </label>
              <input type="email" value={email} id='r-email' name='email' onChange={handleChange} className='py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
          <div className='flex flex-col mb-4'>
              <label htmlFor="r-password" className='mb-3 text-[15px]'>
                  Password *
              </label>
              <div className='relative'>
                  <input type={showPassword ? 'text' : "password"} name="password" value={password} id='r-password' onChange={handleChange}  className='py-2 px-4 w-full focus:outline-none border-[1px] border-[#ccc] rounded'  />
                  <span className='cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]'
                  onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <IoEyeOffOutline className="text-lg"/> : <IoEyeOutline  className="text-lg"/>}
                  </span>
              </div>
          </div>
          <div className='flex flex-col mb-4'>
              <label htmlFor="r-c-password" className='mb-3 text-[15px]'>
                  Confirm Password *
              </label>
              <div className='relative'>
                  <input type={showPassword ? 'text' : "password"} value={cPassword} id='r-c-password' name='cPassword' onChange={handleChange}  className='py-2 px-4 w-full focus:outline-none border-[1px] border-[#ccc] rounded'  />
                  <span className='cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]'
                  onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <IoEyeOffOutline className="text-lg"/> : <IoEyeOutline  className="text-lg"/>}
                  </span>
              </div>
          </div>
          <button type='submit' disabled={isLoading} className='btn-primary mt-3 disabled:cursor-not-allowed disabled:opacity-[1]'>
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
              'Register'
            )}
          </button>
      </form>
    </>
  )
}

export default Register