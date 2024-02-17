import { services } from '../../static/menu'
import SectionTitle from '../admin/SectionTitle'
import { useGetProductsQuery } from '../../redux/services/productApi'
import ProductSlider from '../../components/products/ProductSlider'
import { Skeleton } from '@mui/material'
import CategorySlider from '../../components/CategorySlider'
import { useGetAllCategoryQuery } from '../../redux/services/categoryApi'
import { useGetBestSellingProductQuery, useTopCategoriesQuery } from '../../redux/services/statsApi'
import { Product } from '../../type/product'
import OfferCounter from '../../components/OfferCounter'
import dayjs from 'dayjs'
import BannerSlider from '../../components/BannerSlider'

type TopCatType = {
  _id: string;
  totalSales: number;
  categoryId: string[];
  categoryName: string;
  categoryImage: {
    public_id: string;
    url: string;
  }
}

const Home = () => {
  const {data,isLoading} = useGetProductsQuery({page: 1, perPage: 10})
  const {data:catDatas, isLoading: catLoading} = useGetAllCategoryQuery('')
  const {data: bestSellingProductData, isLoading: bestSellingLoading} = useGetBestSellingProductQuery('')
  const {data: catData, isLoading: topCatLoading} = useTopCategoriesQuery('')

  const {data: offerProducts, isLoading: offerLoading} = useGetProductsQuery({isOffered: true})

  // const offProd = [
  //   {
  //     offer: {
  //       isOffered: true,
  //       offerStartDate: '2024-02-14T18:15:00.000Z',
  //       offerEndDate: '2024-02-30T18:15:00.000Z'
  //     },
  //     _id: '65a3883f890e339579eb8c3e',
  //     name: 'Luxury Watche',
  //     description: 
  //       'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. ',
  //     price: 3000,
  //     discountPercentage: 10,
  //     images: [
  //       {
  //         public_id: 'seven-shop/lgozi6th3mgnemslnrgt',
  //         url: 
  //           'http://res.cloudinary.com/dpzag6krf/image/upload/v1705230507/seven-shop/lgozi6th3mgnemslnrgt.jpg',
  //         _id: '65a3c0aeb2da32aafc6334a7'
  //       },
  //       {
  //         public_id: 'seven-shop/xe86fvso1qvhdny2jqjo',
  //         url: 
  //           'http://res.cloudinary.com/dpzag6krf/image/upload/v1705230510/seven-shop/xe86fvso1qvhdny2jqjo.jpg',
  //         _id: '65a3c0aeb2da32aafc6334a8'
  //       }
  //     ],
  //     stockQuantity: 11,
  //     category: [
  //       {
  //         image: {
  //           public_id: 'seven-shop/ciqsf2alskn3ohqg3x3o',
  //           url: 
  //             'http://res.cloudinary.com/dpzag6krf/image/upload/v1705207231/seven-shop/ciqsf2alskn3ohqg3x3o.png'
  //         },
  //         _id: '65a0b239d3acde6bc1151fe6',
  //         name: 'Accesories',
  //         __v: 0
  //       },
  //       {
  //         image: {
  //           public_id: 'seven-shop/dhhpmqed7zgmrwarr8em',
  //           url: 
  //             'http://res.cloudinary.com/dpzag6krf/image/upload/v1705032238/seven-shop/dhhpmqed7zgmrwarr8em.png'
  //         },
  //         _id: '65a0ba2dc0c0fa3ab6a647ac',
  //         name: 'Men',
  //         __v: 0
  //       }
  //     ],
  //     reviews: [],
  //     averageRating: 0,
  //     totalQuantitySold: 0,
  //     isFeatured: false,
  //     __v: 2
  //   }
  // ]

  return (
    <main>
      <BannerSlider />
      <section className='border-b border-gray-300 border-t'>
        <div className="container flex items-center md:justify-between justify-center gap-10 py-12 flex-wrap">
          {
            services.map((service,index) => (
              <div key={index} className="flex items-center gap-3 flex-1 min-w-[250px] justify-center sm:justify-start">
                {service.icon}
                <p className='lg:text-xl md:text-lg text-base font-semibold text-gray-600'>
                  {service.title}
                </p>
              </div>
            ))
          }
        </div>
      </section>
      <section className='py-20 border-b border-gray-300'>
        <div className='text-center pb-16'>
          <SectionTitle title="what's new"  />
        </div>
        <div className="container">
          {isLoading ? (
            <div className='flex gap-12'>
                <div className=' flex-1'>
                  <Skeleton variant="rectangular" width={"100%"} height={280} className='mb-5'/>
                  <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                  <Skeleton variant="rectangular" width={"100%"} height={16} />
                </div>
                <div className='sm:block hidden flex-1'>
                  <Skeleton variant="rectangular" width={"100%"} height={280} className='mb-5'/>
                  <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                  <Skeleton variant="rectangular" width={"100%"} height={16} />
                </div>
                <div className='md:block hidden flex-1'>
                  <Skeleton variant="rectangular" width={"100%"} height={280} className='mb-5'/>
                  <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                  <Skeleton variant="rectangular" width={"100%"} height={16} />
                </div>
                <div className='lg:block hidden flex-1'>
                  <Skeleton variant="rectangular" width={"100%"} height={240} className='mb-5'/>
                  <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                  <Skeleton variant="rectangular" width={"100%"} height={16} />
                </div>
            </div>
          ) : (
            <ProductSlider products={data?.products} />
          )}

        </div>
      </section>
      <section className='py-20 border-b border-gray-300'>
        <div className='pb-16 text-center'>
          <SectionTitle title='Top Categories' />
        </div>
        <div className='container'>
          <CategorySlider categories={catData?.topCategories?.slice(0,10).map((c: TopCatType) => {
            return {
              count: c.totalSales,
              name: c.categoryName,
              image: c.categoryImage,
              _id: c._id
            }
          } )} isLoading={topCatLoading} />
        </div>
      </section>
      
      <section className='py-20 border-b border-gray-300'>
        <div className='text-center pb-16'>
          <SectionTitle title="Best Selling Products"  />
        </div>
        <div className="container">
          {bestSellingLoading ? (
            <div className='flex gap-12'>
                <div className=' flex-1'>
                  <Skeleton variant="rectangular" width={"100%"} height={280} className='mb-5'/>
                  <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                  <Skeleton variant="rectangular" width={"100%"} height={16} />
                </div>
                <div className='sm:block hidden flex-1'>
                  <Skeleton variant="rectangular" width={"100%"} height={280} className='mb-5'/>
                  <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                  <Skeleton variant="rectangular" width={"100%"} height={16} />
                </div>
                <div className='md:block hidden flex-1'>
                  <Skeleton variant="rectangular" width={"100%"} height={280} className='mb-5'/>
                  <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                  <Skeleton variant="rectangular" width={"100%"} height={16} />
                </div>
                <div className='lg:block hidden flex-1'>
                  <Skeleton variant="rectangular" width={"100%"} height={240} className='mb-5'/>
                  <Skeleton variant="rectangular" width={"100%"} height={22} className='mb-3' />
                  <Skeleton variant="rectangular" width={"100%"} height={16} />
                </div>
            </div>
          ) : (
            <ProductSlider products={bestSellingProductData?.mostSoldProducts?.map((p: {product?: Product;totalQuantitySold?: number}) => p?.product)} />
          )}

        </div>
      </section>
      {
        offerLoading ? (
          <p>Loading</p>
        ) : (
            offerProducts?.products && dayjs().isBefore(offerProducts.products[0]?.offer?.offerEndDate) && (
              <section className='border-b border-gray-300'>
                <OfferCounter product={offerProducts.products[0]}  />
              </section>
            ) 
        )
      }
      <section className='py-20 border-b border-gray-300'>
        <div className='pb-16 text-center'>
          <SectionTitle title='All Categories' />
        </div>
        <div className='container'>
          <CategorySlider categories={catDatas?.categories?.slice(0,10)} isLoading={catLoading} />
        </div>
      </section>
      
      

    </main>
  )
}

export default Home