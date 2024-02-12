import { useEffect, useState } from 'react'
import SingleProductSlide from '../components/shop/SingleProductSlide'
import { useParams } from 'react-router-dom'
import { useGetProductsQuery, useGetSingleProductQuery } from '../redux/services/productApi'
import { Product } from '../type/product'
import Loader from '../components/Loader'
import { Category } from '../type/category'
import ProductSlider from '../components/products/ProductSlider'
import { FiShoppingCart } from "react-icons/fi";
import Review from '../components/review/Review'
import ReviewList from '../components/review/ReviewList'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/features/cartSlice'
import { Rating } from '@mui/material'



const SingleProduct = () => {
  const [active,setActive] = useState(1)
  const [category,setCategory] = useState([])
  const {id} = useParams()

  const dispatch = useDispatch()

  const {data, isLoading,isError} = useGetSingleProductQuery(id)

  const {relatedProducts,relatedLoading} = useGetProductsQuery({category},{
    selectFromResult: ({data,isLoading}) => ({
      relatedProducts: data?.products?.filter((p:Product) => p._id !== id),
      relatedLoading: isLoading
    })
  })


  const afterDiscountPrice = (price:number,discount:number) => {
    
    const discountDecimal = Number(discount) / 100;
    const discountedPrice = Number(price) * discountDecimal;

    return discountedPrice
  }

  const handleAddToCart = (product: Product) => {
    if(product.discountPercentage !== null && product.discountPercentage > 0){
        dispatch(addToCart({...product,afterDiscountPrice: afterDiscountPrice(product.price,product.discountPercentage)}))
    }else{
        dispatch(addToCart({...product,afterDiscountPrice: product.price}))
    }
  }

  useEffect(() => {
    if(data){
      const categories:[] = data?.product?.category?.map((c:Category) => c._id)
      setCategory(categories)
    }
  },[data])


  if(isLoading || relatedLoading){
    return (
      <div className='min-h-[500px] flex items-center justify-center'>
        <Loader />
      </div>
    )
  }

  if(isError){
    return (
      <div>
        Something Went Wrong!
      </div>
    )
  }

  return (
    <div>
      <div className='container flex gap-16 py-16 lg:flex-row flex-col'>
        <div className='lg:w-[60%]'>
          <SingleProductSlide images={data.product.images} />
        </div>
        <div>
          <h2 className="text-3xl font-bold capitalize mb-2">{data.product.name}</h2>
          <div className='mb-8'>
            {
              (data.product.discountPercentage === null || data.product.discountPercentage <= 0) ? (
                <p className='text-xl font-semibold'>${data.product.price}</p>
              ) : (
                <div className='flex items-end gap-2'>
                  <p className='text-xl font-semibold'>${afterDiscountPrice(data.product.price,data.product.discountPercentage)}</p>
                  <del className='text-md font-semibold text-gray-400'>${data.product.price}</del>
                </div>
              )
            }

          </div>
          {data.product.discountPercentage > 0 && (
              <p className='mb-2'>
                <strong className='mr-2'>
                  Discount:
                </strong>
                {data.product.discountPercentage} %
              </p>
          )}
          <div className='mb-2'>
            <strong className='mr-2'>Category:</strong>
            {
              data.product.category.map((c:Category,i: number) => (
                <span key={i} className='capitalize'>{c.name}</span>
              ) )
            }
          </div>
          <div className='mb-2 flex'>
            <p className='flex-1'>
              <strong className='mr-2'>Stock:</strong>
              {data.product.stockQuantity <= 0 ? 'Out of Stock' : data.product.stockQuantity}
            </p>
            {data.product.totalQuantitySold > 0 && (
              <p className='flex-1'>
                <strong className='mr-2'>Total Qnty Sold:</strong>
                {data.product.totalQuantitySold}
              </p>
            )}
          </div>
          <p className='flex'>
            <strong className='mr-2'>Rating:</strong>
            <Rating name="read-only" value={data.product.averageRating} size='small' readOnly className='mt-1'/>
            {/* <span className="ratings">
                <span className="star-rating" style={{ "--rating": data.product.averageRating } as React.CSSProperties}></span>
            </span> */}
          </p>
          <button className='btn-primary mt-8 px-4 flex items-center gap-2 ' onClick={() => handleAddToCart(data.product)}>Add To Cart <FiShoppingCart className="stroke-white text-xl" /></button>
          <p className='mt-8'>{data.product.description}</p>
        </div>
      </div>
      <div className='container border-2 px-12 pb-16 mb-8 '>
        <div className='flex mb-8 border-b-2'>
          <button 
            onClick={() => setActive(1)}
            className={`flex-1 py-8 hover:text-primary transition-all duration-300 ${active === 1 ? 'text-primary border-b border-primary' : ''}`}>All Reviews</button>
          <button 
            onClick={() => setActive(2)}
            className={`flex-1 py-8 hover:text-primary transition-all duration-300 ${active === 2 ? 'text-primary border-b border-primary' : ''}`}>Leave Reviews</button>
        </div>
        { active === 1 ? <ReviewList product={data.product} /> : <Review product={data?.product} /> } 
      </div>
      {
        relatedProducts?.length > 0 && (
          <div className='container py-12'>
            <h2 className='text-2xl font-semibold mb-6'>Products You May Like</h2>
            {
              relatedLoading ? (
                <div className='min-h-[200] flex items-center justify-center'>
                  <Loader />
                </div>
              ): (
                <ProductSlider products={relatedProducts} />
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default SingleProduct