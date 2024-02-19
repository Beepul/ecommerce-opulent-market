import React from 'react'
import animationData from '../assets/animations/loading.json'
import Lottie from 'lottie-react'

type SubmitButtonProps = {
    isLoading: boolean;
    title: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({isLoading,title}) => {
  return (
    <>
        <button type='submit' disabled={isLoading} className='btn-primary px-4 w-full md:w-auto disabled:cursor-not-allowed disabled:opacity-[1]'>
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
              <span className='text-white'>{title}</span>
            )}
        </button>
    </>
  )
}

export default SubmitButton