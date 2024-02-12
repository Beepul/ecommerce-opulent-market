import React from 'react'
import { Product } from '../../type/product'
import ProductCard from './ProductCard'

type ShopProductListProps = {
  products: Product[]
}

const ShopProductList:React.FC<ShopProductListProps> = ({products}) => {
  // console.log(products)
  return (
    <>
      {products?.length <= 0 ? (
        <div className='flex items-center justify-center flex-col h-full min-h-[500px]'>
          <h2>No Products Availabel Right Now</h2>
        </div>
      ): (
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
          {products?.map((product) => (
            <ProductCard product={product} key={product.name} />
          ))}
        </div>
      )}
    </>
  )
}

export default ShopProductList