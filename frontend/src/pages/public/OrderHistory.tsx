import ProfileSidebar from '../../components/profile/ProfileSidebar'
import { useGetAllOrdersQuery } from '../../redux/services/orderApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import Loader from '../../components/Loader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button } from '@mui/material'
import { AiOutlineEye } from 'react-icons/ai'
import { Order } from '../../type/order'
import { useNavigate } from 'react-router-dom'
import { Product } from '../../type/product'


type ItemType = {
  product: Product;
  quantity: number;
  _id: string;
}


const OrderHistory = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const {data, isLoading, isError} = useGetAllOrdersQuery({user: user?._id})

  const navigate = useNavigate()


  const columns: GridColDef[] = [
    {field: 'products', headerName: 'Products', width: 180,
      renderCell(params) {
        const products = params.row.items as ItemType[]
          return (
            <div className='flex flex-col gap-1'>
              {
                products.map((item,i) => (
                    <p key={i} className='capitalize'>{item.product.name}</p>
                ))
              }
            </div>
          )
      },
    },
    {field: 'price', headerName: 'Price', width: 100,
      renderCell(params) {
        const products = params.row.items as ItemType[]
          return (
            <div className='flex flex-col gap-1'>
              {
                products.map((item,i) => (
                    <p key={i}>{item.product.price}</p>
                ))
              }
              </div>
          )
      },
    },
    {field: 'discount', headerName: 'Discount', width: 100,
      renderCell(params) {
        const products = params.row.items as ItemType[]
          return (
            <div className='flex flex-col gap-1'>
              {
                products.map((item,i) => (
                    <p key={i}>{item.product.discountPercentage || '0'}</p>
                ))
              }
              </div>
          )
      },
    },
    {field: 'afterDicountPrice', headerName: 'Price After Discount', width: 180,
      renderCell(params) {
        const products = params.row.items as ItemType[]
          return (
            <div className='flex flex-col gap-1'>
              {
                products.map((item,i) => (
                    <p key={i}>{(item.product.discountPercentage && item.product.discountPercentage > 0) ? 
                        Number(item.product.price) - (Number(item.product.price) * Number(item.product.discountPercentage) / 100) : 
                        item.product.price
                      }</p>
                ))
              }
            </div>
          )
      },
    },
    {field: 'quantity', headerName: 'Quantity', width: 100,
      renderCell(params) {
        const products = params.row.items as ItemType[]
          return (
            <div className='flex flex-col gap-1'>
              {
                products.map((item,i) => (
                    <p key={i}>{item.quantity}</p>
                ))
              }
              </div>
          )
      },
    },
    {field: 'subtotal', headerName: 'Sub Total', width: 100,
      renderCell(params) {
        const products = params.row.items as ItemType[]
          return( 
            <div>
              {
                products.map((item,i) => (
                  <p key={i}>{(item.product.discountPercentage && item.product.discountPercentage > 0) ? (
                    Number(item.product.price) - (Number(item.product.price) * Number(item.product.discountPercentage) / 100) * Number(item.quantity)
                  ): (
                    Number(item.product.price) * Number(item.quantity)
                  )}</p>
                ))
              }
            </div>
          )
      },
    },
    {field: 'shippingAmt', headerName: 'Shipping Price', width: 130,
      valueGetter(_params) {
        return '$20'
      },
    },
    {field: 'totalPrice', headerName: 'Total Price', width: 100,
      valueGetter(params) {
        return '$' + params.value
      },
    },
    { field: 'paymentStatus', headerName: 'Payment Status', width: 130,
      renderCell(params) {
          return (
            <p className='capitalize'>{params.row.paymentDetails.paymentStatus}</p>
          )
      },
    },
		{ field: 'status', headerName: 'Order Status', width: 130 ,cellClassName: 'capitalize'},
    {
      field: 'preview',
      headerName: 'Preview',
      width: 90,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
              <Button onClick={() => navigate(`/dashboard/order/${params.id}`)}>
                <AiOutlineEye size={20} />
              </Button>
          </>
        )
      }
    }
	];
  function getRowId(row: Order) {
    return row._id;
  }


  return (
    <section className='container flex gap-9 py-12 flex-col md:flex-row'>
      <aside className='min-w-[250px]'>
        <ProfileSidebar active={2} />
      </aside>
      <main className='flex-1 max-w-[calc(100%-250px-36px)]'>
        {
          isLoading ? (
            <div className='min-h-[300px] flex flex-col items-center justify-center'>
                <Loader />
              </div>
          ) : isError ? (
            <div className='min-h-[300px] flex flex-col items-center justify-center'><p className='text-lg font-semibold capitalize'>Opps! Something Went Wrong</p></div>
          ) : (
            <div style={{ height: 400, width: '100%' }} className="lg:pr-5 px-4 lg:pl-0">
              <h2 className='mb-6 font-semibold text-xl'>Order History</h2>
              <DataGrid
                rows={data.orders}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 }
                  }
                }}
                getRowId={getRowId}
                pageSizeOptions={[ 5, 10 ]}
                disableRowSelectionOnClick
                
              />
            </div>
          )
        }
      </main>
    </section>
  )
}

export default OrderHistory