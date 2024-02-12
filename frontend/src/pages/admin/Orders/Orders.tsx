import React from 'react';
import DashTitle from '../DashTitle';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { Order } from '../../../type/order';
import { Product } from '../../../type/product';
import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../redux/services/orderApi';
import Loader from '../../../components/Loader';
import EditOrder from './EditOrder';
import { ResponseError } from '../../../type/error';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type ItemType = {
  product: Product;
  quantity: number;
  _id: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '4px',
  boxShadow: 24,
  p: 4,
};

const Orders = () => {
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);


  
  const {data, isLoading, isError} = useGetAllOrdersQuery('')
  const [deleteOrder, {isLoading: deleting}] = useDeleteOrderMutation()

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const navigate = useNavigate()

  const handleDeleteOrder = async (id:string) => {
    try {
      const result = await deleteOrder(id).unwrap()
      if('error' in result){
        toast.error('Cannot Delete This Order')
        return
      }
      handleCloseDelete()
      toast.success('Order deleted Successfully')
    } catch (error) {
      const resErr = error as ResponseError
      toast.error(resErr.data?.message || 'Cannot Delete Order')
    }
  } 

	const columns: GridColDef[] = [
    {field: 'name', headerName: 'Name', width: 180,
      renderCell(params) {
          return <p className='capitalize'>{params.row.user.name}</p>
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
      valueGetter(params) {
        return '$20'
      },
    },
    {field: 'totalPrice', headerName: 'Total Price', width: 100,
      valueGetter(params) {
        return '$' + params.value
      },
    },
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
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 90,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={handleOpen}
            >
              <FiEdit size={20} />
            </Button>
            <EditOrder open={open} handleClose={handleClose} order={params.row} />
          </>
        )
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 90,
      sortable: false,
      renderCell: (params) => {

        return (
          <>
            <Button onClick={() => handleOpenDelete()} >
              <AiOutlineDelete size={20} />
            </Button>
            <Modal
              open={openDelete}
              onClose={handleCloseDelete}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className='min-w-[450px] text-center'>
                  <p className='text-xl font-semibold mb-1'>Delete This Order?</p>
                  <p className='text-[15px] mb-4'>Are Your Sure?</p>
                  <div className='flex gap-4 justify-center'>
                    <button 
                      onClick={() => handleDeleteOrder(params.id as string)}
                      className='bg-red-600 text-white py-2 px-8 rounded-md hover:opacity-70 transition-all duration-500'>Delete</button>
                    <button 
                      onClick={handleCloseDelete}
                      className='bg-blue-600 text-white py-2 px-8 rounded-md hover:opacity-70 transition-all duration-500'>Cancle</button>
                  </div>
                </div>
              </Box>
            </Modal>
          </>
        )
      }
    },
	];
  function getRowId(row: Order) {
    return row._id;
  }
	return (
		<section>
			<DashTitle title="Orders" />
      <main>
        {
          isLoading ? (
            <div className='min-h-[300px] flex flex-col items-center justify-center'>
                <Loader />
              </div>
          ) : isError ? (
            <div className='min-h-[300px] flex flex-col items-center justify-center'><p className='text-lg font-semibold capitalize'>Opps! Something Went Wrong</p></div>
          ) : (
            <div style={{ height: 400, width: '100%' }} className="lg:pr-5 px-4 lg:pl-0">
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
	);
};

export default Orders;
