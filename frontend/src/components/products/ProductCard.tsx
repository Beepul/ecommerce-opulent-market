import React from 'react'
import { Product } from '../../type/product'
import { FiShoppingCart } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cartSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css'



type ProductCardProps = {
    product: Product
}

const ProductCard:React.FC<ProductCardProps> = ({product}) => {

    const dispatch = useDispatch()

    const afterDiscountPrice = (price:number,discount:number) => {
    
        const discountDecimal = Number(discount) / 100;
        const discountedPrice = Number(price) * discountDecimal;

        const afterDiscountPrice = Number(price) - Number(discountedPrice)
    
        return afterDiscountPrice
      }

    const handleAddToCart = () => {
        if(product.discountPercentage !== null && product.discountPercentage > 0){
            dispatch(addToCart({...product,afterDiscountPrice: afterDiscountPrice(product.price,product.discountPercentage)}))
        }else{
            dispatch(addToCart({...product,afterDiscountPrice: product.price}))
        }
    }
  return (
    <div>
        <div className='relative h-[320px]'>
            {product.images.length > 1 ? (
                <>
                    <span className='absolute h-full w-full inline-block hover:opacity-0 opacity-100 transition-all duration-500'>
                        <LazyLoadImage src={product.images[product.images.length - 1].url} alt={product.name} effect='blur' height={'100%'} width={'100%'} className='max-h-full h-full object-cover'/>
                    </span>
                    <span className='absolute h-full w-full inline-block opacity-0 hover:opacity-100 transition-all duration-500'>
                        <LazyLoadImage src={product.images[product.images.length - 2].url} alt={product.name} effect='blur' height={'100%'} width={'100%'}  className='max-h-full h-full object-cover' />
                    </span>
                </>
            ): (
                <span className='absolute h-full w-full inline-block'>
                    <LazyLoadImage src={product.images[0].url} alt={product.name} effect='blur' height={'100%'} width={'100%'} className='max-h-full h-full object-cover'/>
                </span>
            )}
            <span 
            onClick={handleAddToCart}
            className='absolute bottom-3 right-3 z-20 bg-white flex items-center justify-center w-9 h-9 rounded-full cursor-pointer group shadow-xl'>
                <FiShoppingCart className="group-hover:scale-[1.2] group-hover:stroke-primary transition-all duration-500" />
            </span>
        </div>
        <div className='py-4'>
            <Link to={`/product/${product._id}`}>
                <h5 className='text-base font-semibold capitalize'>
                    {product.name}
                </h5>
            </Link>
            <div className='mb-2'>
                {
                (product.discountPercentage === null || product.discountPercentage <= 0) ? (
                    <p className='text-[15]'>${product.price}</p>
                ) : (
                    <div className='flex items-end gap-2'>
                    <p className='text-[15] '>${afterDiscountPrice(product.price,product.discountPercentage)}</p>
                    <del className='text-[15] text-gray-400'>${product.price}</del>
                    </div>
                )
                }
            </div>
            <Rating name="read-only" value={product.averageRating} readOnly />
        </div>
    </div>
  )
}

export default ProductCard