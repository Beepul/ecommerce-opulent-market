import Lottie from 'lottie-react'
import React from 'react'
import animationData from '../assets/animations/loading.json'


const Loader = () => {
  return (
    <>
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
    </>
  )
}

export default Loader