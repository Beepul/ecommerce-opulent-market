import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

type ImageMagnifierProps = {
  imageUrl: string;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({imageUrl}) => {

  const [position, setPosition] = useState({x: 0, y: 0});
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});


  const handleMouseHover = (e: React.MouseEvent) => {
    const { left, top, width, height} = e.currentTarget.getBoundingClientRect()

    const x = ((e.pageX - left) / width) * 100
    const y = ((e.pageY - top) / height) * 100
    setPosition({x,y})

    setCursorPosition({x: e.pageX - left, y: e.pageY - top})

  }
  return (
    <div className='relative'
    onMouseEnter={() => setShowMagnifier(true)}
    onMouseLeave={() => setShowMagnifier(false)}
    onMouseMove={handleMouseHover}
    >
      <LazyLoadImage effect='blur' src={imageUrl} alt="Seven Shop" 
        className='w-full lg:min-w-[450px] lg:h-[450px] sm:h-[550px] min-h-[450px] mb-8 lg:mb-0 object-cover' />

        {showMagnifier && (
          <div
          className={`absolute pointer-events-none z-10`}
          style={{
            left: `${cursorPosition.x - 100 }px`,
            top: `${cursorPosition.y - 150}px`
          }}
          >
            <div
            className='w-[200px] h-[200px] border-2 border-white rounded-full'
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: `${position.x + 3}% ${position.y - 40}%`,
              backgroundSize: 800,
            }}
            />
          </div>
        )}
    </div>
  )
}

export default ImageMagnifier