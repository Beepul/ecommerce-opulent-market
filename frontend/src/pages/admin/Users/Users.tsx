import DashTitle from '../DashTitle'
import { useGetAllUserQuery } from '../../../redux/services/statsApi'
import Loader from '../../../components/Loader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {User} from '../../../type/user'
import dayjs from 'dayjs'

const Users = () => {
    const {data,isLoading,isError} = useGetAllUserQuery('')

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 200,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 200,
            valueGetter: (params) => {
                return dayjs(params.value).format('DD/MM/YYYY')
            }
        },
    ]
    const getRowId = (row:User) => row._id
  return (
    <section>
        <DashTitle title='All Users' />
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
                    rows={data.users}
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

export default Users