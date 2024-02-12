import React from 'react';
import { Product } from '../../type/product';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper/core'; // Update this import statement
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';

// Install Swiper modules
// SwiperCore.use([Navigation]);

type ProductSliderProps = {
  products: Product[];
};

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  return (
    <div>
      <Swiper
        slidesPerView={4}
        spaceBetween={38}
        navigation
        modules={[Navigation]}
        className="mySwiper"
        loop={products.length > 4 ? true : false}
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
            slidesPerView: 4,
          },
        }}
      >
        {products.map((product, i) => (
          <SwiperSlide key={i}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
