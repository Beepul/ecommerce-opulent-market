import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import {Swiper as SwiperType} from 'swiper/types'


// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import ImageMagnifier from '../ImageMagnifier';
import { Image } from '../../type/product';


// const images = [
//   {
//     src: "https://picsum.photos/320/240?v1"
//   },
//   {
//     src: "https://picsum.photos/320/240?v2"
//   },
//   {
//     src: "https://picsum.photos/320/240?v3"
//   },
//   {
//     src: "https://picsum.photos/320/240?v4"
//   },
//   {
//     src: "https://picsum.photos/320/240?v4"
//   }
// ];

type SingleProductSlideProps = {
  images: Image[]
}

const SingleProductSlide: React.FC<SingleProductSlideProps> = ({images}) => {
  const [imageToShow, setImageTOShow] = useState('')


  const handleImageSelection = (src: string) => {
    setImageTOShow(src)
  }

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