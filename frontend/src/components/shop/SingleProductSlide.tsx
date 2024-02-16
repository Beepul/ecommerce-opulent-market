import React, { useEffect, useState } from 'react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import ImageMagnifier from '../ImageMagnifier';
import { Image } from '../../type/product';


type SingleProductSlideProps = {
  images: Image[]
}

const SingleProductSlide: React.FC<SingleProductSlideProps> = ({images}) => {
  const [imageToShow, setImageTOShow] = useState('')

  useEffect(() => {
    if(images){
      setImageTOShow(images[0].url)
    }
  },[images])

  return (
    <div className='w-full'>
      <div className='w-full'>
        <ImageMagnifier imageUrl={imageToShow} />
      </div>
      <div className='flex gap-6 pt-6 flex-wrap'>
        {
          images.map((img,i) => (
            <div key={i} onClick={() =>setImageTOShow(img.url)}>
              <img src={img.url} alt=""  className='lg:h-[140px] h-[100px] w-full object-cover lg:object-contain cursor-pointer' />
            </div>
          ))
        }
      </div>
    </div>
  );
}


export default SingleProductSlide