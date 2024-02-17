import { useEffect, useState } from 'react'
import DashTitle from '../DashTitle'

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { FiEdit } from "react-icons/fi";
import { useDeleteProductMutation, useGetProductsQuery } from '../../../redux/services/productApi';
import { Product } from '../../../type/product';
import { ResponseError } from '../../../type/error';
import { toast } from 'react-toastify';


type DataGridProduct = {
  id: string;
  name: string;
  price: number;
  discountPercentage: number;
  stockQuantity: number;
  image: string;
}

const Products = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  
  const [productList,setProductList] = useState<DataGridProduct[]>([])
  const {data,isLoading:getProductsLoading,refetch} = useGetProductsQuery({
    page: paginationModel.page || 0, perPage: paginationModel.pageSize || 5
  })

  const [rowCountState, setRowCountState] = useState(
    data?.count || 0,
  );
  

  const [deleteProduct,{isLoading:deleteLoading}] = useDeleteProductMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if(getProductsLoading){
      return
    }
    if(data){
      const products: Product[] = data.products 
      const newArray = products.map((item) => {
        return {
          id: item._id,
          name: item.name,
          price: item.price,
          image: item.images[0].url,
          discountPercentage: item.discountPercentage,
          stockQuantity: item.stockQuantity,
        }
      })
      setProductList(newArray)
    }
  },[data,getProductsLoading])


  const handleDelete = async (id: string) => {
    try {
       const result = await deleteProduct(id)
       console.log({result})
       if('error' in result){
         toast.error('Error Orrcured While Deleting Product')
         return
      }
        toast.success('Product Delected Successfully')
    } catch (error) {
      const resErr = error as ResponseError
      toast.error(resErr.data?.message || 'Error Orrcured While Deleting Product')
    }

  }

  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: 'Image', 
      width: 80,
      renderCell: (params) => {
        return (
          <>
            <img src={params.value} alt='' className='w-[40px] h-[40px] rounded' />
          </>
        )
      }
    },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'price', headerName: 'Price', width: 130 },
    { 
      field: 'discountPercentage', 
      headerName: 'Discount',
      width: 130 ,
      valueGetter(params) {
          return params.value ? (params.value + '%') : ''
      },
    },
    { field: 'stockQuantity', headerName: 'Stock', width: 130 },
    {
      field: 'preview',
      headerName: 'Preview',
      width: 90,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
              <Button onClick={() => navigate(`/product/${params.id}`)}>
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
            <Button onClick={() => navigate(`/dashboard/edit-product/${params.id}`)}>
              <FiEdit size={20} />
            </Button>
          </>
        )
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      // type: 'number',
      width: 90,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <button 
              onClick={() => handleDelete(params.id.toString())} 
              className={`${deleteLoading ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}
              disabled={deleteLoading}
              >
              <AiOutlineDelete size={20} />
            </button>
          </>
        )
      }
    },
   
  ];

  useEffect(() => {
    refetch()
  },[paginationModel])

  useEffect(() => {
    setRowCountState((prevCount: number) =>
      data?.count !== undefined ? data?.count : prevCount,
    );
  }, [data?.count, setRowCountState]);

  // console.log({paginationModel})


  return (
    <section className='max-w-[100%]'>
      <DashTitle title='Prodcuts' />
        <div style={{height: 400, width: '100%'}} className='lg:pr-5 px-4 lg:pl-0'>
          <DataGrid
            rows={productList}
            columns={columns}
            loading={getProductsLoading}
            rowCount={rowCountState}
            disableRowSelectionOnClick
            pageSizeOptions={[5,10]}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
          />
        </div>
    </section>
  )
}

export default Products