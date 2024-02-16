import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../redux/features/cartSlice'
import animationData from '../../assets/animations/success.json'
import Lottie from 'lottie-react'

const Success = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearCart())
  },[])
  return (
    <div className='min-h-[500px] flex items-center justify-center flex-col'>
      <h2 className='text-xl text-center font-semibold'>Order Successful 🎉 </h2>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
        }}
        width={300}
        height={300}
        style={{maxHeight:'300px', maxWidth: '300px'}}
        />
    </div>
  )
}

export default Success