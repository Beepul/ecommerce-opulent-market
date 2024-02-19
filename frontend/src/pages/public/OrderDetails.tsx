import { useParams } from 'react-router-dom'
import { useGetAllOrdersQuery } from '../../redux/services/orderApi'
import { Order } from '../../type/order'
import DashTitle from '../admin/DashTitle'
import OrderPreviewDetails from '../../components/order/OrderPreviewDetails'

const OrderDetails = () => {
    const {id} = useParams()

    const {data,isLoading} = useGetAllOrdersQuery('',{
        selectFromResult: ({data,isLoading}) => ({
        data: data?.orders?.find((order: Order) => order._id === id),
        isLoading
        })
    })

  return (
    <section className='pl-5'>
      <DashTitle title='Order Details' />
      <OrderPreviewDetails data={data} isLoading={isLoading} />
    </section>
  )
}

export default OrderDetails