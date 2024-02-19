import DashTitle from '../DashTitle'
import { useGetAllOrdersQuery } from '../../../redux/services/orderApi'
import { useParams } from 'react-router-dom'
import {Order} from '../../../type/order'
import OrderPreviewDetails from '../../../components/order/OrderPreviewDetails'

const PreviewOrder = () => {

  const {id} = useParams()


  const {data,isLoading} = useGetAllOrdersQuery('',{
    selectFromResult: ({data,isLoading}) => ({
      data: data?.orders?.find((order: Order) => order._id === id),
      isLoading
    })
  })



  return (
    <section>
      <DashTitle title='Order Details' />
      <OrderPreviewDetails data={data} isLoading={isLoading} />
    </section>
  )
}

export default PreviewOrder