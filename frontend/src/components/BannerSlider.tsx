import { bannerData } from '../static/data'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'


const BannerSlider = () => {
  return (
    <section className='bannerSwiper'>
        <Swiper
            slidesPerView={1}
            spaceBetween={0}
            navigation
            modules={[Navigation,Autoplay]}
            className="mySwiper lg:min-h-[650px]"
            loop={true}
            speed={4000}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
        >
            {
                bannerData.map((item,i) => (
                    <SwiperSlide key={i}>
                        <main className='relative '>
                            <LazyLoadImage src={item.img} effect='blur' width={'100%'} height={'100%'} className='w-full max-h-[650px] object-cover min-h-[450px]' />
                            <div className="container absolute inset-0 h-full flex flex-col justify-center">
                                <div className='max-w-[800px]'>
                                    <h1 className={`${i === 1 ? 'text-gray-800' : 'text-white'}  font-semibold md:text-5xl  sm:text-4xl text-3xl mb-4`}>{item.title}</h1>
                                    <p className={`${i === 1 ? 'text-gray-800' : 'text-white'} md:text-xl text-lg mb-8`}>{item.description}</p>
                                    <Link to={'/shop'} className='text-white bg-primary py-3 px-8 inline-block rounded-md'>{item.btnLabel}</Link>
                                </div>
                            </div>
                        </main>
                    </SwiperSlide>
                ))
            }
        </Swiper>
      </section>
  )
}

export default BannerSlider