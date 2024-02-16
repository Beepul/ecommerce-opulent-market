import React from 'react'
// import { categories } from '../../static/categories'
import { Rating, Slider } from '@mui/material'
import { useGetAllCategoryQuery } from '../../redux/services/categoryApi';
import { Category } from '../../type/category';

type RequestDataType = {
  category: string[];
  rating: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  page?: number;
  perPage?: number;
}

type ShopSideBarProps = {
  setSelectedCat: React.Dispatch<React.SetStateAction<string[]>>;
  setRatingValue: React.Dispatch<React.SetStateAction<number | null>>;
  ratingValue: number | null;
  priceRange: number[];
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  setRequestData: React.Dispatch<React.SetStateAction<RequestDataType>>;
  requestData: RequestDataType;
  productsPerPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  minPrice: number;
  maxPrice: number;
}

const minDistance = 10;

const ShopSideBar:React.FC<ShopSideBarProps> = ({
  setSelectedCat,
  setRatingValue,
  ratingValue,
  setPriceRange,
  priceRange,
  setRequestData,
  requestData,
  productsPerPage,
  setPage,
  minPrice,
  maxPrice
}) => {
  
  

  const {data: catData} = useGetAllCategoryQuery('getALlCategory')
  

  const handlePriceSlider = (_: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPriceRange([Math.min(newValue[0], priceRange[1] - minDistance), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(newValue[1], priceRange[0] + minDistance)]);
    }
  };

  const filterbyPrice = () => {
    setRequestData({...requestData,minPrice: priceRange[0],maxPrice: priceRange[1],page: 1} )
  }

  const resetFilters = () => {
    setPriceRange([minPrice,maxPrice])
    setRequestData({
      category: [],
      rating: null,
      minPrice: null,
      maxPrice: null,
      page: 1,
      perPage: productsPerPage
    })
  }

  function valuetext(value: number) {
    return `${value}°C`;
  }


  return (
    <>
      <h4 className='font-semibold mt-4 mb-2 lg:mt-0 lg:mb-0'>Category</h4>
      <div className='mb-4 max-h-[250px] overflow-y-auto category__container'>
        <ul>
          <li onClick={() => setSelectedCat([])}
          className=' border-b-[1px] py-3 border-[#ccc] cursor-pointer hover:bg-bgGray hover:pl-4 hover:text-primary transition-all duration-300 capitalize'
          >All</li>
          {catData?.categories?.map((cat: Category,i: number) => (
            <li key={`category-${i}`} 
            onClick={()=> {
              setSelectedCat([cat._id])
              setPage(1)
            }}
            className=' border-b-[1px] py-3 border-[#ccc] cursor-pointer hover:bg-bgGray hover:pl-4 hover:text-primary transition-all duration-300 capitalize'>{cat.name}</li>
          ))}
        </ul>
      </div>
      <div className='mb-4 pb-4 border-b-[1px] border-[#ccc]'>
        <h4 className='font-semibold mb-4'>Rating</h4>
        <Rating
          name="simple-controlled"
          value={ratingValue}
          color='yellow'
          onChange={(_, newValue) => {
            setPage(1)
            setRatingValue(newValue);
          }}
        />
      </div>
      <div>
        <h4 className='font-semibold mb-4'>Price</h4>
        <span className='flex justify-between'>
          <span className='text-sm text-textSecondary'>
            Min:
            <span>${priceRange[0]}</span>
          </span>
          <span className='text-sm text-textSecondary'>
            Max: 
            <span>${priceRange[1]}</span>
          </span>
        </span>
        <Slider
          getAriaLabel={() => 'price-range'}
          step={10}
          value={priceRange}
          onChange={handlePriceSlider}
          valueLabelDisplay="off"
          disableSwap
          max={maxPrice}
          min={minPrice}
          getAriaValueText={valuetext}
        />
      </div>
      <button className='btn-primary w-full mb-4 lg:mb-0' onClick={filterbyPrice}>Filter By Price</button>
      <button 
        className='py-2 w-full bg-red-400 text-white rounded-md hover:opacity-80 transition-all duration-500' 
        onClick={resetFilters}
        >Reset Filters</button>
    </>
  )
}

export default ShopSideBar