import React from 'react'
import DashTitle from '../DashTitle'
import { useGetAllOrdersQuery } from '../../../redux/services/orderApi'
import { useParams } from 'react-router-dom'
import {Order} from '../../../type/order'
import { Product } from '../../../type/product'
import { Skeleton } from '@mui/material'

const PreviewOrder = () => {

  const {id} = useParams()

  console.log(id)

  const {data,isLoading} = useGetAllOrdersQuery('',{
    selectFromResult: ({data,isLoading}) => ({
      data: data?.orders?.find((order: Order) => order._id === id),
      isLoading
    })
  })

  console.log(data)
  return (
    <section>
      <DashTitle title='Order Details' />
      <main className='flex flex-wrap gap-6 pr-5 pl-4 lg:pl-0 mb-12'>
        {
          isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <section key={index} className='bg-bgGray flex gap-4 p-6 rounded-md shadow-lg flex-1 min-w-[350px] '>
                <Skeleton variant='rectangular' width={80} height={'100%'} />
                <div>
                  <Skeleton variant="rectangular" className='mb-5' width={250} height={18} />
                  <Skeleton variant="rectangular" width={250} height={48} />
                </div>
              </section>
            ))
          ) : data ? (
            <>
              <section className='bg-bgGray p-6 rounded-md shadow-lg flex-1 min-w-[350px] '>
                <h2 className='text-lg font-semibold text-gray-500 mb-4'>Product Details</h2>
                <div className='border-t border-gray-400 pt-4'>
                  <div>
                      {
                        data.items.map((item: {product: Product},index:number) => (
                          <div key={index} className='pb-5 flex gap-4'>
                            <img src={item.product.images[0].url} alt={item.product.name} className='w-[80px] object-cover' />
                            <div>
                              <p className='text-[14px]'><strong>Name:</strong> {item.product.name}</p>
                              <p className='text-[14px]'><strong>Price:</strong> ${item.product.price}</p>
                              { item.product.discountPercentage && (
                                <p className='text-[14px]'><strong>Discount:</strong> {item.product.discountPercentage}%</p>
                              )}
                              <p className='text-[14px]'><strong>ADP:</strong> {item.product.price - (item.product.price * (item.product.discountPercentage / 100))}</p>
                            </div>
                          </div>
                        ))
                      }
                  </div>
                </div>
              </section> 
              <section className='bg-bgGray p-6 rounded-md shadow-lg flex-1 min-w-[350px]'>
                <h2 className='text-lg font-semibold text-gray-500 mb-4'>Order Details</h2>
                <div className='border-t border-gray-400 pt-4'>
                  <p className='mb-3 capitalize'><strong>Order Status: </strong>{data.status}</p>
                  <p className='mb-3'><strong>Created At: </strong>{data.createdAt}</p>
                  {
                    data.deliveredAt && <p className='mb-3'><strong>Created At: </strong>{data.deliveredAt}</p>
                  }
                  <p className='mb-3 capitalize'><strong>Total Price:</strong> {data.totalPrice}</p>
                  <p className='mb-3 capitalize'><strong>Payment Status:</strong> {data.paymentDetails.paymentStatus}</p>
                  <p className='mb-3 capitalize'><strong>Payment Method:</strong> {data.paymentDetails.paymentMethod}</p> 
                </div>
              </section>
              <section className='bg-bgGray p-6 rounded-md shadow-lg flex-1 min-w-[350px]'>
                <h2 className='text-lg font-semibold text-gray-500 mb-4'>User Details</h2>
                <div className='border-t border-gray-400 pt-4'>
                  {
                    data.user.pic && (
                      <div className='mb-3'>
                        <img src={data.user.pic} className='h-[80px] w-[80px] rounded-full' />
                      </div>
                    )
                  }
                  <p className='mb-3'><strong>Id: </strong>{data.user._id}</p>
                  <p className='mb-3'><strong>Name: </strong>{data.user.name}</p>
                  <p className='mb-3'><strong>Email: </strong>{data.user.email}</p>
                  <p className='mb-3'><strong>Role: </strong>{data.user.role}</p>
                </div>
              </section>
              <section className='bg-bgGray p-6 rounded-md shadow-lg flex-1 min-w-[350px] '>
                <h2 className='text-lg font-semibold text-gray-500 mb-4'>Shipping Address Details</h2>
                <div className='border-t border-gray-400 pt-4'>
                  <p className='mb-3'><strong>Country: </strong>{data.shippingAddress.country.name}</p>
                  <p className='mb-3'><strong>State: </strong>{data.shippingAddress.state.name}</p>
                  <p className='mb-3'><strong>City: </strong>{data.shippingAddress.city}</p>
                  <p className='mb-3'><strong>Street: </strong>{data.shippingAddress.street}</p>
                  <p className='mb-3'><strong>Postal Code: </strong>{data.shippingAddress.postalCode}</p>
                </div>
              </section>
              
              
            </>
          ) : (
            <div className='min-h-[400px] flex items-center justify-center'>Opps! Something Went Wrong</div>
          )
        }
      </main>
    </section>
  )
}

export default PreviewOrder