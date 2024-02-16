import logo from '../../assets/ss-logo.svg'
import paymentIcon from '../../assets/Payment-method.png'
import { socialList } from '../../static/menu'
import { useGetBestSellingProductQuery, useTopCategoriesQuery } from '../../redux/services/statsApi'
import { TopCategory } from '../../type/category'
import { Skeleton } from '@mui/material'
import { BestSellingProduct } from '../../type/product'
import { Link } from 'react-router-dom'

const Footer = () => {
  const {data: catData,isLoading: topcatLoading} = useTopCategoriesQuery('')

  const {data: topProductData, isLoading: topProductLoading} = useGetBestSellingProductQuery('')


  return (
    <footer className='bg-bgGray'>
      <section className='py-16'>
        <div className="container flex justify-between gap-11 lg:flex-nowrap flex-wrap">
          <div className='flex-1 min-w-[250px]'>
            <img src={logo} alt="ss" className='max-w-[180px] mb-8'/>
            <p className='mb-5 text-[15px]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores iure quibusdam impedit provident obcaecati fugiat suscipit nulla et quo autem, corrupti blanditiis ratione animi.</p>
            <ul className='flex items-center gap-2'>
              {socialList.map((icon,i) => (
                <li key={`social-${i}`} className='h-[34px] min-w-[34px] rounded-full border-[1px] border-[#ccc] flex items-center justify-center '>{icon}</li>
              ))}
            </ul>
          </div>
          <div className='flex-1 min-w-[150px]'>
            <h2 className='text-2xl font-semibold mb-8 mt-2'>Top Categories</h2>
            <ul>
              {
                topcatLoading ? (
                    Array.from([1, 2, 3,4,5]).map((_,i) => (
                      <li key={i} className='text-[15px] mb-1 cursor-pointer hover:text-primary transition-all duration-300 capitalize'>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </li>
                    ))
                   ) : (
                    catData?.topCategories && catData.topCategories.slice(0,5).map((cat: TopCategory, i: number) => (
                    <li key={i} className='text-[15px] mb-1 cursor-pointer hover:text-primary transition-all duration-300 capitalize'>
                      <Link className='capitalize' to={`/shop?catQuery=${cat?._id}`}>
                        {cat.categoryName}
                      </Link>

                    </li>
                  ))
                )
              }
            </ul>
          </div>
          <div className='flex-1 min-w-[150px]'>
            <h2 className='text-2xl font-semibold mb-8 mt-2'>Best Selling</h2>
            <ul>
              {
                topProductLoading ? (
                  <li className='text-[15px] mb-1 cursor-pointer hover:text-primary transition-all duration-300'>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  </li>
                ) : (
                  topProductData?.mostSoldProducts && topProductData.mostSoldProducts.slice(0,5).map((bestProd: BestSellingProduct) => (
                    <li key={bestProd.product._id} className='text-[15px] mb-1 cursor-pointer hover:text-primary transition-all duration-300'>
                      <Link className='capitalize' to={`/product/${bestProd.product._id}`}>
                        {bestProd.product.name}
                      </Link>
                    </li>
                  ))
                )
              }
            </ul>
          </div>
          <div className='flex-1 min-w-[150px]'>
            <h2 className='text-2xl font-semibold mb-8 mt-2'>Quick Links</h2>
            <ul>
              <li className='text-[15px] mb-1 cursor-pointer hover:text-primary transition-all duration-300'>
                <Link to={'/'}>Home</Link>
              </li>
              <li className='text-[15px] mb-1 cursor-pointer hover:text-primary transition-all duration-300'>
                <Link to={'/shop'}>Shop</Link>
              </li>
            </ul>
          </div>
          
        </div>
      </section>
      <section className='py-5 border-[1px] border-t-[#ccc]'>
        <div className="container flex justify-between items-center gap-4 flex-col sm:flex-row">
          <span className='flex-1 text-sm text-center sm:text-start'>© Copyright 2023 Beepul Magar. All rights reserved.</span>
          <span className='flex-1 flex items-center justify-end text-sm gap-6 flex-wrap'>
            We accept: 
            <img src={paymentIcon} className='sm:max-w-[250px] max-w-[150px]' />
          </span>
        </div>
      </section>
    </footer>
  )
}

export default Footer