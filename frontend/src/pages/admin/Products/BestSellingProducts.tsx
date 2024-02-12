import React from 'react'
import { BestSellingProduct } from '../../../type/product'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {AiOutlineEye} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

type BestSellingProductsProps = {
  products: BestSellingProduct[]
}

const BestSellingProducts:React.FC<BestSellingProductsProps> = ({products}) => {
  // console.log(products)

  const navigate = useNavigate()

  const columns: GridColDef[] = [
    { 
      field: 'name',
      headerName: 'Name', 
      width: 250 , 
      valueGetter: (params) => {
        return params.row.product.name
      }
    }, 
    {
      field: 'totalQuantitySold',
      headerName: 'Total Quantity Sold',
      width: 250,
    },
    {
      field: 'Preview',
      headerName: 'Preview',
      width: 250,
      renderCell: (params) => {
        return (
          <button
            onClick={() => navigate(`/product/${params.id}`)}
          ><AiOutlineEye  className="text-lg"/></button>
        )
      }
    }
  ] 

  function getRowId(row:BestSellingProduct) {
    return row.product._id
  }
  return (
    <DataGrid
      rows={products}
      columns={columns}
      getRowId={getRowId}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10]}
    />
  )
}

export default BestSellingProducts