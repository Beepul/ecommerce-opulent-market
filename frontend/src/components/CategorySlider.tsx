import React from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Category } from '../type/category'
import { Skeleton } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'


const CategorySlider = ({categories, isLoading}: {categories: Category[]; isLoading: boolean}) => {

  return (
    <>
        <Swiper
            slidesPerView={6}
            spaceBetween={38}
            navigation
            modules={[Navigation]}
            className="mySwiper"
            loop={categories?.length > 6 ? true : false}
            breakpoints={{
            0: {
                slidesPerView: 1
            },
            545: {
                slidesPerView: 2,
            },
            757: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 6,
            },
            }}
        >
          {
            isLoading ? (
              Array.from(new Array(10)).map((item,i) => (
                <SwiperSlide key={i}>
                  <div className='w-full'>
                    <Skeleton variant="rectangular" width={"100%"} height={180} className='mb-5'/>
                    <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                    <Skeleton variant="rectangular" width={"100%"} height={16} />
                  </div>
                </SwiperSlide>
              ))
            ) : (
                categories.map((cat) => (
                  <SwiperSlide key={cat._id}>
                    <div>
                      <div className=''>
                        <LazyLoadImage src={cat.image?.url} alt={cat.name} effect='blur' height={160} width={'100%'}  className='object-contain h-full'/>
                      </div>
                      <h4 className='w-full text-center mt-8 pb-1 font-semibold capitalize text-lg'>{cat.name}</h4>
                      <span className='text-center inline-block w-full'>{cat.count ? cat.count : 0} Products</span>
                    </div>
                  </SwiperSlide>
                ))
            )
          }
      </Swiper>
    </>
  )
}

export default CategorySlider