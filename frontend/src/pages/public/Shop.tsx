import React, { useEffect, useState } from 'react'
import ShopSideBar from '../../components/shop/ShopSideBar'
import ShopBody from '../../components/shop/ShopBody'
import { useGetProductsQuery } from '../../redux/services/productApi'
import { useSearchParams } from 'react-router-dom'
import { Pagination } from '@mui/material'

type RequestDataType = {
  category: string[],
  rating: number | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  sortBy?: string,
  search?: string | null, 
  page?: number,
  perPage?: number,
}


let productsPerPage = 6

const initialState = {
  category: [],
  rating: null,
  minPrice: null,
  maxPrice: null,
  sortBy: '',
  page: 0,
  perPage: productsPerPage,
}

const Shop = () => {

  const [totalPage,setTotalPage] = useState(1)
  const [page, setPage] = useState(0);
  const [requestData,setRequestData] = useState<RequestDataType>(initialState)
  const [selectedCat,setSelectedCat] = useState<string[]>([])
  const [ratingValue, setRatingValue] = React.useState<number | null>(null);
  const [priceRange,setPriceRange] = useState([0, 1700])
  const [sortBy,setSortBy] = useState<string>('')

  const [searchParams] = useSearchParams()


  const {data:pData,isLoading:pLoading,refetch} = useGetProductsQuery(requestData)


  useEffect(() => {
    const catQuery = searchParams.get('catQuery')
    if(catQuery) setSelectedCat([catQuery])
  },[searchParams])

  useEffect(() => {
    setRequestData({
      ...requestData,
      category: selectedCat,
      rating: ratingValue,
      search: searchParams.get('search'),
      page: page,
      perPage: productsPerPage
    })
  },[selectedCat,ratingValue,searchParams,page])

  useEffect(() => {
    refetch()
  },[requestData])



  useEffect(() => {
    if (!pLoading && pData) {
      const totalProduct = pData?.count || 1;
      setTotalPage(Math.ceil(totalProduct / productsPerPage));
      if (pData.minPrice !== undefined && pData.maxPrice !== undefined) {
        setPriceRange([pData.minPrice, pData.maxPrice]);
      }
    }
  }, [pLoading, pData]);
  


  const onPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };
 

  return (
    <section className='py-11'>
      <div className="container flex gap-12">
        <aside className='flex-1 max-w-[250px] hidden lg:flex flex-col gap-8'>
          <ShopSideBar 
            setSelectedCat={setSelectedCat} 
            setRatingValue={setRatingValue} 
            ratingValue={ratingValue} 
            setPriceRange={setPriceRange}
            priceRange={priceRange}
            setRequestData={setRequestData}
            requestData={requestData}
            productsPerPage={productsPerPage}
            setPage={setPage}
            minPrice={pData?.minPrice}
            maxPrice={pData?.maxPrice}
          />
        </aside>
        <main className='flex-1 '>
          <ShopBody 
            products={pData?.products} 
            isLoading={pLoading} 
            sortBy={sortBy}
            setSortBy={setSortBy}
            setRequestData={setRequestData} 
            requestData={requestData}
            setSelectedCat={setSelectedCat}
            setRatingValue={setRatingValue} 
            ratingValue={ratingValue} 
            setPriceRange={setPriceRange}
            priceRange={priceRange}
            productsPerPage={productsPerPage}
            setPage={setPage}
            minPrice={pData?.minPrice}
            maxPrice={pData?.maxPrice}
          />

          {
            totalPage > 1 && (
              <section className='flex justify-center mb-12'>
                <Pagination count={totalPage} page={page + 1} onChange={onPageChange} />
              </section>
            )
          }
        </main>
      </div>
    </section>
  )
}

export default Shop