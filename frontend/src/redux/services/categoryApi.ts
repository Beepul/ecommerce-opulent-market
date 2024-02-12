import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategory: builder.query({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        addCategory: builder.mutation({
            query: (data) => ({
                url: '/categories/',
                method: 'POST',
                body: {...data}
            }),
            invalidatesTags: [{type: 'Category'}]
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',   
            }),
            invalidatesTags: [{type: 'Category' }]
        }),
        updateCategory: builder.mutation({
            query: ({id,data}) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: [{type: 'Category'}]
        }),
    })
})


export const {useAddCategoryMutation, useGetAllCategoryQuery, useDeleteCategoryMutation, useUpdateCategoryMutation} = categoryApi