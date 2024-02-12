import { baseApi } from "./baseApi";

const addressApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAddress: builder.mutation({
            query: (data) => ({
                method: 'POST',
                url: '/address/',
                body: data
            }),
        }),
        updateAddress: builder.mutation({
            query: (data) => ({
                method: 'PUT',
                url: `/address/${data.userId}/${data.addressId}`,
                body: data
            }),
            invalidatesTags: [{type: 'Order'}]
        })
    })
})

export const { useCreateAddressMutation, useUpdateAddressMutation } = addressApi