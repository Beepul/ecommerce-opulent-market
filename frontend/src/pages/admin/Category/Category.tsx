import React from 'react'
import DashTitle from '../DashTitle'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useDeleteCategoryMutation, useGetAllCategoryQuery } from '../../../redux/services/categoryApi'
import { Button } from '@mui/material'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import Loader from '../../../components/Loader'
import { Category } from '../../../type/category'
import { ResponseError } from '../../../type/error'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'




const Category = () => {

  const {isLoading,data} = useGetAllCategoryQuery('')
  const [deleteCategory, {isLoading:deleteLoading}] = useDeleteCategoryMutation()

  const navigate = useNavigate()

  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: 'Image', 
      width: 160,
      renderCell: (params) => {
        return (
          <>
            <img src={params.value.url} alt='' className='w-[40px] h-[40px] rounded' />
          </>
        )
      }
    },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'count', headerName: 'No. Of Products', width: 160 },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 160,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
            onClick={() => {
              navigate(`/dashboard/edit-category/${params.id}`)
            }}
            >
              <FiEdit size={20} />
            </Button>
          </>
        )
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 160,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={async () => {
              try {
                await deleteCategory(params.id)
                toast.success(`Category Deleted: ${params.row.name}`)
              } catch (error) {
                const resErr = error as ResponseError
                toast.error(resErr.data?.message || 'Failed to delete category')
              }
            }}
            disabled={deleteLoading}
            className={`disabled:cursor-not-allowed ${deleteLoading ? 'opacity-70': 'opacity-100'}`}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        )
      }
    },
   
  ];

  function getRowId(row: Category) {
    return row._id;
  }

  return (
    <section>
      <DashTitle title='Category List' />
      <main>
        {isLoading ? (
          <div className='flex items-center justify-center min-h-400px'>
            <Loader />
          </div>
        ) : data ? (
            <div style={{height: 400, width: '100%'}} className='lg:pr-5 px-4 lg:pl-0'>
              <DataGrid
                rows={data?.categories}
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
        ) : (
          <p>Something Went Wrong</p>
        )}
      </main>
    </section>
  )
}

export default Category