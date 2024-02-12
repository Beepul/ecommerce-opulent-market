import React from 'react'
import { Product } from '../../type/product'
import { Rating } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type ReviewListProps = {
  product: Product;
}

const ReviewList:React.FC<ReviewListProps> = ({product}) => {

  if(product.reviews.length <= 0){
    return (
      <div className='min-h-[250px] w-full flex items-center justify-center'><p className='capitalize font-medium text-2xl'>Be the first to review “{product.name}”</p></div>
    )
  }
  return (
    <div>
      <ul>
        {
          product.reviews.map((review) => ( 
            <li key={review._id} className='flex gap-4 pb-4 border-b mb-4 last:mb-0 last:pb-0 last:border-0'>
              <div>
                {
                  review.user.pic ? 
                    <LazyLoadImage src={review.user.pic} className='h-[35px] w-[35px] min-w-[35px] rounded-full object-cover' />
                    : <p className='h-[35px] w-[35px] min-w-[35px] bg-primary text-white uppercase flex items-center justify-center'>{review.user.name.split('')[0]}</p>
                }
              </div>
              <div>
                <div>
                  <Rating name="read-only" value={review.rating} size='small' readOnly />
                  <p className='font-semibold text-lg -mt-2'>{review.user.name}</p>
                </div>
                <p className='text-gray-500 text-[15px]'>{review.content}</p>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default ReviewList