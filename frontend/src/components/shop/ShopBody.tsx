import { Box, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { Anchor } from '../../type/SideDrawer';
import SideDrawer from '../SideDrawer';
import ShopSideBar from './ShopSideBar';
import ShopProductList from '../products/ShopProductList';
import { Product } from '../../type/product';
import Loader from '../Loader';

type RequestDataType = {
  category: string[],
  rating: number | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  sortBy?: string,
}

type ShopBodyProps = {
  products: Product[];
  isLoading: boolean;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setRequestData:React.Dispatch<React.SetStateAction<RequestDataType>>;
  requestData: RequestDataType;
  setSelectedCat: React.Dispatch<React.SetStateAction<string[]>>;
  setRatingValue: React.Dispatch<React.SetStateAction<number | null>>;
  ratingValue: number | null;
  priceRange: number[];
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  productsPerPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  minPrice: number;
  maxPrice: number;
}

const ShopBody:React.FC<ShopBodyProps> = ({
  products,
  isLoading,
  sortBy,
  setSortBy,
  setRequestData,
  requestData,
  setSelectedCat,
  setRatingValue,
  ratingValue,
  priceRange,
  setPriceRange,
  productsPerPage,
  setPage,
  minPrice,
  maxPrice
}) => {
  const [drawerState, setDrawerState] = useState({
    top: false,
    left: false,
    right: false
  })

  const handleChange = (event: SelectChangeEvent) => {
    setRequestData({...requestData,sortBy:event.target.value})
    setSortBy(event.target.value)
  };

  const toggleDrawer = (anchor: Anchor, open: boolean) => (e: React.MouseEvent) => {
    if(e.target instanceof HTMLInputElement){
      return 
    }
    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const filterList = (
		<Box sx={{ width: '250px' }} role="presentation">
      <header className='bg-primary flex justify-between items-center py-4 px-4'>
        <p className='text-white'>Your Cart</p>
        <button className='text-white sidebar__close-btn'  onClick={toggleDrawer('left', false)}>
          <IoIosCloseCircleOutline className="text-white text-lg" />
        </button>
      </header>
      <div className='px-4 pb-4'>
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
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
		</Box>
	);

  return (
    <div className='mb-12'>
      <div className='flex justify-between lg:items-center flex-col lg:flex-row items-start'>
        <h2 className='text-xl font-semibold'>Shop</h2>
        <div className='flex items-center gap-2 justify-between w-full lg:w-auto'>
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Sort By</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={sortBy}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={''}>Sort by latest</MenuItem>
                <MenuItem value={'name:asc'} className='text-sm'>Sort by Asc</MenuItem>
                <MenuItem value={'name:desc'} className='text-sm'>Sort by Desc</MenuItem>
                <MenuItem value={'price:asc'} className='text-sm'>Sort by price: low to high</MenuItem>
                <MenuItem value={'price:desc'} className='text-sm'>Sort by price: high to low</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='block lg:hidden'>
            <button className='flex items-center gap-1' onClick={toggleDrawer('left', true)}>
              <HiMiniBars3BottomRight />
              Filters
            </button>
            <Drawer anchor={'left'} open={drawerState.left}>
		          {filterList}
	          </Drawer>
          </div>
        </div>
      </div>
      <div className='h-full mt-4'>
        {
          isLoading ? (
            <div className='min-h-[500px] flex justify-center items-center'>
              <Loader />
            </div>
          ): (
            <ShopProductList products={products} />
          )
        }
      </div>
    </div>
  )
}

export default ShopBody