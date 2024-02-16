import { useState, useEffect } from 'react';
import { Product } from '../type/product';
import dayjs from 'dayjs';
import {LazyLoadImage} from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom';

const OfferCounter = ({ product }: { 
  product: Product ;
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    // Calculate the time remaining in seconds
    const currentTime = dayjs();
    const endTime = dayjs(product.offer.offerEndDate);
    const remainingTime = Math.max(0, endTime.diff(currentTime, 'seconds'));

    // Update the time remaining in the state
    setTimeRemaining(remainingTime);

    // Update the time every second
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [product]);

  

  // Format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return {hours,minutes,seconds:remainingSeconds};
  };

  const afterDiscountPrice = (price:number,discount:number) => {
    
    const discountDecimal = Number(discount) / 100;
    const discountedPrice = Number(price) * discountDecimal;

    return discountedPrice
  }


  return (
    <>
      {timeRemaining > 0 ? (
        <div className='bg-primary'>
          <div className='container flex items-center justify-between py-20 flex-col gap-12 lg:flex-row'>
            <div>
              <p className='font-semibold text-white text-3xl mb-4'>Offer ends in:</p> 
              <div className='flex flex-wrap'>
                <span className='min-w-[250px] flex-1 sm:h-[250px] py-10 flex items-center justify-center flex-col text-xl font-semibold bg-white border border-gray-300 '><span className='text-center text-4xl font-bold'>{formatTime(timeRemaining).hours}</span>  Hours</span>
                <span className='min-w-[250px] flex-1 sm:h-[250px] py-10 flex items-center justify-center flex-col text-xl font-semibold bg-white border border-gray-300 '><span className='text-center text-4xl font-bold'>{formatTime(timeRemaining).minutes}</span> Minutes</span>
                <span className='min-w-[250px] flex-1 sm:h-[250px] py-10 flex items-center justify-center flex-col text-xl font-semibold bg-white border border-gray-300 '><span className='text-center text-4xl font-bold'>{formatTime(timeRemaining).seconds}</span> Seconds</span>
              </div>
            </div>
            <div className='bg-gray-300 h-fit'>
              <LazyLoadImage src={product.images[0].url} className='md:w-[305px] w-full' />
              <div className='py-6'>
                <h3 className='text-3xl font-semibold capitalize text-center text-white'>
                  <Link to={`/product/${product._id}`}>{product.name}</Link>
                </h3>
                {
                (product.discountPercentage === null || product.discountPercentage <= 0) ? (
                    <p className='text-[18px] text-center mt-2 w-full font-semibold'>${product.price}</p>
                ) : (
                    <div className='flex items-end gap-2 justify-center mt-2'>
                      <p className='text-[18px]  font-semibold'>${afterDiscountPrice(product.price,product.discountPercentage)}</p>
                      <del className='text-[18px] text-gray-400 font-semibold'>${product.price}</del>
                    </div>
                )
                }
              </div>
            </div>
          </div>
          </div>
      ) : (
        <div>Offer has ended!</div>
      )}
    </>
  );
};

export default OfferCounter;
