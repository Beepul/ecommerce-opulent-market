import { baseApi } from "./baseApi";

const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        checkout: builder.mutation({
            query: (data) => ({
                method: 'POST',
                url: '/stripe/create-checkout-session',
                body: data
            }),
            invalidatesTags: [{type: 'Order'},{type: 'Stats'}]
        }),
        getAllOrders: builder.query({
            query: ({user}) => {
                const params = new URLSearchParams()
                
                if(user){
                    params.append('user',user)
                }

                const queryString = params.toString()
                const query = queryString ? `/orders/?${queryString}` : '/orders/'
                return query
            },
            providesTags: [{type: 'Order'}]
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/orders/${id}`
            }),
            invalidatesTags: [{type: 'Order'},{type: 'Stats'}]
        }),
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/orders/',
                method: 'POST',
                body: data
            }),
            invalidatesTags: [{type: 'Order'},{type: 'Product'},{type: 'Stats'}]
        }),
        updateOrder: builder.mutation({
            query: (data) => ({
                url: `/orders/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: [{type: 'Order'},{type: 'Stats'}]
        })
    })
})

export const {useCheckoutMutation, useGetAllOrdersQuery, useDeleteOrderMutation, useCreateOrderMutation, useUpdateOrderMutation} = orderApi