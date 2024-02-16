import React, { useState } from 'react'
import { Product } from '../../type/product'
import { Rating } from '@mui/material';
import SubmitButton from '../SubmitButton';
import { useCreateReviewMutation } from '../../redux/services/reviewApi';
import { toast } from 'react-toastify';
import { ResponseError } from '../../type/error';

type ReviewProps = {
  product: Product;
}

const Review: React.FC<ReviewProps> = ({product}) => {
  const [ratingVal, setRatingVal] = React.useState<number | null>(0);
  const [content,setContent] = useState('')

  const [createReview, {isLoading}] = useCreateReviewMutation()

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(!ratingVal || !content || !product){
      toast.error('All Feilds Required!')
      return
    }
    const reviewData = {
      productId: product._id,
      rating: ratingVal,
      content
    }
    try {
      const result = await createReview(reviewData).unwrap()
      console.log(result)
      if('error' in result){
        toast.error('Cannot Submit Review At The Moment')
        return
      }
      toast.success('Successfully Submitted Your Review')
      setRatingVal(0)
      setContent('')
    } catch (error) {
      const resError = error as ResponseError
      toast.error(resError.data?.message || 'Error while submiting review')
    }

  }
  return (
    <div>
      <h5 className='font-semibold text-2xl mb-4'>Leave A Review For {product.name}</h5>
      <div className='flex items-center gap-2 font-medium mb-4'>
        <p>Your Rating: </p>
        <Rating
          name="simple-controlled"
          value={ratingVal}
          onChange={(_, newValue) => {
            setRatingVal(newValue);
          }}
        />
      </div>
      <form onSubmit={handleReviewSubmit}>
        <p className='mb-4'>
          <label htmlFor="content" className='font-medium'>Your Review*</label><br />
          <textarea id='content' onChange={(e) => setContent(e.target.value)} value={content} className='w-full border-2 border-gray-300 rounded-md focus:outline-none py-2 px-3 min-h-[150px] mt-4' />
        </p>
        <SubmitButton isLoading={isLoading} title='Submit' />
      </form>

    </div>
  )
}

export default Review