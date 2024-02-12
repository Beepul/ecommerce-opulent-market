import React, { useEffect, useState } from 'react'
import DashTitle from '../DashTitle'
import { UserData } from '../../../static/data'
import { useGetAllUserQuery, useGetBestSellingProductQuery, useGetTotalSalesQuery, useTopCategoriesQuery, useTotalProfileLossQuery } from '../../../redux/services/statsApi'
import { FcSalesPerformance } from "react-icons/fc";
import { Skeleton } from '@mui/material'
import { HiUsers } from "react-icons/hi2";
import PieChart from '../../../components/charts/PieChart'
import { ChartType } from '../../../type/chart'
import { TopCategory } from '../../../type/category'
import BarChart from '../../../components/charts/BarChart';
import {BestSellingProduct} from '../../../type/product';
import LineChart from '../../../components/charts/LineChart';
import BestSellingProducts from '../Products/BestSellingProducts';

const initialChartData: ChartType = {
  labels: [],
  datasets: [
    {
      label: '',
      data: [],
    }
  ]
}

const Dashboard = () => {
  const [userData,setUserData] = useState({
    labels: UserData.map((data) => data.year.toString()),
    datasets: [
      {
        label: 'Product Sold This Year',
        data: UserData.map((data) => data.userGain),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ]
  })
  const [catPieChartData, setCatPieChartData] = useState<ChartType>(initialChartData)

  const {data: salesData, isLoading: totalSalesLoading} = useGetTotalSalesQuery('')
  const {data: allUserData, isLoading: userLoading} = useGetAllUserQuery('')
  const {data: profitLossData, isLoading: profitLossLoading} = useTotalProfileLossQuery('')
  const {data: catData, isLoading: catLoading} = useTopCategoriesQuery('')
  const {data: bestSellingProductData, isLoading: bestSellingLoading} = useGetBestSellingProductQuery('')



  
  useEffect(() => {
    if(!catLoading){
      if(catData){
        setCatPieChartData({
          labels: catData.topCategories.slice(0,5).map((c: TopCategory) => c.categoryName),
          datasets: [
            {
              label: 'Total Sales',
              data: catData.topCategories.slice(0,5).map((c: TopCategory) => c.totalSales),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        })
      }
    }

  },[catData,catLoading])

  
  return (
    <section className='pb-12'>
      <DashTitle title='Dashboard' />
      <main className='pl-4 lg:pl-0'>
        <section className='pr-5 my-8 flex flex-wrap gap-6'>
          {
            totalSalesLoading ? (
              <div className='flex min-w-[250px] flex-1 gap-4 bg-bgGray p-6 rounded-md shadow-lg '>
                <div className='mb-3'>
                  <Skeleton variant="circular" sx={{bgcolor: '#ffffff'}} width={40} height={40} />
                </div>
                <div className='flex flex-col gap-2'>
                  <Skeleton
                    variant="rounded"
                    width={180}
                    height={18}
                    sx={{bgcolor: '#ffffff'}}
                  />
                  <Skeleton
                    variant="rounded"
                    width={180}
                    height={58}
                    sx={{bgcolor: '#ffffff'}}
                  />
                </div>
              </div>
            ) : (
              <div className='flex min-w-[250px] flex-1 gap-4 bg-bgGray p-6 rounded-md shadow-lg'>
                <div className='mb-3 bg-white h-[44px] w-[44px] rounded-full flex items-center justify-center'>
                  <FcSalesPerformance className="stroke-black text-xl" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h4 className='font-semibold text-xl'>Total Sales</h4>
                  <p className='text-lg'>${salesData.totalSales}</p>

                </div>
              </div>
            )
          }
          {
            userLoading ? (
              <div className='flex min-w-[250px] flex-1 gap-4 bg-bgGray p-6 rounded-md shadow-lg '>
                <div className='mb-3'>
                  <Skeleton variant="circular" sx={{bgcolor: '#ffffff'}} width={40} height={40} />
                </div>
                <div className='flex flex-col gap-2'>
                  <Skeleton
                    variant="rounded"
                    width={180}
                    height={18}
                    sx={{bgcolor: '#ffffff'}}
                  />
                  <Skeleton
                    variant="rounded"
                    width={180}
                    height={58}
                    sx={{bgcolor: '#ffffff'}}
                  />
                </div>
              </div>
            ) : (
              <div className='flex min-w-[250px] flex-1 gap-4 bg-bgGray p-6 rounded-md shadow-lg'>
                <div className='mb-3 bg-white h-[44px] w-[44px] rounded-full flex items-center justify-center'>
                  <HiUsers className="fill-yellow-500 text-xl" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h4 className='font-semibold text-xl'>Total Users</h4>
                  <p className='text-lg'>{allUserData.userCount}</p>

                </div>
              </div>
            )
          }
          {
            profitLossLoading ? (
              <div className='flex min-w-[250px] flex-1 gap-4 bg-bgGray p-6 rounded-md shadow-lg '>
                <div className='mb-3'>
                  <Skeleton variant="circular" sx={{bgcolor: '#ffffff'}} width={40} height={40} />
                </div>
                <div className='flex flex-col gap-2'>
                  <Skeleton
                    variant="rounded"
                    width={180}
                    height={18}
                    sx={{bgcolor: '#ffffff'}}
                  />
                  <Skeleton
                    variant="rounded"
                    width={180}
                    height={58}
                    sx={{bgcolor: '#ffffff'}}
                  />
                </div>
              </div>
            ) : (
              <div className='flex min-w-[250px] flex-1 gap-4 bg-bgGray p-6 rounded-md shadow-lg'>
                <div className='mb-3 bg-white h-[44px] w-[44px] rounded-full flex items-center justify-center'>
                  <HiUsers className="fill-yellow-500 text-xl" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h4 className='font-semibold text-xl'>Total Profit / Loss</h4>
                  <p className='text-lg'>${profitLossData.totalProfitLoss}</p>

                </div>
              </div>
            )
          }
        </section>
        <section className='flex xl:flex-row flex-col gap-6 pr-5'>
          <main className='flex-1 '>
            <div className='mb-12 bg-bgGray p-6 rounded-md shadow-lg'>
              <BarChart  chartData={userData}/>  
            </div>
            <div className='bg-bgGray p-6 rounded-md shadow-lg'>
              {
                bestSellingLoading ? (
                  <Skeleton
                  variant="rounded"
                  width={500}
                  height={300}
                  sx={{bgcolor: '#ccc'}}
                  />
                ) : (
                  <div>
                    <h4 className='text-xl font-semibold text-center mb-4'>Best Selling Products</h4>
                    <BestSellingProducts products={bestSellingProductData.mostSoldProducts} />
                  </div>
                )
              }
            </div>
          </main>
          <aside className='xl:w-[32%]'>
            <section className='bg-bgGray p-6 rounded-md shadow-lg flex flex-col items-center '>
              <h4 className='text-lg font-semibold text-center mb-6'>Top Categories</h4>
              <div className='' >
                <PieChart chartData={catPieChartData} />
              </div>
            </section>
          </aside>
        </section>
      </main>
    </section>
  )
}

export default Dashboard