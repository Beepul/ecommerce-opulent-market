import DashTitle from '../DashTitle'
import { useGetAllTransactionQuery } from '../../../redux/services/statsApi'
import Loader from '../../../components/Loader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Transaction } from '../../../type/transaction'
import { AiOutlineEye } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'



const Transaction = () => {
  const {data,isLoading,isError} = useGetAllTransactionQuery('')

  const navigate = useNavigate()

  const columns: GridColDef[] = [
    {
      field: 'amount_subtotal', headerName: 'Sub Total', width: 130,
      valueGetter: (params) => '$' + params.value
    },
    {
      field: 'shipping_cost', headerName: 'Shipping Cost', width: 130,
      valueGetter: (params) => '$' + params.value
    },
    {
      field: 'amount', 
      headerName: 'Total Amount', 
      width: 130, 
      valueGetter: (params) => '$' + params.value
    },
    {
      field: 'payment_status', headerName: 'Payment Status', width: 130,
      renderCell: (params) => <p className='capitalize'>{params.value}</p>
    },
    {
      field: 'order_details', headerName: 'Order Details', width: 130,
      renderCell: (params) => {
        return (
          <button onClick={()=> navigate(`/dashboard/order/${params.row.order}`)}><AiOutlineEye className="text-lg"/></button>
        )
      } 
    }
  ]

  const getRowId = (row:Transaction) => row._id
  return (
    <section>
      <DashTitle title='All Transactions' />
      <main>
        {
          isLoading ? (
            <div className='min-h-[300px] flex flex-col items-center justify-center'>
                <Loader />
            </div>
          ) : isError ? (
            <div className='min-h-[300px] flex flex-col items-center justify-center'><p className='text-lg font-semibold capitalize'>Opps! Something Went Wrong</p></div>
          ) : (
            <div style={{height: 400, width: '100%'}} className='lg:pr-5 px-4 lg:pl-0'>
              <DataGrid
                rows={data.transactions}
                columns={columns}
                getRowId={getRowId}
                initialState={{
                    pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
              />
            </div>
          )
        }
      </main>
    </section>
  )
}

export default Transaction